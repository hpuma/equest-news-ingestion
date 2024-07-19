export class Timer {
  private startTime: any;
  private globalStartTime: any;
  private source: string = "";

  startTimer(source: string, isGlobal = false) {
    this.source = source;
    const time = Date.now();
    const timeSource = isGlobal ? "globalStartTime" : "startTime";
    this[timeSource] = time;
  }

  printTimer(
    count: number = 0,
    printMessage: string = "NO_RECORDS",
    isGlobal = false
  ) {
    const time = Date.now();
    const startTime = isGlobal ? this.globalStartTime : this.startTime;
    let timeTaken = time - startTime;

    console.log(
      `🚀 ${this.source} => ${printMessage} => ${count}  ...${timeTaken}ms`
    );
  }
}
