import React from "react";
import { useContext } from "react";
import { Store } from "../Store";

function ContactScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { language } = state;

  return language === "SR" ? (
    <div className="contact-screen">
      <div className="company-info">
        <h2>Kontakt</h2>
        <p>
          <strong>Adresa:</strong> Tolstojeva 46, Niš, Srbija
        </p>
        <p>
          <strong>Telefon:</strong> (555) 123-4567
        </p>
        <p>
          <strong>Email:</strong> office.mechatronic@gmail.com
        </p>
      </div>
      <div className="business-hours">
        <h2>Radno Vreme</h2>
        <p>
          <strong>Ponedeljak - Petak:</strong> 9:00 - 16:00
        </p>
      </div>
    </div>
  ) : (
    <div className="contact-screen">
      <div className="company-info">
        <h2>Contact</h2>
        <p>
          <strong>Address:</strong> Tolstojeva 46, Niš, Srbija
        </p>
        <p>
          <strong>Phone:</strong> (555) 123-4567
        </p>
        <p>
          <strong>Email:</strong> office.mechatronic@gmail.com
        </p>
      </div>
      <div className="business-hours">
        <h2>Business Hours</h2>
        <p>
          <strong>Monday - Friday:</strong> 9:00 AM - 16:00
        </p>
      </div>
    </div>
  );
}

export default ContactScreen;
