import { INotificationManager } from "./INotificationManager";
import axios from 'axios';

export class NotificationManager implements INotificationManager {
  private apiKey;
  private axiosConfig;
  private url = 'https://api.pushbullet.com/v2/pushes';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.axiosConfig = {
      headers: {
        'Access-Token': this.apiKey
      }
    }
  }

  send = async (message: string): Promise<void> => {
    console.log(`Sending message via pushbullet`);
    const data = {
      type: 'note',
      title: 'Classic Car Weather Verdict',
      body: message
    }
    const result = await axios.post(this.url, data, this.axiosConfig);
    if(result.status !== 200) throw new Error('Failed to push notification!');
  }
}