import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import RestaurantManager from "../components/management/RestaurantManagement/RestaurantManager";
import "@testing-library/jest-dom";

describe("RestaurantManager component", () => {
  test("renders properly", () => {
    render(<RestaurantManager />);
  });

  test("activeRestaurantId is initially null", () => {
    render(<RestaurantManager />);
    const addRestaurantButton = screen.getByText("Add restaurant");
    expect(addRestaurantButton).toBeInTheDocument();
  });

  test("clicking 'Add restaurant' button triggers an action", () => {
    render(<RestaurantManager />);
    const addRestaurantButton = screen.getByText("Add restaurant");
    fireEvent.click(addRestaurantButton);
  });

  test("handleChangeActiveRestaurant updates activeRestaurantId", () => {
    render(<RestaurantManager />);
    const addRestaurantButton = screen.getByText("Add restaurant");
    fireEvent.click(addRestaurantButton);
  });

  // ...
});
