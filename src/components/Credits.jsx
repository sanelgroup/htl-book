import React from "react";
import { Navigation } from "./Navigation";

export const Credits = () => {
  return (
    <div>
      <Navigation title="Credits" />
      <div className="credits">
        <a href="https://github.com/mario-hess">Cheeseburger by mario-hess</a>
        <a href="https://fireship.io/">Chat inspired by Fireship</a>
        <a href="/chat">Login inspired by ...</a>
      </div>
    </div>
  );
};
