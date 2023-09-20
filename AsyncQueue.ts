import { AsyncQueueConsumer } from "./AsyncQueueConsumer";

export class AsyncQueue {
  private queue: Array<Array<any>> = [];
  private consumer: AsyncQueueConsumer;

  constructor(callback: Function) {
    this.consumer = new AsyncQueueConsumer(callback, this.queue);
  }

  public add(...args: any[]) {
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
