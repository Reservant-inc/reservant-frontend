import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as yup from 'yup'
import './Login.css';

const initialValues = {
  login: '',
  password: ''
}

// Set yup validation schema to validate defined fields and error messages
const validationSchema = yup.object({
  login: yup.string().required('login is required'),
  password: yup.string().required('password is required')
})

const Login = ({ updateStatus } : { updateStatus : Function }) => {
  
  const navigate = useNavigate();

  const handleSubmit = async (values : FormikValues , { setSubmitting } : { setSubmitting: (isSubmitting: boolean) => void }) => {
      try {
        // Set submitting state to true to indicate form submission is in progress
        setSubmitting(true);
        console.log(values)
        // Send data to server
        const response = await fetch("http://172.21.40.127:12038/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
    
        if (!response.ok) {
          throw new Error("Invalid login data");
        }
        
        // TODO - Kuba: add data to web local storage for further use
        const data = await response.json();
    
        // Update auth status in App component
        updateStatus();

        // TODO - Szymon: Navigate to home page after successful login
        navigate("/");
    
      } catch (error) {
        console.log(error);
    
      } finally {
        // Set submitting state to false when form submission completes (whether it succeeded or failed)
        setSubmitting(false);
      }
    }

  return (
    <div className="container-login">

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
       {
       formik => 
          (
            <Form>
              <div className="form-container">

                <div className="form-control">
                  <label htmlFor="login">Login:</label>
                  <Field type="text" id="login" name="login" />
                  <ErrorMessage name="login" component="div" />
                </div>

                <div className="form-control">
                  <label htmlFor="password">Password:</label>
                  <Field type="password" id="password" name="password" />
                  <ErrorMessage name="password" component="div" />
                </div>

                <button type="submit" disabled={!formik.isValid}>
                  Login
                </button>
                
              </div>
            </Form>
          )
        }
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