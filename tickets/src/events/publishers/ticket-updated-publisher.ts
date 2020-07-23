import { Publisher, Subjects, TicketUpdatedEvent } from '@botickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
