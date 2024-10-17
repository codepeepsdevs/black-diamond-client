import { SubscriberList } from "../subscriber-list/subscriber-list.types";

export type Subscriber = {
  id: string;
  name: string;
  email: string;
  subscriberList: SubscriberList[];
  subscribedAt: string;
  unSubscribedAt: string;
  isSubscribed: string;
};

export type CreateSubscriberData = {
  name: string;
  email: string;
};
