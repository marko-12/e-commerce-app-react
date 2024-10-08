import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { Container } from "react-bootstrap";
import PopUp from "../components/PopUp.js";
import { Link, useLocation, useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.data,
        page: action.payload.meta.from,
        pages: action.payload.meta.last_page,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  const [popUp, setPopUp] = useState(false);
  const duringPopUp = popUp ? " during-popup" : "";

  useEffect(() => {
    (async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/products?page=${page}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
      // setProducts(result.data);
    })();
    //fetchData();
  }, [page]);

  return (
    <div>
      <Helmet>
        <title>Home Screen</title>
      </Helmet>
      <h1 style={{ textAlign: "center" }}>Current Products</h1>
      <br />
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Container>
              {popUp && <PopUp setPopUp={setPopUp} className="center" />}
              <Row className={duringPopUp}>
                {products.map((product) => (
                  <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
                    <Product product={product} setPopUp={setPopUp}></Product>
                  </Col>
                ))}
              </Row>
            </Container>
            <div>
              {[...Array(pages).keys()].map((x) => (
                <Link
                  className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
                  key={x + 1}
                  to={`/?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
