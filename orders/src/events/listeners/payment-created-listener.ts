import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus,
} from '@botickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found!');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    console.log('The current status of the order!', order.status);

    // For future reference, make OrderCompletedPublisher, and send off to other services in the app,
    // that need the info

    msg.ack();
  }
}
