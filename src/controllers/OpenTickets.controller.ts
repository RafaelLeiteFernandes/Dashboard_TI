// Busca todos os tickets em aberto

import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';
import { Sequelize, Op } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_DB as string, process.env.PG_USER as string, process.env.PG_PASSWORD as string, {
  host: 'localhost',
  dialect: 'mysql',
});

export const getOpenTickets = async (req: Request, res: Response) => {
  try {
    // Consultar o banco de dados para buscar os tickets em aberto
    const openTickets = await Tickets.count({
      where: {
        status: {
          [Op.in]: [1, 2] // Supondo que os status 1 e 2 representam chamados em aberto
        },
        is_deleted: 0
      }
    });

    // Retornar os tickets em aberto como resposta da requisição
    res.json({ openTickets });
  } catch (error) {
    console.error('Erro ao buscar os tickets em aberto:', error);
    res.status(500).json({ error: 'Erro ao buscar os tickets em aberto.' });
  }
};
