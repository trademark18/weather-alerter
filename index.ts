import { http, events, schedule } from "@ampt/sdk";
import express, { Router } from "express";
import { getWeather } from './lib/weather';

const app = express();
const publicApi = Router();

enum AppEvents {
  CheckWeather = 'check-weather'
}

// Every morning at 8 AM, initiate a weather check
schedule('Morning weather check').cron('0 8 ? * * *', () => {
  events.publish(AppEvents.CheckWeather, {})
})

// Handle weather update
events.on(AppEvents.CheckWeather, async () => {
  const weather = await getWeather();
});

publicApi.get("/test", (req, res) => {
  console.log('Received request');
  events.publish(AppEvents.CheckWeather, {});
  return res.status(200).send({ message: "Hello from the public api!" });
});

app.use("/", publicApi);

http.useNodeHandler(app);
