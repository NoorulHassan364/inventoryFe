import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import DataTable from "react-data-table-component";
import { Button, Tab, Tabs, Modal, Form, Col, Row } from "react-bootstrap";
import * as yup from "yup";
import api from "../../api/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./vendor.css";
import { color } from "@mui/system";

const Vendor = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setupdateVendor(null);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [vendors, setVendors] = useState([]);
  const [updateVendor, setupdateVendor] = useState(null);

  const schema = yup.object().shape({
    Name: yup.string().required("Enter Your Name."),
    PhoneNumber: yup.string().required("Enter a valid PhoneNumber."),
    email: yup.string().required("Enter a valid Email address."),
    Address1: yup.string().required("Enter a valid Address."),
    Address2: yup.string().required("Enter a valid Address."),
    State: yup.string().required("Enter a valid State Name."),
  });

  const handleSubmit = async (values, resetForm) => {
    try {
      if (updateVendor == null) {
        let res = await api.post("/vendor", values);
        setVendors([...vendors, res.data]);
      } else {
        let res = await api.patch(`/vendor/${updateVendor._id}`, values);
        setVendors(
          vendors.map((elem) => {
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
      if (error.response.data === "vendor Already Exist") {
        window.alert("vendor Already Exist");
      }
      console.log(error);
    }
  };

  const getVendorData = async () => {
    try {
      let res = await api.get("/vendor");
      setVendors(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getVendorData();
  }, []);

  const openvendorsModal = async (user) => {
    try {
      setupdateVendor(user);
      setShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deletevendors = async (id) => {
    try {
      let res = await api.delete(`/vendor/${id}`);
      setVendors(
        vendors.filter((elem) => {
          return elem._id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const vendorDataColumns = [
    {
      name: "Sr.no.",
      cell: (row, index, column, id) => {
        return <h6>{index + 1}</h6>;
      },
    },
    {
      name: "Vendor Name",
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
      name: "Address1",
      selector: (row) => row.Address1,
      sortable: true,
      grow: 2,
    },
    {
      name: "Address2",
      selector: (row) => row.Address2,
      sortable: true,
      grow: 2,
    },
    {
      name: "State",
      selector: (row) => row.State,
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
      name: "Vendor Code",
      selector: (row) => row.vendorCode,
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
              onClick={() => openvendorsModal(row)}
            />
            <FontAwesomeIcon
              className="Delete-btn"
              icon={faTrash}
              size="1x"
              variant="primary"
              onClick={() => deletevendors(row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <h3 className="home-heading">Vendors</h3>
      <FontAwesomeIcon
        className="Add"
        icon={faPlus}
        size="2x"
        variant="primary"
        onClick={handleShow}
      />

      <div className="table-divss">
        <DataTable
          data={vendors}
          columns={vendorDataColumns}
          highlightOnHover
          responsive
          pagination
        />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            {updateVendor ? "Edit Vendor" : "Add Vendor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, resetForm)
            }
            enableReinitialize
            initialValues={{
              Name: updateVendor?.Name,
              PhoneNumber: updateVendor?.PhoneNumber,
              email: updateVendor?.email,
              Address1: updateVendor?.Address1,
              Address2: updateVendor?.Address2,
              State: updateVendor?.State,
              pinCode: updateVendor?.pinCode,
              vendorCode: updateVendor?.vendorCode,
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
                      <Form.Label>Vendor Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Vendor Name"
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
                      <Form.Label>Address1</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Address1"
                        name="Address1"
                        value={formik.values.Address1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={
                          formik.touched.Address1 && !formik.errors.Address1
                        }
                        isInvalid={
                          formik.touched.Address1 && formik.errors.Address1
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.Address1}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicAddress"
                    >
                      <Form.Label>Address2</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Address2"
                        name="Address2"
                        value={formik.values.Address2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={
                          formik.touched.Address2 && !formik.errors.Address2
                        }
                        isInvalid={
                          formik.touched.Address2 && formik.errors.Address2
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.Address2}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicState"
                    >
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter State"
                        name="State"
                        value={formik.values.State}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={formik.touched.State && !formik.errors.State}
                        isInvalid={formik.touched.State && formik.errors.State}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.State}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
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
                  <Col>
                    <Form.Group
                      role="form"
                      className="mb-3"
                      controlId="formBasicpinCode"
                    >
                      <Form.Label>Vendor Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="vendorCode"
                        disabled
                        value={formik.values.vendorCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isValid={
                          formik.touched.vendorCode && !formik.errors.vendorCode
                        }
                        isInvalid={
                          formik.touched.vendorCode && formik.errors.vendorCode
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.vendorCode}
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

export default Vendor;
