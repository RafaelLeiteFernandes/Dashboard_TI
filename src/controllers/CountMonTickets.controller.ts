// Média diária
import { Request, Response } from 'express';
import { Tickets } from '../models/Tickets';
import { Sequelize, Op, literal } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_DB as string, process.env.PG_USER as string, process.env.PG_PASSWORD as string, {
  host: 'localhost',
  dialect: 'mysql',
});

export const getDailyAverageClosedTickets = async (req: Request, res: Response) => {
  try {
    // Consultar o banco de dados para obter o número total de chamados fechados
    const totalClosedTickets = await Tickets.count({
      where: {
        status: 6,
        is_deleted: 0, // Supondo que o status 6 representa chamados fechados
      },
       
    });

    // Determinar a data do primeiro chamado criado
    const firstTicketDate: number = await Tickets.min('date_creation', { plain: true });

    // Determinar a quantidade de dias desde o início do registro até o momento atual
    const now = new Date();
    const daysSinceStart = Math.ceil((now.getTime() - firstTicketDate) / (1000 * 3600 * 24));

    // Calcular a média diária de chamados fechados
    const dailyAverage = totalClosedTickets / daysSinceStart;

    // Retornar a média diária como resposta da requisição
    res.json({ dailyAverage });
  } catch (error) {
    console.error('Erro ao calcular a média diária de chamados fechados:', error);
    res.status(500).json({ error: 'Erro ao calcular a média diária de chamados fechados.' });
  }
};
