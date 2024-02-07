import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/pg';

export interface TickInstance extends Model {
  id: number;
  name: string;
}

export const Tickets = sequelize.define<TickInstance>('glpi_tickets', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'glpi_tickets', // Verifique se o nome da tabela está correto
  timestamps: false,
});
