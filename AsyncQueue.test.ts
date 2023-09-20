import { AsyncQueue } from "./AsyncQueue";

const uploadFile = (fileName: string, file: string) =>
  new Promise<void>((resolve) => {
    logWrapper(`Started uploading: ${fileName}, ${file}`);
    setTimeout(() => {
      logWrapper(`Done uploading: ${fileName}`);
      resolve();
    }, 1000);
  });

async function cleanUp(queue: AsyncQueue, timeout = 3000) {
  queue.stop();
  await new Promise((resolve) => setTimeout(resolve, timeout));
}

let logWrapper = (message: string) => {
  console.log(message);
};

describe("Testing AsyncQueue", () => {
  test("Testing AsyncQueue with one file", async () => {
    // ARRANGE
    logWrapper = jest.fn();
    const fileUploadQueue = new AsyncQueue(uploadFile);

    // ACT
    fileUploadQueue.add("1", "file1");
    await cleanUp(fileUploadQueue);

    // ASSERT
    expect(logWrapper).toHaveBeenCalledTimes(2);
  });

  test("Testing AsyncQueue with multiple files", async () => {
    // ARRANGE
    const numberOfPreviousCalls = (logWrapper as jest.Mock).mock.calls.length;
    const fileUploadQueue = new AsyncQueue(uploadFile);

    // ACT
    fileUploadQueue.add("1", "file1");
    fileUploadQueue.add("2", "file2");
    fileUploadQueue.add("3", "file3");
    await cleanUp(fileUploadQueue, 7000);

    // ASSERT
    expect(logWrapper).toHaveBeenCalledTimes(numberOfPreviousCalls + 6);
  }, 10000);

  test("Testing queue will keep running after an error", async () => {
    // ARRANGE
    async function functionThatThrowsifTrue(shouldThrow: boolean) {
      if (shouldThrow) {
        throw new Error("Error was needed");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const throwQueue = new AsyncQueue(functionThatThrowsifTrue);

    // ACT
    throwQueue.add(false);
    throwQueue.add(true);
    throwQueue.add(false);
    throwQueue.add(false);

    await cleanUp(throwQueue, 5000);

    // ASSERT
    expect(throwQueue.getQueueSize()).toBe(0);
  }, 10000);

  test("Testing queue will finish all items after stopping it", async () => {
    // ARRANGE
    const functionThatDoesNothing = jest.fn(() => {
      console.log("Doing nothing");
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });
    const queue = new AsyncQueue(functionThatDoesNothing);
    // ACT
    queue.add();
    queue.add();
    await cleanUp(queue, 3000);

    // ASSERT
    expect(functionThatDoesNothing).toHaveBeenCalledTimes(2);
  });
});
