import {
  Subjects,
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
} from '@botickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found!');
    }

    console.log(
      'In expiration complete listener, the order status is',
      order.status
    );
    if (order.status === OrderStatus.Complete) {
      console.log('Order is complete!!!!!!!!!!!!!!!!!!!');
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    console.log('order is now cancelled');
    await order.save();

    // Publish event saying that order has been cancelled
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
