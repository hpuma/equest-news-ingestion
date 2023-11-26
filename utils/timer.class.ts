export class Timer {
  private startTime: any;
  private globalStartTime: any;

  constructor() {}

  startTimer(isGlobal = false) {
    const time = Date.now();
    const timeSource = isGlobal ? "globalStartTime" : "startTime";
    this[timeSource] = time;
  }
  printTimer(
    source: string = "",
    message: string = "",
    count: number = 0,
    isGlobal = false
  ) {
    const time = Date.now();
    const startTime = isGlobal ? this.globalStartTime : this.startTime;
    let timeTaken = time - startTime;

    console.log(`🚀 ${source} => ${message} => ${count}  ...${timeTaken}ms`);
  }
}
