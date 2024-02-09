// Busca todos os tickets fechados e traz a soma

import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';



export const getSumOfTicketsClosed = async (req: Request, res: Response) => {
  try {
    const countOfItems = await Tickets.count({
      where: {
        status: 6,
        is_deleted: 0
      },
    });

    res.json({ countOfItems });
  } catch (error) {
    console.error('Erro ao contar o número de itens com situação igual a fechado:', error);
    res.status(500).json({ error: 'Erro ao contar o número de itens com situação igual a fechado.' });
  }
};
