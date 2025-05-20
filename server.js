// server.js
import cluster from 'cluster';
import os from 'os';
import logger from './src/utils/logger.js';
import app from './src/app.js';

const PORT = process.env.PORT || 9988;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    logger.info(`Primary process ${process.pid} is running in port ${PORT}`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.warn(`Worker ${worker.process.pid} died. Starting a new one...`);
        cluster.fork();
    });
} else {
    app.listen(PORT, () => {
        logger.info(`Worker ${process.pid} started on port ${PORT}`);
    });
}
