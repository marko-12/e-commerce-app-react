import React, { useState, useContext } from "react";
import { NavDropdown } from "react-bootstrap";
import { Store } from "../Store";
import FlagSerbia from "../images/Flag_of_Serbia.png";
import FlagUK from "../images/Flag_of_the_United_Kingdom.png";

function LanguageSelector() {
  //const [language, setLanguage] = useState("SR");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { language } = state;

  return (
    <NavDropdown
      title={
        language === "SR" ? (
          <img
            className="thumbnail-image"
            src={FlagSerbia}
            alt="language"
            width="50rem"
            height="30rem"
          />
        ) : (
          <img
            className="thumbnail-image"
            src={FlagUK}
            alt="language"
            width="50rem"
            height="30rem"
          />
        )
      }
    >
      <NavDropdown.Item
        onClick={() => ctxDispatch({ type: "SET_LANGUAGE", payload: "SR" })}
      >
        {language === "SR" ? "Srpski" : "Serbian"}
      </NavDropdown.Item>
      <NavDropdown.Item
        onClick={() => ctxDispatch({ type: "SET_LANGUAGE", payload: "EN" })}
      >
        {language === "SR" ? "Engleski" : "English"}
      </NavDropdown.Item>
    </NavDropdown>
  );
}

export default LanguageSelector;
