import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Group from "../components/management/RestaurantManagement/Group";
import "@testing-library/jest-dom";

describe("Group component", () => {
  test("renders properly", () => {
    render(
      <Group
        id={1}
        name="Test Group"
        restaurantCount={3}
        handleChangeActiveRestaurant={() => {}}
        activeRestaurantId={null}
      />,
    );
  });

  test("expands and collapses correctly when clicked", async () => {
    render(
      <Group
        id={1}
        name="Test Group 2"
        restaurantCount={1}
        handleChangeActiveRestaurant={() => {}}
        activeRestaurantId={null}
      />,
    );

    fireEvent.click(screen.getByText("Test Group 2"));

    await waitFor(() => {
      expect(screen.getByText("Test Group")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Test Group"));

    await waitFor(() => {
      expect(screen.getByText("Test Group")).toBeInTheDocument();
    });
  });

  // ...
});
