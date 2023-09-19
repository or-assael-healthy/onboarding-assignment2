JS Coding Assignment

### Background

Developers at Healthy.io are in charge of developing a wide range of services and infrastructures. Our deployments serve a wide range of research and medical applications that impact the lives of real patients, helping with the diagnostics of medical conditions from the comfort of their home.

This task will help us understand your coding abilities, thought process and problem solving skills.

Good luck!

### Scenario

We want to upload a bunch of files. Not simultaneously though. Only one at a time.

This is the function we use to (mock) upload each file:

|

const uploadFile = (fileName, file) =>\
 new  Promise(resolve => {\
 console.log(`Started uploading: ${fileName}`);\
    setTimeout(() => {\
 console.log(`Done uploading: ${fileName}`)\
      resolve();\
}, 5e3);\
  });

 |

This is the "simple" way to upload our files one at a time:

|

const uploadFiles = async () => {\
 await uploadFile('1', 'file1')\
 await uploadFile('2', 'file2')\
 await uploadFile('3', 'file3')\
}

uploadFiles();

 |

We don't like this though because:

-   The list of files is hard-coded

-   We can't add more files whenever we want

-   If one file upload fails (by throwing an error), the process will end

As a solution to these issues, we want to use a queueing mechanism which allows us to "push" to a queue whenever we get a new file. It would be used like this:

|

const fileUploadQueue = new AsyncQueue(uploadFile);

fileUploadQueue.add('1', 'file1');\
fileUploadQueue.add('2', 'file2');\
fileUploadQueue.add('3', 'file3');

// In this scenario, the queue will upload one file at a time (until done).

// At any time, we can add more files to the queue:

fileUploadQueue.add('4', 'file4');\
fileUploadQueue.add('5', 'file5');

 |

### Requirements

-   You should implement the AsyncQueue class. This class will run asynchronous tasks in series.

-   You should make the class completely generic so that it can later be used for any asynchronous task.

### Guidelines

-   Your code should be implemented using ES2017 standards (async/await) and expose a single main module.

-   Your solution should be committed to a remote repository which we'll be able to access.

-   Please include a readme with your code, describing how to consume it.