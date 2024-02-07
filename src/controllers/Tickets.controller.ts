import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const list = await Tickets.findAll();
    res.json({
      list
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter os tickets.' });
  }
};
