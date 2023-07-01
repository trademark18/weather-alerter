export interface INotificationManager {
  send(message: string): Promise<void>
}