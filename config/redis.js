const redis = require('redis');
const client = redis.createClient();

// cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
//     cluster.fork();
// });
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => {
    console.log('Connected to Redis');
});

module.exports = client;