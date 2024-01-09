import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError, groupNumberWithSeparator } from "../utils";

function Product(props) {
  const { product, setPopUp } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    language,
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item.id}`);
    if (data.product.count_in_stock < quantity) {
      toast.error("Sorry the product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    setPopUp(true);
  };

  return (
    <Card>
      {product.images && product.images[0] && (
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0].original_url}
            className="card-img-top"
            alt={product.name}
            // height={"300rem"}
            style={{ height: "25rem", width: "100%" }}
          />
        </Link>
      )}

      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        {/* <Rating
          rating={product.rating}
          num_of_reviews={product.num_of_reviews}
        /> */}
        <Card.Text>
          {groupNumberWithSeparator(product.price, ",")} rsd
        </Card.Text>
        {product.count_in_stock <= 0 ? (
          <Button variant="danger" disabled>
            {language === "EN" ? "Unavailable" : "Nedostupno"}
          </Button>
        ) : (
          // <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
          <Button variant="success" disabled>
            {language === "EN" ? "In stock" : "Na lageru"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
