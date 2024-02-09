// Busca todos os tickets abertos durante a semana atual

import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';
import { Sequelize, Op } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_DB as string, process.env.PG_USER as string, process.env.PG_PASSWORD as string, {
  host: 'localhost',
  dialect: 'mysql',
});

export const getOpenTicketsThisWeek = async (req: Request, res: Response) => {
  try {
    // Determinar o período da semana atual
    const now = new Date();
    const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const lastDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);

    // Consultar o banco de dados para buscar os tickets abertos dentro desse período
    const openTicketsThisWeek = await Tickets.count({
      where: {
        date_creation: {
          [Op.between]: [firstDayOfWeek, lastDayOfWeek],
        },
      },
    });

    // Retornar os tickets abertos nesta semana como resposta da requisição
    res.json({ openTicketsThisWeek });
  } catch (error) {
    console.error('Erro ao buscar os chamados abertos nesta semana:', error);
    res.status(500).json({ error: 'Erro ao buscar os chamados abertos nesta semana.' });
  }
};
