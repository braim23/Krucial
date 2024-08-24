import shoppingCartModel from "../../../Interfaces/shoppingCartModel";
import { SD_Status } from "../../../Utilitiy/SD";

export interface orderSummaryProps {
  data: {
    id?: number;
    cartItems?: shoppingCartModel[];
    cartTotal?: number;
    userId?: string;
    stripePaymentIntentId?: string;
    status?: SD_Status;
  };
  userInput: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}
