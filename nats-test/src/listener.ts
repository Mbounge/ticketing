import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto'; // used for testing, but k8s has a great way to deal with this
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  // 2nd arg is clientId // check the nats stats site for more info on localhost:8222/streaming
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    // every time we try to disconnect from the client
    console.log('Nats connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// 2 handlers to watch every single time someone tries to close this process
process.on('SIGINT', () => stan.close()); // watches for interrupt signals, will close client first, then terminate/restart client
process.on('SIGTERM', () => stan.close()); // watches for terminate signals, will close client first, then terminate client first, then move to stan.close()
