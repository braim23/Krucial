import { SD_Status } from "../Utilitiy/SD";
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
  status?: SD_Status;
  totalItems?: number;
  orderDetails?: orderDetailModel[];
}
