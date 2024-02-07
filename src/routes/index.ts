import { Router } from 'express';
import * as TicketsController from '../controllers/Tickets.controller';


const routes = Router();

routes.get('/tickets', TicketsController.getAllTickets )//TodoController.getAllFreuencia);

export  {routes};




