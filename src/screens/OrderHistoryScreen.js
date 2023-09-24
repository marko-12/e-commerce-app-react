import React, { useContext, useEffect, useState, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Button from "react-bootstrap/esm/Button";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload.orders,
        orderItems: action.payload.order_items,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  //const [orderItems, setOrderItems] = useState([]);

  const [{ loading, error, orders, orderItems }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
      orders: [],
      orderItems: [],
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/my/${userInfo.id}`);
        if (data) {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        }
        // setOrderItems([]);
        // await data.order_items.map((item) => {
        //   setOrderItems((prevState) => [...prevState, item]);
        //   console.log("iteration " + item);
        //   return item;
        // });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.created_at.substring(0, 10)}</td>
                <td>
                  $
                  {orderItems.map((item) =>
                    item[0].pivot.order_id === order.id
                      ? item.reduce(
                          (a, c) => a + c.price * c.pivot.quantity,
                          0
                        ) > 100
                        ? item.reduce(
                            (a, c) => a + c.price * c.pivot.quantity,
                            0
                          )
                        : item.reduce(
                            (a, c) => a + c.price * c.pivot.quantity,
                            0
                          ) + 10
                      : null
                  )}
                </td>
                <td>{order.paid ? order.paid_at.substring(0, 10) : "No"}</td>
                <td>
                  {order.delivered ? order.delivered_at.substring(0, 10) : "No"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order.id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
