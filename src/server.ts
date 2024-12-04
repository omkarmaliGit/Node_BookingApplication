import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import authRoutes from './routes/auth';

const app = express();
app.use(bodyParser.json()); //bodyparser middleware
app.use(express.static(path.join(__dirname, '../public'))); //middleware to access static files

// Routes
app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
