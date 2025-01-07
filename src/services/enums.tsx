export enum LocalType {
  Restaurant = 'Restaurant',
  Bar = 'Bar',
  Cafe = 'Cafe'
}

export enum FriendStatus {
  Stranger = 'Stranger',
  OutgoingRequest = 'OutgoingRequest',
  IncomingRequest = 'IncomingRequest',
  Friend = 'Friend'
}

export enum FriendActionStatus {
  Sent = 'Sent',
  Undone = 'Undone',
  Accepted = 'Accepted',
  Deleted = 'Deleted'
}

export enum MenuScreenType {
  Preview = 'Preview',
  Order = 'Order',
  Management = 'Management'
}

export enum EventListType {
  Created = 'Created',
  Interested = 'Interested',
  Participates = 'Participates',
  History = 'History'
}

export enum ReportsListType {
  Created = 'Created',
  CustomerService = 'CustomerService'
}

export enum ReservationListType {
  Incoming = 'Incoming',
  Finished = 'Finished'
}

export enum FriendListType {
  List = 'List',
  Outgoing = 'Outgoing',
  Incoming = 'Incoming'
}

export enum TransactionListType {
  CustomerService = 'CustomerService',
  Client = 'Client'
}

export enum UnitOfMeasurement {
  Gram = 'Gram',
  Liter = 'Liter',
  Unit = 'Unit'
}

export enum StatisticsScope {
  All = 'All',
  Single = 'Single'
}
