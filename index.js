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
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('./config/redis');

const app = express();
const port = 3000;
const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URI = "http://localhost:3000/auth/callback";
const Oauth2Client = require('google-auth-library').OAuth2Client;
const client = new Oauth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.get('/auth/google', (req, res) => {
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile'],
        redirect_uri: REDIRECT_URI
    });
    console.log(authUrl);
    res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    console.log(tokens.id_token);
    // send the token in the response
    res.send({ token: tokens.id_token, message: "Login Successful" });
});

// Create a rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 5,                 // limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.'
});
// Apply to all requests
app.use(limiter);
app.use(bodyParser.json());

// cron.schedule('*/5 * * * * *', () => {
//     console.log('Running every 1 seconds');
// });

// client.connect().then(async () => {
//     await client.set("mykey", "Hello World1");
//     console.log(await client.get("mykey"));
// });

// client.set("mykey", "Hello World1");
// console.log(client.get("mykey"));

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
