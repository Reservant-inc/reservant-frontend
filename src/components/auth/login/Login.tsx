import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as yup from "yup";
import "./Login.css";
import { userInfo } from "os";

const initialValues = {
  username: "",
  password: "",
};

interface LoginProps {
  updateStatus: () => void;
}

// Set yup validation schema to validate defined fields and error messages
const validationSchema = yup.object({
  username: yup.string().required("login is required"),
  password: yup.string().required("password is required"),
});

const Login = ({ updateStatus }: LoginProps) => {
  const navigate = useNavigate();

  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {

    console.log(values)

    try {
      // Set submitting state to true to indicate form submission is in progress
      setSubmitting(true);
      // Send data to server
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.username,
            password: values.password,
            // TODO - plug in values after creating rememberMe Field
            rememberMe: false
          }),
        },
      );

      if (!response.ok) {
        console.log(await response.json())
        throw new Error("Invalid login data");
      }

      // TODO - Kuba: add data to web local storage for further use
      const data = await response.json()
      localStorage.setItem('userInfo', JSON.stringify(data))
      console.log(localStorage.getItem("userInfo"))

      // Update auth status in App component
      updateStatus();

      // TODO - Kuba: Navigate to home page after successful login
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      // Set submitting state to false when form submission completes (whether it succeeded or failed)
      setSubmitting(false);
    }
  };

  return (
    <div className="container-login">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label htmlFor="username">Username:</label>
                <Field type="text" id="username" name="username" />
                <ErrorMessage name="username" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="password">Password:</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>

              {
                // TODO - rememberMe Field
              }

              <button type="submit" disabled={!formik.isValid}>
                Login
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="container-links">
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <Link to="/">Reset password</Link>
      </div>
    </div>
  );
};

export default Login;
