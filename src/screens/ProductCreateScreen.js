import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";

export default function ProductCreateScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category_id, setCategoryId] = useState(1);
  const [categories, setCategories] = useState([]);
  const [count_in_stock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    })();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("count_in_stock", count_in_stock);
    formData.append("category_id", category_id);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("image[]", selectedFiles[i]);
    }

    try {
      const { data } = await axios.post("/api/products", formData);
      // const { data } = await axios.request({
      //   url: "/api/products",
      //   method: "post",
      //   data: formData,
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "multipart/form-data", // Set the correct Content-Type for FormData
      //   },
      // });
      toast.success(data.message);
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const onFileChangeHandler = (e) => {
    e.preventDefault();
    setSelectedFiles(e.target.files);
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create New Product</title>
      </Helmet>
      <h1>Create New Product {productId}</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Price</Form.Label>
          <Form.Control
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            type="number"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label>Upload Images</Form.Label>
          <Form.Control type="file" multiple onChange={onFileChangeHandler} />
        </Form.Group>

        {categories && categories[0] && (
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((category, index) => {
                return (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        )}
        <Form.Group className="mb-3" controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="countInStock">
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control
            value={count_in_stock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
            type="number"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </Container>
  );
}
