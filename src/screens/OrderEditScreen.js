import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

function OrderEditScreen() {
  const params = useParams();
  const { id: orderId } = params;

  const [delivered, setDelivered] = useState(0);
  const [paid, setPaid] = useState(0);

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Order {orderId}</title>
      </Helmet>
      <h1>Edit User {orderId}</h1>
      <Form>
        <Form.Check
          className="mb-3"
          type="checkbox"
          id="delivered"
          label="delivered"
          checked={delivered}
          onChange={(e) => setDelivered(e.target.checked)}
        />
        <Form.Check
          className="mb-3"
          type="checkbox"
          id="paid"
          label="paid"
          checked={paid}
          onChange={(e) => setPaid(e.target.checked)}
        />
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </Container>
  );
}

export default OrderEditScreen;
