export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      // fake function, this will allow us to do some logs when this function is envoked
      (subject: string, data: string, callback: () => void) => {
        callback();
      }
    ),
  },
};
