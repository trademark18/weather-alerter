import axios from 'axios';


export const getWeather = async () => {
  console.log(`Attempting to get weather!`);
  const url = 'https://api.weather.gov/gridpoints/ILM/64,50/forecast/hourly';
  
  const data = await axios.get(url);

  console.log(data);

}