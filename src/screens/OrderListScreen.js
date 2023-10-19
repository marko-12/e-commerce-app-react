import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload.orders.data,
        page: action.payload.orders.from,
        pages: action.payload.orders.last_page,
        orderItems: action.payload.order_items,
        users: action.payload.users,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function OrderListScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    {
      loading,
      error,
      orders,
      orderItems,
      users,
      pages,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: [],
    orderItems: [],
    users: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders?page=${page}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        const { data } = await axios.delete(`/api/orders/${order.id}`);
        toast.success(data.message);
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
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
                  <td>
                    {users.find((user) => user.id === order.user_id)
                      ? users.find((user) => user.id === order.user_id).name
                      : "DELETED USER"}
                  </td>
                  <td>{order.created_at.substring(0, 10)}</td>
                  <td>
                    $
                    {orderItems.map((item) =>
                      item[0].pivot.order_id === order.id
                        ? item.reduce(
                            (a, c) => a + c.pivot.quantity * c.price,
                            0
                          ) > 500
                          ? item.reduce(
                              (a, c) => a + c.pivot.quantity * c.price,
                              0
                            )
                          : item.reduce(
                              (a, c) => a + c.pivot.quantity * c.price,
                              0
                            ) + 50
                        : null
                    )}
                  </td>
                  <td>
                    {order.paid && order.paid_at
                      ? order.paid_at.substring(0, 10)
                      : "No"}
                  </td>

                  <td>
                    {order.delivered && order.delivered_at
                      ? order.delivered_at.substring(0, 10)
                      : "No"}
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
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/admin/order/${order.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(order)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
                key={x + 1}
                to={`/admin/orders?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
