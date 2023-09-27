export type AsyncQueueHandler<T = unknown> = (
  ...args: T[]
) => Promise<void> | Promise<unknown>;

export class AsyncQueueConsumer<T = unknown> {
  private readonly handler: AsyncQueueHandler;
  private readonly queue: Array<Array<T>>;
  private runQueue: boolean = false;

  constructor(handler: AsyncQueueHandler, queue: Array<Array<T>>) {
    this.handler = handler;
    this.queue = queue;
  }

  public async run() {
    this.runQueue = true;
    while (this.runQueue || this.queue.length > 0) {
      const nextOperation = this.queue[0];
      if (nextOperation) {
        try {
          await this.handler(...nextOperation);
        } catch (e) {
          const parameters = nextOperation.flatMap((x) => x.toString());
          console.error(
            `Error in queue handler with parameters: ${parameters}, error: ${e}`
          );
        }
      }
      this.queue.shift();
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
