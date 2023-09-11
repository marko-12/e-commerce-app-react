import React from "react";
import { useNavigate } from "react-router-dom";
// styling

function PopUp(props) {
  // function that takes boolean as param to conditionally display popup
  const { setPopUp } = props;
  const navigate = useNavigate();

  const yesButtonHandler = () => {
    //setPopUp(false);
    navigate("/cart");
  };

  return (
    <div className="PopUp">
      {/* x close window */}
      <button className="popup-x" onClick={() => setPopUp(false)}>
        X
      </button>
      <div className="pu-content-container">
        <h1>Do yoo want to go to cart?</h1>
      </div>
      {/* button controls */}
      <div className="pu-button-container">
        <button onClick={() => yesButtonHandler()}> Yes </button>
        <button onClick={() => setPopUp(false)}> No, continue shopping </button>
      </div>
    </div>
  );
}

export default PopUp;
