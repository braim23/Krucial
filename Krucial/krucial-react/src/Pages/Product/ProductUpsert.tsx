import React, { useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../../Helper";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../Apis/productApi";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { SD_Categories } from "../../Utilitiy/SD";

const Categories = [
  SD_Categories.KEYBOARD,
  SD_Categories.MOUSE,
  SD_Categories.MOUSEPAD,
  SD_Categories.OTHER,
];

const productData = {
  name: "",
  description: "",
  specialTag: "",
  category: Categories[0],
  price: "",
};

function ProductUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [productInputs, setProductInputs] = useState(productData);
  const [loading, setLoading] = useState(false);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data } = useGetProductByIdQuery(id);
  useEffect(() => {
    if (data && data.result) {
      const tempdata = {
        name: data.result.name,
        description: data.result.description,
        specialTag: data.result.specialTag,
        category: data.result.category,
        price: data.result.price,
      };
      setProductInputs(tempdata);
      setImageToDisplay(data.result.image);
    }
  }, [data]);
  const handleProductInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, productInputs);
    setProductInputs(tempData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File must be less than 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File type must be jpg, png or jpeg", "error");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!imageToStore && !id) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("Name", productInputs.name);
    formData.append("Description", productInputs.description);
    formData.append("SpecialTag", productInputs.specialTag ?? ""); //Added empty string if null so it dont send null to the database
    formData.append("Category", productInputs.category);
    formData.append("Price", productInputs.price);
    if (imageToDisplay) {
      formData.append("File", imageToStore);
    }

    let response;
    if (id) {
      formData.append("Id", id);
      toastNotify("Product updated successfully!", "success");
      response = await updateProduct({ data: formData, id });
    } else {
      response = await createProduct(formData);
      toastNotify("Product created successfully!", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/product/productList");
    }

    setLoading(false);
  };
  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "Update Product" : "Add Product"}
      </h3>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7 ">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="name"
              value={productInputs.name}
              onChange={handleProductInput}
            />
            <textarea
              className="form-control mt-3"
              placeholder="Enter Description"
              name="description"
              rows={10}
              value={productInputs.description}
              onChange={handleProductInput}
            ></textarea>
            <input
              type="text"
              className="form-control mt-3"
              placeholder="Enter Special Tag"
              name="specialTag"
              value={productInputs.specialTag}
              onChange={handleProductInput}
            />
            <select
              className="form-control mt-3 form-select"
              name="category"
              value={Categories.includes(productInputs.category) ? productInputs.category : ""}
              onChange={handleProductInput}
            >
              <option value="" disabled>
                Enter Category
              </option>
              {Categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="form-control mt-3"
              required
              placeholder="Enter Price"
              name="price"
              value={productInputs.price}
              onChange={handleProductInput}
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control mt-3"
            />
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-success mt-3 form-control"
                >
                  {id ? "Update" : "Add Product"}
                </button>
              </div>
              <div className="col-6">
                <a
                  onClick={() => navigate("/product/productList")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={imageToDisplay}
              style={{ width: "100%", borderRadius: "30px" }}
              alt=""
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductUpsert;
