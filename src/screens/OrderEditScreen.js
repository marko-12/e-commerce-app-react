import React, { useState, useReducer, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";

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
  const navigate = useNavigate();

  const [delivered, setDelivered] = useState(0);
  const [paid, setPaid] = useState(0);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        setDelivered(data.order.delivered);
        setPaid(data.order.paid);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    })();
  }, [orderId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(`/api/orders/${orderId}`, {
        delivered,
        paid,
      });
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success(data.message);
      console.log(data.delivered_at);
      console.log(data.paid_at);
      navigate("/admin/orders");
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
      });
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Order {orderId}</title>
      </Helmet>
      <h1>Edit Order {orderId}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Check
          className="mb-3"
          type="checkbox"
          id="delivered"
          label="Delivered"
          checked={delivered}
          onChange={(e) => setDelivered(e.target.checked)}
        />
        <Form.Check
          className="mb-3"
          type="checkbox"
          id="paid"
          label="Paid"
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
