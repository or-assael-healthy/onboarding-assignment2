export class AsyncQueueConsumer {
  private callback: Function;
  private queue: Array<Array<any>>;
  private runQueue: boolean = false;

  constructor(callback: Function, queue: Array<Array<any>>) {
    this.callback = callback;
    this.queue = queue;
  }

  public async run() {
    this.runQueue = true;
    while (this.runQueue || this.queue.length > 0) {
      const nextOperation = this.queue.shift();
      if (nextOperation) {
        try {
          await this.callback(...nextOperation);
        } catch (e) {
          const parameters = nextOperation.flatMap((x) => x.toString());
          console.log(
            `Error in queue callback with parameters: ${parameters}, error: ${e}`
          );
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  public stop() {
    this.runQueue = false;
  }

  public isRunning() {
    return this.runQueue;
  }

  public getQueueSize() {
    return this.queue.length;
  }
}
