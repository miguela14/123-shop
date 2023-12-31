import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";

import {
  CREATE_PRODUCT,
  GET_ALL_PRODUCTS_BY_BUSINESS,
} from "../../api/orderApi";
import { authUserContext } from "../../context/authUserContext";
import "./Products.css";
import InventoryItem from "../../components/shared/InventoryItem";
import { DELETE_PRODUCT, UPDATE_PRODUCT } from "../../api/productApi";
import PlusBox from "../../components/shared/PlusBox";
import ProductForm from "../../components/ProductForm";
import { DrawersContext } from "../../context/drawersContext";
function Products() {
  const [productModalOpen, setProductModalOpen] = useState(false);
  const { toggleDrawer, toggleBackdrop } = useContext(DrawersContext);
  const { business } = useContext(authUserContext);
  const [productFormData, setProductFormData] = useState({
    product_name: "",
    price: "",
    product_description: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    productFormData.business_id = business && business.getBusinessByUser[0]._id;
    productFormData.price = parseFloat(productFormData.price);
    createProduct({ variables: { productInput: productFormData } });
    refetch();
    openProductModal(false);
  };
  const [
    createProduct,
    {
      data: createProductData,
      loading: createProductLoading,
      error: createProductError,
    },
  ] = useMutation(CREATE_PRODUCT);
  const [
    deleteProduct,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_PRODUCT);
  const [
    updateProduct,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_PRODUCT);
  const { data, loading, error, refetch } = useQuery(
    GET_ALL_PRODUCTS_BY_BUSINESS,
    {
      variables: { businessId: business && business.getBusinessByUser[0]._id },
    }
  );

  const updateProductFn = (input) => {
    input.price = parseFloat(input.price);
    updateProduct({
      variables: { input },
    });
    refetch();
  };
  const deleteProductFn = (id) => {
    deleteProduct({
      variables: { productId: id },
    });
    refetch();
  };
  console.log(productModalOpen);
  console.log(business && business.getBusinessByUser[0]._id);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: ${error.message}</p>;
  const openProductModal = (con) => {
    if (con) {
      setProductModalOpen(true);
      toggleBackdrop(true);
    } else {
      setProductModalOpen(false);
      toggleBackdrop(false);
    }
  };
  return (
    <>
      <div className={`products-modal ${productModalOpen && "active"}`}>
        <ProductForm
          formData={productFormData}
          setFormData={setProductFormData}
          onSubmit={handleSubmit}
        />
        <div
          onClick={() => openProductModal(false)}
          className={`exit-modal ${productModalOpen && "active"}`}
        >
          X
        </div>
      </div>
      <div className="Products">
        <div className="Products-container">
          <div className="Products-header">
            <h3 className="Products-header-title">Inventory</h3>
          </div>
          <div className="Products-scrollable">
            {data &&
              data?.getAllProdcutsByBusiness.map((product) => {
                return (
                  <>
                    <InventoryItem
                      key={product._id}
                      id={product._id}
                      title={product.product_name}
                      description={product.product_description}
                      price={product.price}
                      updateProduct={updateProductFn}
                      deleteProduct={deleteProductFn}
                    />
                  </>
                );
              })}
            <div className="Products-create">
              <PlusBox onClickEv={() => openProductModal(true)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
