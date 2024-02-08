// ChamadosPorMotivoController.ts
import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';
import { Sequelize, Op } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_DB as string, process.env.PG_USER as string, process.env.PG_PASSWORD as string, {
  host: 'localhost',
  dialect: 'mysql',
});

export const getTicketsByCategory = async (req: Request, res: Response) => {
  try {
    // Consultar o banco de dados para obter o número de chamados por motivo
    const ticketsByCategory = await Tickets.findAll({
      attributes: ['itilcategories_id', [sequelize.fn('COUNT', '*'), 'count']],
      group: ['itilcategories_id'],
    });

    // Retornar o resultado como resposta da requisição
    res.json({ ticketsByCategory });
  } catch (error) {
    console.error('Erro ao buscar os chamados por motivo:', error);
    res.status(500).json({ error: 'Erro ao buscar os chamados por motivo.' });
  }
};
