import React, { useEffect, useState } from "react";
import api from "../../api/index";
import DataTable from "react-data-table-component";
import { Form, Col, Button, Modal, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as yup from "yup";
import "./rawMaterial.css";

const RawMaterial = () => {
  const [show, setShow] = useState(false);
  const [selectPic, setSelectPic] = useState(null);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [widthMM, setWidthMM] = useState([]);
  const [thickMM, setThickMM] = useState([]);

  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorsName] = useState(null);
  const [tableData, setTableData] = useState([]);

  const [submitData, setSubmitData] = useState({
    vendorData: "",
    widthMM: "",
    thickMM: "",
    weightQtn: "",
    paymentMode: "",
  });

  const vendorSchema = yup.object().shape({
    vendor: yup.string().required("Enter a valid vendor."),
    widthMM: yup.string().required("Enter a valid widthMM."),
    thickMM: yup.string().required("Enter a valid thickMM."),
    weightQtn: yup.string().required("Enter a valid weightQtn."),
    paymentMode: yup.string().required("Enter a valid paymentMode."),
  });

  const getWidthMM = async (values, resetForm) => {
    try {
      let res = await api.get("/rawMaterial/widthMM");
      setWidthMM(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getVendors = async (values, resetForm) => {
    try {
      let res = await api.get("/vendor");
      setVendors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const purchaseOrderTableData = async (values, resetForm) => {
    try {
      let res = await api.get("/rawMaterial/po");
      setTableData(res.data);
      console.log("umair", tableData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormikFileChange = async (id, e) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);
    await api.patch(`/rawMaterial/po/${id}`, formData);
    purchaseOrderTableData();

    // setSelectPic(file);
    // setFile(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    getWidthMM();
    getVendors();
    purchaseOrderTableData();
  }, []);

  const handleChangeWidthMM = async (e, formik) => {
    try {
      formik.handleChange(e);
      let widthMM = e.target.value;
      let res = await api.get(`/rawMaterial/thickMM/${widthMM}`);
      setThickMM(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectVendor = async (e, formik) => {
    try {
      formik.handleChange(e);
      let vendor = e.target.value;
      let foundVendor = vendors?.find((elem) => {
        return elem._id === vendor;
      });

      console.log(foundVendor);
      setVendorsName(foundVendor);
    } catch (error) {
      console.log(error);
    }
  };

  // let { vendorData, widthMM2, itamName, productPoint, productLength } =
  //   submitData;

  const handleSubmit = async (values, resetForm) => {
    setVendorsName(null);
    try {
      // Find Client
      let vendorData = vendors?.find((elem) => {
        return elem._id === values.vendor;
      });
      console.log(vendorData);

      //  fIND PRODUCT Type
      let wMM = widthMM?.find((elem) => {
        return elem._id === values.widthMM;
      });
      console.log(widthMM);

      // Find Item Name
      let tMM = thickMM?.find((elem) => {
        return elem._id === values.thickMM;
      });
      console.log(thickMM);

      // Find Length
      let weightQtn = values.weightQtn;
      console.log(weightQtn);

      // set State
      setSubmitData({
        vendorData: vendorData,
        widthMM: wMM?.name,
        thickMM: tMM?.name,
        weightQtn: weightQtn,
        paymentMode: values?.paymentMode,
      });

      handleShow();
      // addb invoice number
      values.invoice = tableData.length + 1;
      let res = await api.post("/rawMaterial/po", values);
      // console.log(res.data);
      purchaseOrderTableData();
      // setTableData([...tableData, res.data]);
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRawMat = async (id) => {
    try {
      let res = await api.delete(`/rawMaterial/po/${id}`);
      setTableData(
        tableData.filter((elem) => {
          return elem._id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateRawMat = async (id, status) => {
    try {
      await api.patch(`/rawMaterial/po/${id}`, { status });
      purchaseOrderTableData();
    } catch (error) {
      console.log(error);
    }
  };

  const vendorDataColumns = [
    {
      name: "Invoice.no.",
      selector: (row) => row?.invoice,
      sortable: true,
      grow: 2,
    },
    {
      name: "Vendor Name",
      selector: (row) => row?.vendor?.Name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Phone Number",
      selector: (row) => row?.vendor?.PhoneNumber,
      sortable: true,
      grow: 2,
    },
    {
      name: "Email ID",
      selector: (row) => row?.vendor?.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Pin Code",
      selector: (row) => row?.vendor?.pinCode,
      sortable: true,
      grow: 2,
    },
    {
      name: "Vendor Code",
      selector: (row) => row?.vendor?.vendorCode,
      sortable: true,
      grow: 2,
    },
    {
      name: "Width MM",
      selector: (row) => row?.widthMM?.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Thick MM",
      selector: (row) => row?.thickMM?.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Weight Qtn",
      selector: (row) => row?.weightQtn,
      sortable: true,
      grow: 2,
    },
    {
      name: "Payment Mode",
      selector: (row) => row?.paymentMode,
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      cell: (row, index, column, id) => {
        return (
          <>
            {row?.status == "accept" || row?.status == "reject" ? (
              row.status == "accept" ? null : (
                "Rejected"
              )
            ) : (
              <>
                <FontAwesomeIcon
                  className="Delete-btn"
                  icon={faCircleCheck}
                  size="1x"
                  variant="primary"
                  onClick={() => updateRawMat(row._id, "accept")}
                  style={{ color: "green" }}
                />
                <FontAwesomeIcon
                  className="Delete-btn"
                  icon={faCircleXmark}
                  size="1x"
                  variant="primary"
                  onClick={() => updateRawMat(row._id, "reject")}
                  style={{ color: "brown" }}
                />
              </>
            )}
            {row?.status == "accept" ? (
              row?.photo !== "" ? (
                <img style={{ width: "2rem" }} src={row?.photo} alt="" />
              ) : (
                <Form.Group controlId="image" as={Col} hasValidation>
                  <Form.Control
                    className="rounded-0"
                    type="file"
                    name="image"
                    id="productImg"
                    // value={formik.values.image}
                    onChange={(e) => handleFormikFileChange(row?._id, e)}
                    style={{ display: "none" }}
                  />
                  <br />
                  <div style={{ display: "flex" }}>
                    <label for="productImg">
                      <FontAwesomeIcon
                        className="Delete-btn"
                        icon={faCamera}
                        size="1x"
                        variant="primary"
                        style={{ color: "blue" }}
                      />
                    </label>
                  </div>
                </Form.Group>
              )
            ) : null}

            <FontAwesomeIcon
              className="Delete-btn"
              icon={faTrash}
              size="1x"
              variant="primary"
              onClick={() => deleteRawMat(row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="selectclient_main">
        <Formik
          validationSchema={vendorSchema}
          onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
          enableReinitialize
          initialValues={{
            vendor: "",
            widthMM: "",
            thickMM: "",
            weightQtn: "",
            paymentMode: "",
          }}
        >
          {(formik) => (
            // Select Client
            <Form onSubmit={formik.handleSubmit}>
              <h5>Select Vendor</h5>
              <div className="selectclient_dropdown">
                <Form.Group controlId="vendor" as={Col} hasValidation>
                  <Form.Label className="form__label"></Form.Label>
                  <Form.Control
                    className="rounded-0"
                    as="select"
                    name="vendor"
                    placeholder="Select vendor"
                    value={formik.values.vendor}
                    onChange={(e) => handleSelectVendor(e, formik)}
                    onBlur={formik.handleBlur}
                    isValid={formik.touched.vendor && !formik.errors.vendor}
                    isInvalid={formik.touched.vendor && formik.errors.vendor}
                  >
                    <option value="" disabled>
                      CHOOSE
                    </option>
                    {vendors?.map((elem, index) => {
                      return (
                        <option key={index} value={elem._id}>
                          {elem.Name}
                        </option>
                      );
                    })}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.vendor}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  controlId="vendorPhoneNumber"
                  as={Col}
                  hasValidation
                >
                  <Form.Label className="form__label"></Form.Label>
                  <Form.Control
                    className="rounded-0"
                    disabled
                    name="vendorPhoneNumber"
                    placeholder="Phone Number"
                    value={vendorName?.PhoneNumber}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="vendoremail" as={Col} hasValidation>
                  <Form.Label className="form__label"></Form.Label>
                  <Form.Control
                    className="rounded-0"
                    disabled
                    name="vendoremail"
                    placeholder="E-mail"
                    value={vendorName?.email}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="vendorpincode" as={Col} hasValidation>
                  <Form.Label className="form__label"></Form.Label>
                  <Form.Control
                    className="rounded-0"
                    disabled
                    name="vendorpincode"
                    placeholder="Pin Code"
                    value={vendorName?.pinCode}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="vendorCode" as={Col} hasValidation>
                  <Form.Label className="form__label"></Form.Label>
                  <Form.Control
                    className="rounded-0"
                    disabled
                    name="vendorCode"
                    placeholder="Vendor Code"
                    value={vendorName?.vendorCode}
                  ></Form.Control>
                </Form.Group>
              </div>

              <div className="purchaseOrder_main">
                <h5>Create Purchase Order</h5>
                <div className="purchaseOrder_dropdown">
                  <Form.Group controlId="widthMM" as={Col} hasValidation>
                    <Form.Label className="form__label"></Form.Label>
                    <Form.Control
                      className="rounded-0"
                      as="select"
                      name="widthMM"
                      placeholder="Select widthMM"
                      value={formik.values.widthMM}
                      onChange={(e) => handleChangeWidthMM(e, formik)}
                      onBlur={formik.handleBlur}
                      isValid={formik.touched.widthMM && !formik.errors.widthMM}
                      isInvalid={
                        formik.touched.widthMM && formik.errors.widthMM
                      }
                    >
                      <option value="" disabled>
                        CHOOSE
                      </option>
                      {widthMM.map((elem, index) => {
                        return (
                          <option key={index} value={elem._id}>
                            {elem.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.widthMM}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="thickMM" as={Col} hasValidation>
                    <Form.Label className="form__label"></Form.Label>
                    <Form.Control
                      className="rounded-0"
                      as="select"
                      name="thickMM"
                      placeholder="Select thickMM"
                      value={formik.values.thickMM}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isValid={formik.touched.thickMM && !formik.errors.thickMM}
                      isInvalid={
                        formik.touched.thickMM && formik.errors.thickMM
                      }
                    >
                      <option value="" disabled>
                        CHOOSE
                      </option>
                      {thickMM.map((elem, index) => {
                        return (
                          <option key={index} value={elem._id}>
                            {elem.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.thickMM}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="weightQtn" as={Col} hasValidation>
                    <Form.Label className="form__label"></Form.Label>
                    <Form.Control
                      className="rounded-0"
                      name="weightQtn"
                      placeholder="Enter weight qtn"
                      value={formik.values.weightQtn}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isValid={
                        formik.touched.weightQtn && !formik.errors.weightQtn
                      }
                      isInvalid={
                        formik.touched.weightQtn && formik.errors.weightQtn
                      }
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.weightQtn}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="paymentMode" as={Col} hasValidation>
                    <Form.Label className="form__label"></Form.Label>
                    <Form.Control
                      className="rounded-0"
                      as="select"
                      name="paymentMode"
                      placeholder="Select paymentMode"
                      value={formik.values.paymentMode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isValid={
                        formik.touched.paymentMode && !formik.errors.paymentMode
                      }
                      isInvalid={
                        formik.touched.paymentMode && formik.errors.paymentMode
                      }
                    >
                      <option value="" disabled>
                        CHOOSE
                      </option>
                      <option key="advanced" value="advanced">
                        Advanced
                      </option>
                      <option key="credit" value="credit">
                        Credit
                      </option>
                      <option key="custom" value="custom">
                        Custom
                      </option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.paymentMode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
              <Button
                variant="primary"
                type="submit"
                className="purchase_order_submit_button"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="table_divss">
        <h5>History</h5>
        <div className="scroll_bar">
          <DataTable
            data={tableData}
            columns={vendorDataColumns}
            highlightOnHover
            responsive
            pagination
          />
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Invoice#:{tableData.length} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group
                role="form"
                className="mb-3"
                controlId="formBasicDate"
              >
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  placeholder="Date"
                  name="Date"
                  value={new Date().toLocaleString()}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                role="form"
                className="mb-3"
                controlId="formBasicname"
              >
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Vendor Name"
                  name="name"
                  value={submitData?.vendorData?.Name}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group
                role="form"
                className="mb-3"
                controlId="formBasicphonenumber"
              >
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  placeholder="Phone Number"
                  name="phonenumber"
                  value={submitData?.vendorData?.PhoneNumber}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                role="form"
                className="mb-3"
                controlId="formBasicEmail"
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  disabled
                  placeholder="Email"
                  name="email"
                  value={submitData?.vendorData?.email}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group
                role="form"
                className="mb-3"
                controlId="formBasicaddress"
              >
                <Form.Label>Address1</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  name="Address"
                  value={submitData?.vendorData?.Address1}
                  disabled
                />
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
                  placeholder="vendor Code"
                  name="vendorCode"
                  value={submitData?.vendorData?.vendorCode}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>widthMM</th>
                <th>Item Name</th>
                <th>weight Qtn</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{submitData?.widthMM} </td>
                <td>{submitData?.thickMM} </td>
                <td>{submitData?.weightQtn} </td>
                <td>{submitData?.paymentMode} </td>
              </tr>
            </tbody>
          </Table>

          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RawMaterial;
