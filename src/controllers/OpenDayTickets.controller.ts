// Chamados que foram criados hoje
import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';
import { Sequelize, Op } from 'sequelize';


export const getTicketsCreatedToday = async (req: Request, res: Response) => {
  try {
    // Determinar o intervalo de tempo para o dia atual
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Consultar o banco de dados para buscar os tickets criados hoje
    const ticketsCreatedToday = await Tickets.count({
      where: {
        date_creation: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    // Retornar os tickets criados hoje como resposta da requisição
    res.json({ ticketsCreatedToday });
  } catch (error) {
    console.error('Erro ao buscar os chamados criados hoje:', error);
    res.status(500).json({ error: 'Erro ao buscar os chamados criados hoje.' });
  }
};
