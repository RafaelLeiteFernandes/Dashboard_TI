import { Router } from 'express';
import * as TicketsController from '../controllers/AllTickets.controller';
import * as AllTickets from '../controllers/SumAllTickets.controller'


const routes = Router();

routes.get('/tickets', TicketsController.getAllTickets);
routes.get('/alltickets',AllTickets.getSumOfTicketsClosed)

export  {routes};




