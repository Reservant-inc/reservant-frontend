import React from "react";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "./hooks/useValidationSchema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ErrorMes from "./components/reusableComponents/ErrorMessage";

const initialValues = {
    category: "",
    visit: "",
    topic: "",
    content: "",
};

const ComplaintForm = () => {
    const [t] = useTranslation("global");

    const { userRegisterSchema } = useValidationSchemas();
    
    const handleSubmit = () => {
        
    }

    return(
    <div className="container-register">
      <Formik
        initialValues={initialValues}
        validationSchema={userRegisterSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label htmlFor="category">Category:</label>
                <Field type="text" id="category" name="category" className={!(formik.errors.category && formik.touched.category)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="category">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="category">Visit:</label>
                <select id="visit" name="visit" className={!(formik.errors.visit && formik.touched.visit)?"border-none":"border-solid border-2 border-pink"}>
                  <option value="" label="none">
                    none{" "}
                  </option>
                  <option value="visit1" label="visit1">
                    {" "}
                    visit1
                  </option>
                  <option value="visit2" label="visit2">
                    visit2
                  </option>
                </select>
                <ErrorMessage name="category">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="topic">Topic:</label>
                <Field type="text" id="topic" name="topic" className={!(formik.errors.topic && formik.touched.topic)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="topic">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="content">Content:</label>
                <Field type="text" id="content" name="content" className={!(formik.errors.content && formik.touched.content)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="content">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <button id="ComplaintFormSubmitButton" type="submit" disabled={!formik.isValid}>
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    );
}
export default ComplaintForm