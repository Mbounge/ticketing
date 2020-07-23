import { Publisher, OrderCancelledEvent, Subjects } from '@botickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
