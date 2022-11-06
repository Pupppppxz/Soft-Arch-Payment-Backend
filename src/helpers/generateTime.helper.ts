export class GenerateTimeStamp {
  static getCurrentTime(date?: Date): string {
    if (date)
      return date.toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok',
      });
    return new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
    });
  }
}
