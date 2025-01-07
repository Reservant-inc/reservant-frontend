export enum LocalType {
  Restaurant,
  Bar,
  Cafe
}

export enum FriendStatus {
  Stranger,
  OutgoingRequest,
  IncomingRequest,
  Friend
}

export enum FriendActionStatus {
  Sent,
  Undone,
  Accepted,
  Deleted
}

export enum MenuScreenType {
  Preview = 'Preview',
  Order = 'Order',
  Management = 'Management'
}

export enum EventListType {
  Created,
  Interested,
  Participates,
  History
}
export enum ReportsListType {
  Created,
  CustomerService
}

export enum ReservationListType {
  Incoming,
  Finished
}

export enum FriendListType {
  List,
  Outgoing,
  Incoming
}

export enum TransactionListType {
  CustomerService,
  Client
}

export enum UnitOfMeasurement {
  Gram,
  Liter,
  Unit
}

export enum StatisticsScope {
  All,
  Single
}
