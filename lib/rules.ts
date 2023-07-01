import { IWeatherSummary } from './IWeatherSummary'
import { params } from '@ampt/sdk';

enum ParamName {
  MAX_PRECIP = 'MAX_PRECIP',
  MAX_WIND = 'MAX_WIND',
  MAX_TEMP = 'MAX_TEMP',
  MIN_TEMP = 'MIN_TEMP'
}

const ALL_CLEAR_MESSAGE = `Today is a great day to drive the classic car!`;
const messageBase = 'Today is too {} to drive the classic car.';

export const getWeatherMessage = (summaries: IWeatherSummary[]) => {
  const weatherIssueSet = new Set<string>();

  summaries.forEach(summary => {
    getWeatherIssues(summary).forEach(issue => weatherIssueSet.add(issue));
  });

  const weatherIssues = Array.from(weatherIssueSet);

  // Build message
  // No issues
  if(weatherIssues.length === 0) return ALL_CLEAR_MESSAGE;

  // One issue
  if(weatherIssues.length === 1) return messageBase.replace('{}', weatherIssues[0]);

  // Two issues
  if(weatherIssues.length === 2) {
    return messageBase.replace('{}', weatherIssues.join(' and '));
  }

  // Three or more issues
  let issuesString = weatherIssues.slice(0, weatherIssues.length - 1).join(', ');
  issuesString += `, and ${weatherIssues[weatherIssues.length - 1]}`;
  
  return messageBase.replace('{}', issuesString);
}

const getWeatherIssues = (summary: IWeatherSummary): string[] => {
  const issues: string[] = [];
  
  // Check precip probability
  const maxPrecip = getParamNum(ParamName.MAX_PRECIP);
  if(summary.precipProb > maxPrecip) issues.push('rainy');

  // Check max wind
  const maxWind = getParamNum(ParamName.MAX_WIND);
  if(summary.windSpeed > maxWind) issues.push('windy');

  // Check max temp
  const maxTemp = getParamNum(ParamName.MAX_TEMP);
  if(summary.temperature > maxTemp) issues.push('hot');

  // Check min temp
  const minTemp = getParamNum(ParamName.MIN_TEMP);
  if(summary.temperature < minTemp) issues.push('cold');

  return issues;
}


const getParamNum = (param: ParamName): number => {
  const value = params(param);
  if(!Number.isFinite(Number.parseInt(value))) throw new Error(`${param} parameter must be a number`);
  return value;
}
