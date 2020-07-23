import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { requireAuth } from '@botickets/common';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined, // find all the tickets, that do not have a corresponding order
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
