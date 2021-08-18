import express from 'express';

// setup express server
const app = express();
app.use(express.static('client'));

// expose port
const PORT = process.env.port || 8080;
app.listen(PORT, () => console.log(`client started on port ${PORT}`));
