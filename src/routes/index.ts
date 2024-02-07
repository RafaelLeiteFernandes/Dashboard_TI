import { Router } from 'express';
import * as TicketsController from '../controllers/AllTickets.controller';
import * as AllTickets from '../controllers/SumAllTickets.controller'
import * as CloseWeek from '../controllers/CloseWeekTickets.controller'



const routes = Router();

routes.get('/tickets', TicketsController.getAllTickets);
routes.get('/alltickets',AllTickets.getSumOfTicketsClosed);
routes.get('/ticketsweek', CloseWeek.getSumOfTicketsClosedThisWeek);

export  {routes};




