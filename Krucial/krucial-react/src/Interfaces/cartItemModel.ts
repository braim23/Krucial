import productModel from "./productModel";

export default interface cartItemModel {
  id?: number;
  productId?: number;
  product?: productModel;
  quantity?: number;
}
