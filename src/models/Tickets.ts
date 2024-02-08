import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/pg';

export interface TickInstance extends Model {
  quantidadeItens: number;
  id: number;
  name: string;
  date: Date;
  closedate: Date;
  status: number;
  itilcategories_id:string;
  date_creation: Date;
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
  date: {
    type: DataTypes.DATE,
  },
  closedate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.INTEGER,
  },
  itilcategories_id: {
    type: DataTypes.INTEGER,
  },
  date_creation: {
    type: DataTypes.DATE,
  }

}, {
  tableName: 'glpi_tickets',
  timestamps: false,
});
