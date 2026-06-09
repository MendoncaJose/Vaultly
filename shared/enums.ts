export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum AssetType {
  STOCK = 'STOCK',
  ETF = 'ETF',
  CRYPTO = 'CRYPTO',
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum CurrencyCode {
  EUR = 'EUR',
  USD = 'USD',
}

export enum MarketDataProvider {
  FINNHUB = 'FINNHUB',
}

export enum FxProvider {
  FRANKFURTER = 'FRANKFURTER',
}

export enum AlertType {
  PRICE_ABOVE = 'PRICE_ABOVE',
  PRICE_BELOW = 'PRICE_BELOW',
  DAILY_CHANGE_PERCENT = 'DAILY_CHANGE_PERCENT',
}

export enum NotificationType {
  ALERT_TRIGGERED = 'ALERT_TRIGGERED',
  SYSTEM = 'SYSTEM',
}

export enum HoldingStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
