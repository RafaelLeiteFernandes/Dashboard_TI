import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'; // Importe o pacote 'cors' corretamente

// Importe suas rotas aqui
import { routes } from "../src/routes/index";

const app = express();

// Configure o middleware cors antes de definir suas rotas
app.use(cors());
app.use(express.json());
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      return response.status(400).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
);

app.listen(3333, () => console.log('Server listening on port 3333'));
