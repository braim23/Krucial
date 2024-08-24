import productModel from "./productModel";

export default interface orderDetailModel {
  orderDetailId?: number;
  orderHeaderId?: number;
  productId?: number;
  product?: productModel;
  quantity?: number;
  itemName?: string;
  price?: number;
}
