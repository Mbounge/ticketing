import { Publisher, OrderCreatedEvent, Subjects } from '@botickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
