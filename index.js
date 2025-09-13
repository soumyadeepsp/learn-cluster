// create an express server
const express = require('express');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const os = require('os');
const http = require('http');
const router = require('./routes/index');
// setup mongoose
const mongoose = require('mongoose');
// require('./config/mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/', router);
 
// if (cluster.isMaster) {
//     console.log(`Master process is running with process id: ${process.pid}`);
//     const workers = [];
//     // Fork workers.
//     for (let i = 0; i < Math.min(5, os.cpus().length); i++) {
//         const worker = cluster.fork({workerId: i + 1}); // env variables
//         workers.push(worker);

//         // Listen for messages from workers
//         worker.on('message', (message) => {
//             console.log(`Master received message from Worker ${message.workerId}:`, message.data);

//             // Forward the message to the target worker
//             if (message.workerId && workers[message.workerId - 1]) {
//                 workers[message.workerId - 1].send(message.data);
//             }
//         });
//     }
    

//     cluster.on('exit', (worker, code, signal) => {
//         // this CB func gets triggered if a particular worker application crashes due to some runtime error
//         console.log(`Worker ${worker.process.pid} died. Forking a new worker.`);
//         cluster.fork();
//     });
// } else {
//     // start an http server
//     const server = http.createServer(app);
//     server.listen(port, () => {
//         console.log(`Worker process started with process id: ${process.pid}`);
//         console.log(`Server is running on http://localhost:${port}`);
//     });

//     // I want worker 1 to send a message to worker 2 after 5 seconds of its startup
//     if (process.env.workerId === '1') {
//         console.log("inside process with worker id 1");
//         setTimeout(() => {
//             console.log("sending message from worker 1 to worker 2");
//             process.send({ workerId: 2, data: { message: 'Hello from Worker 1!' } });
//         }, 5000);
//     }

//     process.on('message', (data) => {
//         console.log(`Worker ${process.env.workerId} received message:`, data);
//     });
// }

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});