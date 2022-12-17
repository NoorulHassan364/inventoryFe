import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import DataTable from "react-data-table-component";
import { Button, Tab, Tabs, Modal, Form, Col, Row } from "react-bootstrap";
import * as yup from "yup";
import api from "../../api/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./CreateUser.css";
import { color } from "@mui/system";
const CreateUser = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setupdateUsers(null);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [users, setUsers] = useState([
    // {
    //   Name:"umair QUrashi",
    //   img:"https://images.unsplash.com/photo-1581704906775-891dd5207444?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGJveXxlbnwwfHwwfHw%3D&w=1000&q=80",
    // }
  ]);
  const [updateUser, setupdateUsers] = useState(null);

  const schema = yup.object().shape({
    Name: yup.string().required("Enter Your Name."),
    PhoneNumber: yup.string().required("Enter a valid PhoneNumber."),
    email: yup.string().required("Enter a valid Email address."),
    Address: yup.string().required("Enter a valid Address."),
    City: yup.string().required("Enter a valid City Name."),
  });

  const handleSubmit = async (values, resetForm) => {
    try {
      if (updateUser == null) {
        let res = await api.post("/clients", values);
        setUsers([...users, res.data]);
      } else {
        let res = await api.patch(`/clients/${updateUser._id}`, values);
        setUsers(
          users.map((elem) => {
            if (elem._id == res.data._id) {
              return (elem = res.data);
            } else {
              return elem;
            }
          })
        );
      }

      resetForm();
      handleClose();
    } catch (error) {
      if (error.response.data === "User Already Exist") {
        window.alert("User Already Exist");
      }
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      let res = await api.get("/clients");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  const openUsersModal = async (user) => {
    try {
      setupdateUsers(user);
      setShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUsers = async (id) => {
    try {
      let res = await api.delete(`/clients/${id}`);
      setUsers(
        users.filter((elem) => {
          return elem._id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const clientDataColumns = [
    {
      name: "Sr.no.",
      cell: (row, index, column, id) => {
        return <h6>{index + 1}</h6>;
      },
    },
    {  
      name: "Client Name",
      selector: (row) => row.Name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Phone Number",
      selector: (row) => row.PhoneNumber,
      sortable: true,
      grow: 2,
    },
    {
      name: "Email ID",
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Address",
      selector: (row) => row.Address,
      sortable: true,
      grow: 2,
    },
    {
      name: "City",
      selector: (row) => row.City,
      sortable: true,
      grow: 2,
    },
    {
      name: "Pin Code",
      selector: (row) => row.pinCode,
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      cell: (row, index, column, id) => {
        return (
          <>
            <FontAwesomeIcon
              icon={faPen}
              className="Edit-icon"
              size="1x"
              variant="primary"
              onClick={() => openUsersModal(row)}
            />
            <FontAwesomeIcon
              className="Delete-btn"
              icon={faTrash}
              size="1x"
              variant="primary"
              onClick={() => deleteUsers(row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <h3 className="home-heading">Clients</h3>
      <FontAwesomeIcon
        className="Add"
        icon={faPlus}
        size="2x"
        variant="primary"
        onClick={handleShow}
      />

      <div className="table-divss">
        <DataTable
          data={users}
          columns={clientDataColumns}
          highlightOnHover
          responsive
          pagination
        />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{updateUser ? "Edit Client" : "Add Client"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, resetForm)
            }
            enableReinitialize
            initialValues={{
              Name: updateUser?.Name,
              PhoneNumber: updateUser?.PhoneNumber,
              email: updateUser?.email,
              Address: updateUser?.Address,
              City: updateUser?.City,
              pinCode: updateUser?.pinCode,
            }}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicClient Name"
                    >
                      <Form.Label>Client Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Client Name"
                        name="Name"
                        value={formik.values.Name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={formik.touched.Name && !formik.errors.Name}
                        isInvalid={formik.touched.Name && formik.errors.Name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.Name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicPhoneNumber"
                    >
                      <Form.Label> PhoneNumber</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Phone Number"
                        name="PhoneNumber"
                        value={formik.values.PhoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={
                          formik.touched.PhoneNumber &&
                          !formik.errors.PhoneNumber
                        }
                        isInvalid={
                          formik.touched.PhoneNumber &&
                          formik.errors.PhoneNumber
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.PhoneNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicEmail"
                    >
                      <Form.Label>Email ID</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Email"
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
                  </Col>
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicAddress"
                    >
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Address"
                        name="Address"
                        value={formik.values.Address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={
                          formik.touched.Address && !formik.errors.Address
                        }
                        isInvalid={
                          formik.touched.Address && formik.errors.Address
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.Address}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicCity"
                    >
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter City"
                        name="City"
                        value={formik.values.City}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={formik.touched.City && !formik.errors.City}
                        isInvalid={formik.touched.City && formik.errors.City}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.City}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicpinCode"
                    >
                      <Form.Label>Pin Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="pinCode"
                        disabled
                        value={formik.values.pinCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={
                          formik.touched.pinCode && !formik.errors.pinCode
                        }
                        isInvalid={
                          formik.touched.pinCode && formik.errors.pinCode
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.pinCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateUser;
