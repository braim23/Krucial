import orderDetailModel from "./orderDetail";

export default interface orderHeaderModel {
  orderHeaderId?: number;
  pickupName?: string;
  pickupPhoneNumber?: string;
  pickupEmail?: string;
  applicationUserId?: string;
  user?: any;
  orderTotal?: number;
  orderDate?: string;
  stripePaymentIntentID?: string;
  status?: string;
  totalItems?: number;
  orderDetails?: orderDetailModel[];
}
