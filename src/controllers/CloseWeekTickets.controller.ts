// Busca todos os tickets fehcados na semana

import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';
import { Sequelize, Op } from 'sequelize';

export const getSumOfTicketsClosedThisWeek = async (req: Request, res: Response) => {
  try {
    // Determinar o período da semana atual
    const now = new Date();
    const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const lastDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);

    // Consultar o banco de dados para buscar os tickets fechados dentro desse período
    const countOfClosedTickets = await Tickets.count({
      where: {
        status: 6, // Supondo que o status 6 representa tickets fechados
        closedate: {
          [Op.between]: [firstDayOfWeek, lastDayOfWeek]
        }
      }
    });

    // Retornar o resultado como resposta da requisição
    res.json({ countOfClosedTickets });
  } catch (error) {
    console.error('Erro ao calcular a soma de tickets fechados nesta semana:', error);
    res.status(500).json({ error: 'Erro ao calcular a soma de tickets fechados nesta semana.' });
  }
};
