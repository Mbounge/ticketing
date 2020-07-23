import { Subjects, Publisher, PaymentCreatedEvent } from '@botickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
