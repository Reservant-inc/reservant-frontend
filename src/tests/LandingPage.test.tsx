import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage";

describe("LandingPage component", () => {
  test("renders properly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>,
    );
  });

  // ...
});
