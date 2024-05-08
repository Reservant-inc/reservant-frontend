/* eslint-disable jest/valid-expect */
/* eslint-disable testing-library/prefer-presence-queries */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MyGroups from "../components/management/RestaurantManagement/MyGroups";

describe("MyGroups Component", () => {
  test("Renders correctly with empty groups", () => {
    render(
      <MyGroups
        handleChangeActiveRestaurant={() => {}}
        activeRestaurantId={null}
      />,
    );
  });

  test("Renders groups correctly", async () => {
    const groups = [
      { id: 1, name: "Group 1", restaurantCount: 3 },
      { id: 2, name: "Group 2", restaurantCount: 2 },
    ];

    render(
      <MyGroups
        handleChangeActiveRestaurant={() => {}}
        activeRestaurantId={1}
      />,
    );

    // global.fetch = jest.fn().mockResolvedValueOnce(groups);

    expect(screen.getByText("MY GROUPS")).toBeInTheDocument();
  });

  //   test('Calls handleChangeActiveRestaurant when a group is clicked', async () => {
  //     const handleChangeActiveRestaurant = jest.fn();

  //     const groups = [{ id: 1, name: 'Group 1' }];

  //     render(
  //       <MyGroups
  //         handleChangeActiveRestaurant={handleChangeActiveRestaurant}
  //         activeRestaurantId={null}
  //       />
  //     );

  //     // Mock API call
  //     global.fetch = jest.fn().mockResolvedValueOnce(groups);

  //     const group = groups[0];

  //     await screen.findByText(group.name);

  //     userEvent.click(screen.getByText(group.name));

  //     expect(handleChangeActiveRestaurant).toHaveBeenCalledWith(group.id);
  //   });
});
