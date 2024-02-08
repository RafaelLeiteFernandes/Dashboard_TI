import { Router } from 'express';
import * as TicketsController from '../controllers/AllTickets.controller';
import * as AllTickets from '../controllers/SumAllTickets.controller';
import * as CloseWeek from '../controllers/CloseWeekTickets.controller';
import * as OpenTickets from '../controllers/OpenTickets.controller';
import * as CloseTicketsMon from '../controllers/MonTickets.controller';
import * as OpenTicketsWeek from '../controllers/WeekTickets.controller';
import * as Createatday from '../controllers/OpenDayTickets.controller';
import * as Media from '../controllers/CountMonTickets.controller';
import * as Description from '../controllers/TypeTickets.controller';


const routes = Router();

//base
routes.get('/tickets', TicketsController.getAllTickets);

// contagem dos fechados
routes.get('/alltickets',AllTickets.getSumOfTicketsClosed);

// fechados durante a semana
routes.get('/ticketsweek', CloseWeek.getSumOfTicketsClosedThisWeek);

// chamados em aberto
routes.get('/openTickets', OpenTickets.getOpenTickets);

// Chamados fechados por mês
routes.get('/closeMon',CloseTicketsMon.getClosedTicketsByMonth);

// chamados aberto na semana 
routes.get('/openTicketsThisWeek',OpenTicketsWeek.getOpenTicketsThisWeek);

// chamados criados hoje
routes.get('/createtoday', Createatday.getTicketsCreatedToday);

// media mensal trazer somente de 2024
routes.get('/dailyAverageClosedTickets', Media.getDailyAverageClosedTickets);

// divisao por motivo
routes.get('/ticketsByCategory', Description.getTicketsByCategory);






export  {routes};




