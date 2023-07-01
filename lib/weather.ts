import axios from 'axios';
import { IPeriod } from './IPeriod';
import { IWeatherSummary } from './IWeatherSummary';

export const getWeather = async (): Promise<IWeatherSummary[]> => {
  console.log('Getting weather');
  const url = 'https://api.weather.gov/gridpoints/ILM/64,50/forecast/hourly';
  
  const response = await axios.get(url);
  const periods: IPeriod[] = response.data.properties.periods;

  const result = periods
    .filter(periodIsToday)
    .map(getWeatherForPeriod);

  return result;
}

const getWeatherForPeriod = (period: IPeriod): IWeatherSummary => ({
  temperature: period.temperature,
  precipProb: period.probabilityOfPrecipitation.value,
  windSpeed: Number.parseInt(period.windSpeed.split(' mph')[0])
});

const periodIsToday = (period: IPeriod): boolean => {
  // Get the current day as a Date object.
  const currentDate = new Date();

  // Get the day of the timestamp as a Date object.
  const timestampDate = new Date(period.endTime.split('T')[0]);

  return currentDate.toDateString() === timestampDate.toDateString();
}
