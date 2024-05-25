import React from "react";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "./hooks/useValidationSchema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ErrorMes from "./components/reusableComponents/ErrorMessage";

const initialValues = {
    category: "",
    visit: "",
    description: "",
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
                <Field as="select" id="category" name="category" className={!(formik.errors.category && formik.touched.category)?"border-none":"border-solid border-2 border-pink"}>
                  
                  <option value="lostItem" label="lost item"/>

                  <option value="technical" label="technical"/>
                   
                  <option value="customerReport" label="report customer"/>
                   
                  <option value="employeeReport" label="report employee"/>
                   
                </Field>
                <ErrorMessage name="category">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              {formik.values.category!=="technical" &&

                
                <div className="form-control">
                <label htmlFor="category">Visit:</label>
                <Field as="select" id="visit" name="visit" className={!(formik.errors.visit && formik.touched.visit)?"border-none":"border-solid border-2 border-pink"}>
                  <option value="visit1" label="visit1"/>
                  <option value="visit2" label="visit2"/>
                </Field>
                <ErrorMessage name="category">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
                </div>
              }

              <div className="form-control">
                <label htmlFor="content">Description:</label>
                <Field as="textarea" cols='30' rows='10' id="description" name="description" className={!(formik.errors.description && formik.touched.description)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="description">
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