import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'

function start() {
    const baseUrl = `http://${HOST}:${PORT}`;

    app.listen(PORT, HOST, () => {
        console.log(`========================================`);
        console.log(` Server is running on port ${PORT}`);
        console.log(` URL: ${baseUrl}`);
        console.log(`========================================`);
    });
}

start();