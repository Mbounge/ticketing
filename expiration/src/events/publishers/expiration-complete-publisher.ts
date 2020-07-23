import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@botickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
