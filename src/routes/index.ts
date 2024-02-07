import { Router } from 'express';
import * as TicketsController from '../controllers/AllTickets.controller';


const routes = Router();

routes.get('/tickets', TicketsController.getAllTickets);

export  {routes};




