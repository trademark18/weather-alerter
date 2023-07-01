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
schedule('Morning weather check').cron('0 8 ? * * *', () => {
  console.log('Doing regularly-scheduled weather check')
  events.publish(AppEvents.CheckWeather, {})
});

// Every morning at 8 AM, initiate a weather check
schedule('Test weather check').cron('40 14 ? * * *', () => {
  console.log('Doing regularly-scheduled weather check')
  events.publish(AppEvents.CheckWeather, {})
});

// Handle weather update
events.on(AppEvents.CheckWeather, async () => {
  // Retrieve weather forecast
  const weather = await getWeather();

  // Get a message that says whether it's a good day to drive
  const summaryMessage = getWeatherMessage(weather);
  events.publish(AppEvents.WeatherSummary, { summaryMessage });
});

// Handle notification
events.on(AppEvents.WeatherSummary, async (event: IEvent<ISummaryEvent>) => {
  // Send that by Pushbullet
  await notificationManager.send(event.body.summaryMessage);
  console.log('Done sending message');
});

/**
 * A testing endpoint to allow for easier development
 */
publicApi.get("/test", (req, res) => {
  console.log('Triggering a test request via the browser');
  events.publish(AppEvents.CheckWeather, {});
  return res.status(200).send({ message: "Hello from the public api!" });
});

app.use("/", publicApi);

http.useNodeHandler(app);
