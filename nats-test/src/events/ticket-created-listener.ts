import { Listener } from '../../../common/src/events/base-listener';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '../../../common/src/events/ticket-created-event';
import { Subjects } from '../../../common/src/events/subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  //subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated; // readonly prevents a property from a class from being changed
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    // explains what happens during the event
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.price);

    msg.ack(); // will successfully mark message as passed
  }
}
