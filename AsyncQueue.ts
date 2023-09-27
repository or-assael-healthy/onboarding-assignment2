import { AsyncQueueConsumer, AsyncQueueHandler } from "./AsyncQueueConsumer";

export class AsyncQueue<T = unknown> {
  private queue: Array<Array<T>> = [];
  private consumer: AsyncQueueConsumer<T>;

  constructor(handler: AsyncQueueHandler) {
    this.consumer = new AsyncQueueConsumer(handler, this.queue);
  }

  public add(...args: T[]) {
    this.queue.push(args);

    if (!this.consumer.isRunning()) {
      this.consumer.run();
    }
  }

  public stop() {
    this.consumer.stop();
  }

  public restart() {
    this.consumer.run();
  }

  public getQueueSize() {
    return this.queue.length;
  }
}
