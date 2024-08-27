export enum SD_Roles {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export enum SD_Status {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  BEING_COOKED = "Being Prepared",
  READY_FOR_PICKUP = "Ready for Pickup",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum SD_Categories {
  KEYBOARD = "Keyboard",
  MOUSE = "Mouse",
  MOUSEPAD = "Mousepad",
  OTHER = "Other",
}

export enum SD_SortTypes {
  PRICE_LOW_TO_HIGH = "Price Low - High",
  PRICE_HIGH_TO_LOW = "Price High - Low",
  NAME_A_Z = "Name A - Z",
  NAME_Z_A = "Name Z - A",
}
