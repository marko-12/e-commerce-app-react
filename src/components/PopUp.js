import React from "react";
import { useNavigate } from "react-router-dom";
// styling

function Popup(props) {
  // function that takes boolean as param to conditionally display popup
  const { setPopUp } = props;
  const navigate = useNavigate();

  const yesButtonHandler = () => {
    //setPopUp(false);
    navigate("/cart");
  };

  return (
    <div className="PopUp">
      <div className="pu-content-container">
        <h1>Go to cart?</h1>
      </div>
      {/* button controls */}
      <div className="pu-button-container">
        <button style={buttonStyle} onClick={() => yesButtonHandler()}>
          Yes
        </button>
        <button style={buttonStyle} onClick={() => setPopUp(false)}>
          No, continue shopping
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: "10px",
  borderRadius: "7px",
  backgroundColor: "#fcc000",
};

export default Popup;
