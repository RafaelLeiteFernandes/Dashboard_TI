import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carregue as variáveis de ambiente do arquivo .env
dotenv.config();

// Configure o Sequelize com as informações do arquivo .env
export const sequelize = new Sequelize(
    process.env.PG_DB as string,
    process.env.PG_USER as string,
    process.env.PG_PASSWORD as string,
    {
        dialect: 'mysql',
        host: process.env.PG_HOST as string, 
        port: parseInt(process.env.PG_PORT as string),
        database: process.env.PG_DB as string
    }
);
