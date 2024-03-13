export class Timer {
  private startTime: any;
  private globalStartTime: any;
  private source: string = "";
  private printMessage: string = "";

  startTimer(source: string, printMessage: string, isGlobal = false) {
    this.source = source;
    this.printMessage = printMessage;

    const time = Date.now();
    const timeSource = isGlobal ? "globalStartTime" : "startTime";
    this[timeSource] = time;
  }
  printTimer(count: number = 0, isGlobal = false) {
    const time = Date.now();
    const startTime = isGlobal ? this.globalStartTime : this.startTime;
    let timeTaken = time - startTime;

    console.log(
      `🚀 ${this.source} => ${this.printMessage} => ${count}  ...${timeTaken}ms`
    );
  }
}
