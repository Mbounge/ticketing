import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan; // ? tells typescript the var might be undefined for a period of time

  // if we try to access client before connect is called, you will get an error
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  // args, clusterId, clientid, url we want to connect to
  connect(clusterId: string, clientid: string, url: string) {
    this._client = nats.connect(clusterId, clientid, { url });

    // We want to make sure client is defined first before moving on
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
