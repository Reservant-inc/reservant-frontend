import React from "react";
import { render } from "@testing-library/react";
import UserRegister from "../components/register/UserRegister";
import { MemoryRouter } from "react-router-dom";

describe("UserRegister component", () => {
  test("renders properly", () => {
    render(
      <MemoryRouter>
        <UserRegister />
      </MemoryRouter>,
    );
  });

  // test("submitting the form triggers handleSubmit", async () => {
  //   render(
  //     <MemoryRouter>
  //       <UserRegister />
  //     </MemoryRouter>,
  //   );

  //   fireEvent.change(screen.getByText("auth.firstName"), {
  //     target: { value: "J" },
  //   });
  //   fireEvent.change(screen.getByLabelText("auth.lastName"), {
  //     target: { value: "D" },
  //   });
  //   fireEvent.change(screen.getByLabelText("Login:"), {
  //     target: { value: "jaydee" },
  //   });
  //   fireEvent.change(screen.getByLabelText("E-mail:"), {
  //     target: { value: "jaydee@mail.com" },
  //   });
  //   fireEvent.change(screen.getByLabelText("auth.phoneNumber"), {
  //     target: { value: "+123456789" },
  //   });
  //   fireEvent.change(screen.getByLabelText("auth.birthDate"), {
  //     target: { value: "2000-01-01" },
  //   });
  //   fireEvent.change(screen.getByLabelText("auth.password"), {
  //     target: { value: "password123" },
  //   });
  //   fireEvent.change(screen.getByLabelText("auth.confirmPassword"), {
  //     target: { value: "password123" },
  //   });

  //   fireEvent.click(screen.getByText("Register"));

  //   // await waitFor(() => {
  //   // ...
  //   // });
  // });

  // ...
});
