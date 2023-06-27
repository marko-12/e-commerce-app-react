import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { blue, red } from "@mui/material/colors";

export default function SearchBox() {
  const navigate = useNavigate();
  //const [query, setQuery] = useState("");
  const searchHandler = (e) => {
    e.preventDefault();
    const query = e.target.value;
    navigate(query ? `/search/?query=${query}` : "/search");
  };
  const search = () => {
    searchHandler();
  };
  const [myOptions, setMyOptions] = useState([]);

  function getData() {
    // fetch data
    fetch("api/products")
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          if (!myOptions.some((obj) => obj.label == res[i].name)) {
            // create an object with a label
            let object = {
              label: res[i].name,
              usersName: res[i].name,
            };
            myOptions.push(object);
          }
        }
        setMyOptions(myOptions);
      });
  }
  useEffect(() => getData(), [myOptions]);
  //useEffect(() => search(), [query]);
  return (
    // <Form className="d-flex me-auto">
    //   <InputGroup>
    //     <FormControl
    //       type="text"
    //       name="q"
    //       id="q"
    //       onChange={searchHandler}
    //       placeholder="search products..."
    //       aria-label="Search Products"
    //       aria-describedby="button-search"
    //     ></FormControl>
    //     <Button variant="outline-primary" type="submit" id="button-search">
    //       <i className="fas fa-search"></i>
    //     </Button>
    //   </InputGroup>
    // </Form>
    <div>
      <Autocomplete
        style={{ width: 500, backgroundColor: "whitesmoke" }}
        autoComplete
        autoHighlight
        freeSolo
        clearOnEscape
        options={myOptions}
        renderInput={(data) => (
          <TextField
            {...data}
            variant="outlined"
            label="Search Products"
            onChange={searchHandler}
            //={searchHandler}
          />
        )}
      />
    </div>
  );
}
