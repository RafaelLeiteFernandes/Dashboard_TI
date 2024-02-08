// Busca todos os tickets fechados por mes trazendo todos os meses

import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';
import { Sequelize, Op, fn, col } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_DB as string, process.env.PG_USER as string, process.env.PG_PASSWORD as string, {
  host: 'localhost',
  dialect: 'mysql',
});

export const getClosedTicketsByMonth = async (req: Request, res: Response) => {
  try {
    // Consultar o banco de dados para buscar os tickets fechados por mês
    const closedTicketsByMonth = await Tickets.findAll({
      attributes: [
        [fn('YEAR', col('solvedate')), 'year'],
        [fn('MONTH', col('solvedate')), 'month'],
        [fn('COUNT', '*'), 'count']
      ],
      where: {
        status: 6 // Supondo que o status 6 representa chamados fechados
      },
      group: [fn('YEAR', col('solvedate')), fn('MONTH', col('solvedate'))],
      raw: true
    });

    // Retornar os resultados como resposta da requisição
    res.json({ closedTicketsByMonth });
  } catch (error) {
    console.error('Erro ao buscar os chamados fechados por mês:', error);
    res.status(500).json({ error: 'Erro ao buscar os chamados fechados por mês.' });
  }
};
