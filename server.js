import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/routes.js';

const app = express();

app.use(cors()); // permite requisições de qualquer origem (para dev)
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
