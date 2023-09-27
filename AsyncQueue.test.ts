import { AsyncQueue } from "./AsyncQueue";
import { setTimeout } from "timers/promises";

const uploadFile = (fileName: string, file: string) =>
  new Promise<void>(async (resolve) => {
    logWrapper(`Started uploading: ${fileName}, ${file}`);
    await setTimeout(1000);
    logWrapper(`Done uploading: ${fileName}`);
    resolve();
  });

const cleanUp = async (
  queue: AsyncQueue<any>,
  timeout = 1000,
  maxTries = 5
) => {
  queue.stop();
  while (queue.getQueueSize() > 0 && maxTries > 0) {
    await setTimeout(timeout);
    maxTries--;
  }
};

const logWrapper = jest.fn();

describe("Testing AsyncQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Testing AsyncQueue with one file", async () => {
    // ARRANGE
    const fileUploadQueue = new AsyncQueue<string>(uploadFile);

    // ACT
    fileUploadQueue.add("1", "file1");
    await cleanUp(fileUploadQueue);

    // ASSERT
    expect(logWrapper).toHaveBeenCalledTimes(2);
    expect(logWrapper).toHaveBeenNthCalledWith(
      1,
      "Started uploading: 1, file1"
    );
    expect(logWrapper).toHaveBeenNthCalledWith(2, "Done uploading: 1");
  });

  test("Testing AsyncQueue with multiple files", async () => {
    // ARRANGE
    const fileUploadQueue = new AsyncQueue<string>(uploadFile);

    // ACT
    fileUploadQueue.add("1", "file1");
    fileUploadQueue.add("2", "file2");
    fileUploadQueue.add("3", "file3");
    await cleanUp(fileUploadQueue, 3000);

    // ASSERT
    expect(logWrapper).toHaveBeenCalledTimes(6);

    expect(logWrapper).toHaveBeenCalledWith("Started uploading: 1, file1");
    expect(logWrapper).toHaveBeenCalledWith("Started uploading: 2, file2");
    expect(logWrapper).toHaveBeenCalledWith("Started uploading: 3, file3");

    expect(logWrapper).toHaveBeenCalledWith("Done uploading: 1");
    expect(logWrapper).toHaveBeenCalledWith("Done uploading: 2");
    expect(logWrapper).toHaveBeenCalledWith("Done uploading: 3");
  }, 10000);

  test("Testing queue will keep running after an error", async () => {
    // ARRANGE
    const errorMessage = "Error was needed";
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const functionThatThrowsifTrue = async (shouldThrow: boolean) => {
      if (shouldThrow) {
        throw new Error(errorMessage);
      }
      await setTimeout(1000);
    };
    const throwQueue = new AsyncQueue<boolean>(functionThatThrowsifTrue);

    // ACT
    throwQueue.add(false);
    throwQueue.add(true);
    throwQueue.add(false);
    throwQueue.add(false);

    await cleanUp(throwQueue, 5000);

    // ASSERT
    expect(throwQueue.getQueueSize()).toBe(0);
    expect(errorSpy).toHaveBeenNthCalledWith(
      1,
      `Error in queue handler with parameters: true, error: Error: ${errorMessage}`
    );

    errorSpy.mockReset();
  }, 10000);

  test("Testing queue will finish all items after stopping it", async () => {
    // ARRANGE
    const functionThatDoesNothing = jest.fn(async () => {
      await setTimeout(1000);
    });
    const queue = new AsyncQueue<void>(functionThatDoesNothing);
    // ACT
    queue.add();
    queue.add();
    await cleanUp(queue);

    // ASSERT
    expect(functionThatDoesNothing).toHaveBeenCalledTimes(2);
    expect(queue.getQueueSize()).toBe(0);
  });
});
