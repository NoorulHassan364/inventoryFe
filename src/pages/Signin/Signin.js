import React, { useState, useContext } from "react";
import "./Signin.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import api from "../../api/index";
import { AuthContext } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const { isLogin, loginSuccess } = useContext(AuthContext);

  const schema = yup.object().shape({
    email: yup.string().required("Enter a valid email address."),
    password: yup.string().required("Enter a valid password."),
  });

  const handleSubmit = async (values, resetForm) => {
    try {
      let res = await api.post("/users/login", values);
    
      loginSuccess(res.data.token, res.data.user);

      navigate("/");
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="signin_main">
        <div className="signin_img">
          <h4 className="signin_img_heading">Signin To Inventory System</h4>
        </div>
        <div className="signin_form">
          <Formik
            validationSchema={schema}
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, resetForm)
            }
            enableReinitialize
            initialValues={{
              email: "",
              password: "",
            }}
          >
            {(formik) => (
              <Form
                className="signin_actualform"
                onSubmit={formik.handleSubmit}
              >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isValid={formik.touched.email && !formik.errors.email}
                    isInvalid={formik.touched.email && formik.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isValid={formik.touched.password && !formik.errors.password}
                    isInvalid={
                      formik.touched.password && formik.errors.password
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Signin;
