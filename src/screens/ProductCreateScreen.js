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
  const { userInfo, token } = state;
  const user_id = userInfo.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [count_in_stock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();

    onFileUploadHandler();

    try {
      const { data } = await axios.post("/api/products", {
        name,
        price,
        images,
        category,
        brand,
        count_in_stock,
        description,
        user_id,
      });
      toast.success(data.message);
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    console.log(selectedFile);
  });

  const onFileChangeHandler = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
  };
  const onFileUploadHandler = async () => {
    const formData = new FormData();
    const blob = new Blob([selectedFile]);
    formData.append("file", selectedFile, selectedFile.name);
    //formData.append("_method", "PATCH");
    try {
      const { data } = await axios.post(
        "/api/image",
        { image: formData },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message);
      console.log("File Data: " + data);
    } catch (err) {
      toast.error(getError(err));
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed successfully. click Update to apply it");
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Create Product</title>
      </Helmet>
      <h1>Create Product {productId}</h1>

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
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" onChange={onFileChangeHandler} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group>
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
            required
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </Container>
  );
}
