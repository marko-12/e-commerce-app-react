import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Rating from "../components/Rating";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import Product from "../components/Product";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import ReactSlider from "react-slider";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products.data,
        page: action.payload.products.meta.from,
        pages: action.payload.products.meta.last_page,
        perPage: action.payload.products.meta.per_page,
        totalProducts: action.payload.products.meta.total,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const name = sp.get("query") || "all";
  const priceFrom = sp.get("priceFrom") || "all";
  const priceTo = sp.get("priceTo") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const [
    { loading, error, products, pages, perPage, totalProducts },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    products: [],
    perPage: 0,
    pages: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = {
          page: page,
          name: name,
          category: category,
          priceFrom: priceFrom,
          priceTo: priceTo,
          rating: rating,
          //order: order,
        };
        var queryString = "";

        for (const [key, value] of Object.entries(queryParams)) {
          if (value && value !== "all") {
            if (key === "page") {
              queryString = queryString.concat(`${key}=${value}`);
            } else {
              queryString = queryString.concat(`&${key}=${value}`);
            }
          }
        }

        // const { data } = await axios.get(
        //   `/api/search?page=${page}&name=${name}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        // );
        const { data } = await axios.get(`/api/search?${queryString}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
        navigate("/");
      }
    };
    fetchData();
  }, [category, error, order, page, priceFrom, priceTo, name, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/categories`);
        setCategories([]);
        data.forEach((category) => {
          setCategories((prevState) => [...prevState, category.name]);
        });
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const [sliderValue, setSliderValue] = useState([]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.name || name;
    const filterRating = filter.rating || rating;
    const filterPriceFrom = filter.priceFrom || priceFrom;
    const filterPriceTo = filter.priceTo || priceTo;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? "" : "/search?"
    }category=${filterCategory}&query=${filterQuery}&priceFrom=${filterPriceFrom}&priceTo=${filterPriceTo}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Category</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={"all" === category ? "text-bold" : ""}
                  to={getFilterUrl({ category: "all" })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? "text-bold" : ""}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ReactSlider
              className="horizontal-slider"
              thumbClassName="thumb"
              trackClassName="track"
              defaultValue={[1, 1000]}
              max={1000}
              min={1}
              renderThumb={(props, state) => (
                <div {...props}>{state.valueNow}</div>
              )}
              onChange={(value) => setSliderValue(value)}
              onAfterChange={(value) =>
                navigate(
                  value
                    ? getFilterUrl({
                        priceFrom: value[0],
                        priceTo: value[1],
                      })
                    : "/search"
                )
              }
            />
            <br />
            <br />
            <div
              style={{
                backgroundColor: "#f0c040",
                borderRadius: "7px",
              }}
            >
              Show prices from {sliderValue[0]}$ to {sliderValue[1]}$
            </div>
            <br />
          </div>
          <div>
            <h3>Average Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? "text-bold" : ""}
                  >
                    <Rating caption={" & up"} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: "all" })}
                  className={rating === "all" ? "text-bold" : ""}
                >
                  <Rating caption={" & up"} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {totalProducts === 0 ? "No" : totalProducts} Results
                    {name !== "all" && " : " + name}
                    {category !== "all" && " : " + category}
                    {priceFrom !== "all" &&
                      priceFrom !== "all" &&
                      " : Price From " + priceFrom + "$ to " + priceTo + "$"}
                    {rating !== "all" && " : Rating " + rating + " & up"}
                    {name !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    priceFrom !== "all" ? (
                      <Button
                        variant="light"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                  <br />
                  <div>
                    {perPage && perPage > 0
                      ? `Showing ${perPage} products per page`
                      : null}
                  </div>
                </Col>
                {/* <Col className="text-end">
                  Sort by{" "}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col> */}
              </Row>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product.id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    style={{ margin: "5px", borderRadius: "10px" }}
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: "/search",
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? "text-bold" : ""}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
