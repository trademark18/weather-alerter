import { http, events, schedule, params } from "@ampt/sdk";
import express, { Router } from "express";
import { getWeather } from './lib/weather';
import { getWeatherMessage } from './lib/rules';
import { NotificationManager } from "./lib/NotificationManager";

const app = express();
const publicApi = Router();
const notificationManager = new NotificationManager(params('PUSHBULLET_API_KEY'));

enum AppEvents {
  CheckWeather = 'check-weather',
  WeatherSummary = 'weather-summary'
}

interface IEvent<T> {
  target: string;
  id: string;
  name: string;
  body: T;
  time: number;
  delay: number;
}

interface ISummaryEvent {
  summaryMessage: string;
}

// Every morning at 8 AM, initiate a weather check
schedule('Morning weather check').cron('55 11 ? * * *', async () => {
  console.log('Doing regularly-scheduled weather check');
  await doWeatherCheck();
  // events.publish(AppEvents.CheckWeather, {})
});

// Handle weather update
events.on(AppEvents.CheckWeather, async () => {
  console.log(`Received check weather event`);
  await doWeatherCheck();
  // events.publish(AppEvents.WeatherSummary, { summaryMessage });
});

const doWeatherCheck = async () => {
  // Retrieve weather forecast
  const weather = await getWeather();

  // Get a message that says whether it's a good day to drive
  const summaryMessage = getWeatherMessage(weather);
  await sendNotification(summaryMessage);
}

// Handle notification
events.on(AppEvents.WeatherSummary, async (event: IEvent<ISummaryEvent>) => {
  // Send that by Pushbullet
  console.log(`Received weather summary event`);
  await sendNotification(event.body.summaryMessage);
});

const sendNotification = async (message: string) => {
  await notificationManager.send(message);
  console.log('Done sending message');
}

/**
 * A testing endpoint to allow for easier development
 */
publicApi.get("/test", async (req, res) => {
  console.log('Triggering a test request via the browser');
  await doWeatherCheck();
  // events.publish(AppEvents.CheckWeather, {});
  return res.status(200).send({ message: "Hello from the public api!" });
});

app.use("/", publicApi);

http.useNodeHandler(app);
