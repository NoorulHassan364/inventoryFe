import {
  faCamera,
  faPen,
  faPlus,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import * as yup from "yup";
import api from "../../api/index";
import { Formik } from "formik";
import { useState } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";

const ProductionPhase = () => {
  const [show, setShow] = useState(false);
  const [showMachine, setShowMachine] = useState(false);
  const [stages, setStages] = useState([]);
  const [updatedStage, setUpdateeStage] = useState(null);
  const [machines, setMachines] = useState([]);
  const [updatedMachine, setUpdatedMachine] = useState(null);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [showRawMaterial, setShowRawMaterial] = useState(false);
  const [requestedRawM, setRequestedRawM] = useState([]);
  const [allRequestedRawM, setallRequestedRawM] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [onGoingReport, setOnGoingReport] = useState([]);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileURL] = useState(null);
  const [productionWeight, setProductionWeight] = useState([]);
  const [prodWegihtModal, setProdWegihtModal] = useState(false);
  const [prodAndScrapModal, setProdAndScrapModal] = useState(false);
  const [prodAndScrap, setProdAndScrap] = useState([]);

  const handleClose = () => {
    setUpdateeStage(null);
    setShow(false);
  };

  const handleCloseMachine = () => {
    setUpdatedMachine(null);
    setShowMachine(false);
  };

  const handleCloseRawMaterial = () => {
    setShowRawMaterial(false);
  };
  const handleCloseReport = () => {
    setShowReportModal(false);
    setFile(null);
    setFileURL(null);
  };

  const handleCloseProdWeight = () => {
    setProdWegihtModal(false);
  };

  const handleCloseProdAndScrap = () => {
    setProdAndScrapModal(false);
  };

  const handleShow = () => setShow(true);
  const handleShowMachine = () => setShowMachine(true);
  const handleShowRawM = () => setShowRawMaterial(true);
  const handleShowReport = () => setShowReportModal(true);
  const handleShowProdWeight = () => setProdWegihtModal(true);
  const handleShowProdAndScrap = () => setProdAndScrapModal(true);

  const schema = yup.object().shape({
    name: yup.string().required("Enter Stage Name"),
  });

  const machineSchema = yup.object().shape({
    name: yup.string().required("Enter Machine Name"),
    stage: yup.string().required("Enter Stage"),
  });

  const reportSchema = yup.object().shape({
    machine: yup.string().required("Enter Machine Name"),
    widthMM: yup.string().required("Enter widthMM"),
    thickMM: yup.string().required("Enter thickMM"),
    weightQtn: yup.string().required("Enter weightQtn"),
  });

  const prodWeightSchema = yup.object().shape({
    polishedPipe: yup.string().required("Enter polishedPipe"),
    blackPipe: yup.string().required("Enter blackPipe"),
    smallPipe: yup.string().required("Enter smallPipe"),
  });

  const prodAndScrapSchema = yup.object().shape({
    production: yup.string().required("Enter production"),
    scrap: yup.string().required("Enter scrap"),
  });

  useEffect(() => {
    getStages();
    getMachines();
    getRawMaterial();
    getRequestedRM();
    getOnGoingReports();
    getProdWeight();
    getProdAndScrap();
  }, []);

  const handleSubmit = async (values, resetForm) => {
    try {
      if (updatedStage == null) {
        let res = await api.post("/production/stage", values);
        setStages([...stages, res.data]);
      } else {
        let res = await api.patch(
          `/production/stage/${updatedStage?._id}`,
          values
        );
        setStages(
          stages?.map((elem) => {
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
      console.log(error);
    }
  };

  const getStages = async () => {
    try {
      let res = await api.get("/production/stage");
      setStages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openStageModal = async (user) => {
    try {
      setUpdateeStage(user);
      setShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStage = async (id) => {
    try {
      let res = await api.delete(`/production/stage/${id}`);
      setStages(
        stages?.filter((elem) => {
          return elem._id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  //machines routes
  const handleSubmitMachine = async (values, resetForm) => {
    try {
      if (updatedMachine == null) {
        let res = await api.post("/production/machine", values);
        setMachines([...machines, res.data]);
      } else {
        let res = await api.patch(
          `/production/machine/${updatedMachine?._id}`,
          values
        );
        setMachines(
          machines?.map((elem) => {
            if (elem._id == res.data._id) {
              return (elem = res.data);
            } else {
              return elem;
            }
          })
        );
      }

      resetForm();
      handleCloseMachine();
    } catch (error) {
      console.log(error);
    }
  };

  const getMachines = async () => {
    try {
      let res = await api.get("/production/machine");
      setMachines(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openMachineModal = async (user) => {
    try {
      setUpdatedMachine(user);
      setShowMachine(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMachine = async (id) => {
    try {
      let res = await api.delete(`/production/machine/${id}`);
      setMachines(
        machines?.filter((elem) => {
          return elem._id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const machineColumns = [
    {
      name: "Sr No.",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 2,
    },
    {
      name: "Machine Name",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Stage",
      selector: (row) => row?.stage?.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "ID",
      selector: (row) => row.uniqueId,
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
              style={{ marginLeft: "1rem" }}
              onClick={() => openMachineModal(row)}
            />
            <FontAwesomeIcon
              className="Delete-btn"
              icon={faTrash}
              size="1x"
              variant="primary"
              onClick={() => deleteMachine(row._id)}
            />
          </>
        );
      },
    },
  ];

  //Request Token
  const getRequestedRM = async () => {
    try {
      let res = await api.get("/production/requestToken");
      setallRequestedRawM(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuanityChange = (row, value) => {
    debugger;
    let rawM = rawMaterial?.find((el) => el?._id == row?._id);
    let f = requestedRawM?.find((el) => el?.rowId == row?._id);
    if (value == "") {
      setRequestedRawM(requestedRawM?.filter((el) => el?.rowId !== row?._id));
    }
    if (f) {
      setRequestedRawM(
        requestedRawM?.map((el) => {
          if (el?.rowId == row?._id) {
            return {
              rowId: row?._id,
              value,
              remainingQTN: parseInt(rawM?.weightQtn) - parseInt(value),
              thickMM: row?.thickMM?.name,
              widthMM: row?.widthMM?.name,
            };
          } else {
            return el;
          }
        })
      );
    } else {
      setRequestedRawM([
        ...requestedRawM,
        {
          rowId: row?._id,
          value,
          remainingQTN: parseInt(rawM?.weightQtn) - parseInt(value),
          thickMM: row?.thickMM?.name,
          widthMM: row?.widthMM?.name,
        },
      ]);
    }
  };

  const handleSumitRawM = async () => {
    if (requestedRawM?.length > 0) {
      await api.post("/production/requestToken", { data: requestedRawM });
      getRawMaterial();
      getRequestedRM();
      setRequestedRawM([]);
      setShowRawMaterial(false);
    }
    console.log("rawM..", requestedRawM);
  };

  const rawMColumns = [
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
      grow: 1,
    },
    {
      name: "Action",
      grow: 3,
      cell: (row, index, column, id) => {
        return (
          <>
            <Form.Control
              type="number"
              placeholder="Quantity"
              name="quantity"
              // value={formik.values.name}
              onChange={(e) => handleQuanityChange(row, e.target.value)}
            />
          </>
        );
      },
    },
  ];

  const requestedRawMCols = [
    {
      name: "Date",
      selector: (row) => row?.createdAt,
      sortable: true,
      grow: 2,
    },
    {
      name: "Width MM",
      selector: (row) => row?.widthMM,
      sortable: true,
      grow: 2,
    },
    {
      name: "Thick MM",
      selector: (row) => row?.thickMM,
      sortable: true,
      grow: 2,
    },
    {
      name: "Weight Qtn",
      selector: (row) => row?.weightQtn,
      sortable: true,
      grow: 2,
    },
  ];

  const onGoingReportCols = [
    {
      name: "Date",
      selector: (row) => row?.createdAt,
      sortable: true,
      grow: 2,
    },
    {
      name: "Machine",
      selector: (row) => row?.machine?.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Machine ID",
      selector: (row) => row?.machine?.uniqueId,
      sortable: true,
      grow: 2,
    },
    {
      name: "Width MM",
      selector: (row) => row?.widthMM,
      sortable: true,
      grow: 2,
    },
    {
      name: "Thick MM",
      selector: (row) => row?.thickMM,
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
      name: "Photo",
      sortable: true,
      grow: 2,
      cell: (row) => {
        return <img src={row?.photo} alt="imggg" style={{ width: "2rem" }} />;
      },
    },
  ];

  const handleSubmitOnGoingReport = async (values, resetForm) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        if (Array.isArray(values[key])) {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          if (values[key] !== null) formData.append(key, values[key]);
        }
      }
      formData.append("photo", file);
      let res = await api.post("/production/onGoingReport", formData);
      setOnGoingReport([...onGoingReport, res.data]);
      resetForm();
      setFile(null);
      setFileURL(null);
      getOnGoingReports();
      handleCloseReport();
    } catch (error) {
      console.log(error);
    }
  };

  const getOnGoingReports = async () => {
    try {
      let res = await api.get("/production/onGoingReport");
      setOnGoingReport(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRawMaterial = async () => {
    try {
      let res = await api.get("/rawMaterial/po");
      setRawMaterial(res.data?.filter((el) => parseInt(el?.weightQtn) > 0));
    } catch (error) {
      console.log(error);
    }
  };
  const handleFormikFileChange = async (e) => {
    setFile(e.target.files[0]);
    setFileURL(URL.createObjectURL(e.target.files[0]));
  };

  //production weight
  const prodWeightCols = [
    {
      name: "Date",
      selector: (row) => row?.createdAt,
      sortable: true,
      grow: 2,
    },
    {
      name: "Polished Pipe",
      selector: (row) => row?.polishedPipe,
      sortable: true,
      grow: 2,
    },
    {
      name: "Balck Pipe",
      selector: (row) => row?.blackPipe,
      sortable: true,
      grow: 2,
    },
    {
      name: "Small Pipe",
      selector: (row) => row?.smallPipe,
      sortable: true,
      grow: 2,
    },
  ];
  const getProdWeight = async () => {
    try {
      let res = await api.get("/production/productionWeight");
      setProductionWeight(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitProdWeight = async (values, resetForm) => {
    try {
      let res = await api.post("/production/productionWeight", values);
      setProductionWeight([...productionWeight, res.data]);
      resetForm();
      getProdWeight();
      handleCloseProdWeight();
    } catch (error) {
      console.log(error);
    }
  };

  //prod and scrap
  //production weight
  const prodAndScrapCols = [
    {
      name: "Date",
      selector: (row) => row?.createdAt,
      sortable: true,
      grow: 2,
    },
    {
      name: "Production",
      selector: (row) => row?.production,
      sortable: true,
      grow: 2,
    },
    {
      name: "Scrap",
      selector: (row) => row?.scrap,
      sortable: true,
      grow: 2,
    },
  ];

  const getProdAndScrap = async () => {
    try {
      let res = await api.get("/production/prodAndScrap");
      setProdAndScrap(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitProdAndScrap = async (values, resetForm) => {
    try {
      let res = await api.post("/production/prodAndScrap", values);
      setProdAndScrap([...prodAndScrap, res.data]);
      resetForm();
      getProdAndScrap();
      handleCloseProdAndScrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* STages  */}
      <h4 className="home-heading">Production Stages</h4>
      <FontAwesomeIcon
        className="Add"
        icon={faPlus}
        size="2x"
        variant="primary"
        onClick={handleShow}
      />

      <div className="table-divss">
        <div
          style={{
            display: "flex",
            columnGap: "1rem",
            marginLeft: "1rem",
            marginTop: "2rem",
          }}
        >
          {stages?.map((el) => {
            return (
              <div
                style={{
                  padding: "1rem",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <span>{el?.name}</span>
                <FontAwesomeIcon
                  icon={faPen}
                  className="Edit-icon"
                  size="1x"
                  variant="primary"
                  style={{ marginLeft: "1rem" }}
                  onClick={() => openStageModal(el)}
                />
                <FontAwesomeIcon
                  className="Delete-btn"
                  style={{ marginLeft: "0.5rem" }}
                  icon={faTrash}
                  size="1x"
                  variant="primary"
                  onClick={() => deleteStage(el._id)}
                />
              </div>
            );
          })}
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>
              {updatedStage ? "Edit Stage" : "Add Stage"}
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
                name: updatedStage?.name,
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient name"
                      >
                        <Form.Label>name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Stage name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={formik.touched.name && !formik.errors.name}
                          isInvalid={formik.touched.name && formik.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.name}
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
      </div>
      <hr />

      {/* Production Machines  */}
      <h4 className="home-heading mt-4">Production Machines</h4>
      <FontAwesomeIcon
        className="Add"
        icon={faPlus}
        size="2x"
        variant="primary"
        onClick={handleShowMachine}
      />

      <div className="table-divss">
        <DataTable
          data={machines}
          columns={machineColumns}
          highlightOnHover
          responsive
          pagination
        />

        <Modal show={showMachine} onHide={handleCloseMachine}>
          <Modal.Header>
            <Modal.Title>
              {updatedMachine ? "Edit Machine" : "Add Machine"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={machineSchema}
              onSubmit={(values, { resetForm }) =>
                handleSubmitMachine(values, resetForm)
              }
              enableReinitialize
              initialValues={{
                name: updatedMachine?.name,
                stage: updatedMachine?.stage ? updatedMachine?.stage : "",
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient name"
                      >
                        <Form.Label>Machine Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Machine name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={formik.touched.name && !formik.errors.name}
                          isInvalid={formik.touched.name && formik.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient stage"
                      >
                        <Form.Label>Stage</Form.Label>
                        <Form.Control
                          as="select"
                          placeholder="Enter Stage"
                          name="stage"
                          value={formik.values.stage}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={formik.touched.stage && !formik.errors.stage}
                          isInvalid={
                            formik.touched.stage && formik.errors.stage
                          }
                        >
                          <option value="" disabled>
                            CHOOSE
                          </option>
                          {stages?.map((el) => {
                            return <option value={el?._id}>{el?.name}</option>;
                          })}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.stage}
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
            <Button variant="secondary" onClick={handleCloseMachine}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <hr />

      <h4 className="home-heading mt-4">Token to Inward Department</h4>
      <Button
        type="primary"
        onClick={handleShowRawM}
        style={{ float: "right" }}
      >
        Reqest Token
      </Button>

      <div className="table-divss">
        <DataTable
          data={allRequestedRawM}
          columns={requestedRawMCols}
          highlightOnHover
          responsive
          pagination
        />

        <Modal show={showRawMaterial} onHide={handleCloseRawMaterial}>
          <Modal.Header>
            <Modal.Title>Raw Material</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DataTable
              data={rawMaterial}
              columns={rawMColumns}
              highlightOnHover
              responsive
              pagination
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseRawMaterial}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSumitRawM}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <hr />

      <h4 className="home-heading mt-4">Report</h4>
      <FontAwesomeIcon
        className="Add"
        icon={faPlus}
        size="2x"
        variant="primary"
        onClick={handleShowReport}
      />

      <div className="table-divss">
        <DataTable
          data={onGoingReport}
          columns={onGoingReportCols}
          highlightOnHover
          responsive
          pagination
        />

        <Modal show={showReportModal} onHide={handleCloseReport}>
          <Modal.Header>
            <Modal.Title>OnGoing Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={reportSchema}
              onSubmit={(values, { resetForm }) =>
                handleSubmitOnGoingReport(values, resetForm)
              }
              enableReinitialize
              initialValues={{
                machine: "",
                widthMM: "",
                thickMM: "",
                weightQtn: "",
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient stage"
                      >
                        <Form.Label>Machine</Form.Label>
                        <Form.Control
                          as="select"
                          placeholder="Enter Machine"
                          name="machine"
                          value={formik.values.machine}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={
                            formik.touched.machine && !formik.errors.machine
                          }
                          isInvalid={
                            formik.touched.machine && formik.errors.machine
                          }
                        >
                          <option value="" disabled>
                            CHOOSE
                          </option>
                          {machines?.map((el) => {
                            return <option value={el?._id}>{el?.name}</option>;
                          })}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.machine}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient name"
                      >
                        <Form.Label>widthMM</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter widthMM"
                          name="widthMM"
                          value={formik.values.widthMM}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={
                            formik.touched.widthMM && !formik.errors.widthMM
                          }
                          isInvalid={
                            formik.touched.widthMM && formik.errors.widthMM
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.widthMM}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient name"
                      >
                        <Form.Label>ThickMM</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter thickMM"
                          name="thickMM"
                          value={formik.values.thickMM}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={
                            formik.touched.thickMM && !formik.errors.thickMM
                          }
                          isInvalid={
                            formik.touched.thickMM && formik.errors.thickMM
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.thickMM}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient"
                      >
                        <Form.Label>Weight Qtn</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter weightQtn"
                          name="weightQtn"
                          value={formik.values.weightQtn}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={
                            formik.touched.weightQtn && !formik.errors.weightQtn
                          }
                          isInvalid={
                            formik.touched.weightQtn && formik.errors.weightQtn
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.weightQtn}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group role="form" controlId="formBasicClient">
                        <Form.Label>Photo</Form.Label>
                        <Form.Control
                          className="rounded-0"
                          type="file"
                          name="image"
                          id="productImg"
                          // value={formik.values.image}
                          onChange={(e) => handleFormikFileChange(e)}
                          style={{ display: "none" }}
                        />
                      </Form.Group>
                      <div style={{ display: "flex" }}>
                        <label for="productImg">
                          <FontAwesomeIcon
                            className="Delete-btn"
                            icon={faUpload}
                            size="1x"
                            variant="primary"
                            style={{ color: "blue", fontSize: "1.5rem" }}
                          />
                        </label>
                        <img
                          src={fileUrl}
                          // alt="imggg"
                          style={{
                            width: "3rem",
                            height: "3rem",
                            marginLeft: "2rem",
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-5">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReport}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <hr />

      <h4 className="home-heading mt-4">Production Weight</h4>
      <FontAwesomeIcon
        className="Add"
        icon={faPlus}
        size="2x"
        variant="primary"
        onClick={handleShowProdWeight}
      />

      <div className="table-divss">
        <DataTable
          data={productionWeight}
          columns={prodWeightCols}
          highlightOnHover
          responsive
          pagination
        />

        <Modal show={prodWegihtModal} onHide={handleCloseProdWeight}>
          <Modal.Header>
            <Modal.Title>Production Weight</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={prodWeightSchema}
              onSubmit={(values, { resetForm }) =>
                handleSubmitProdWeight(values, resetForm)
              }
              enableReinitialize
              initialValues={{
                polishedPipe: "",
                blackPipe: "",
                smallPipe: "",
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient stage"
                      >
                        <Form.Label>Polished Pipe</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter polishedPipe"
                          name="polishedPipe"
                          value={formik.values.polishedPipe}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={
                            formik.touched.polishedPipe &&
                            !formik.errors.polishedPipe
                          }
                          isInvalid={
                            formik.touched.polishedPipe &&
                            formik.errors.polishedPipe
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.polishedPipe}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient name"
                      >
                        <Form.Label>Black Pipe</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter blackPipe"
                          name="blackPipe"
                          value={formik.values.blackPipe}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={
                            formik.touched.blackPipe && !formik.errors.blackPipe
                          }
                          isInvalid={
                            formik.touched.blackPipe && formik.errors.blackPipe
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.blackPipe}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient name"
                      >
                        <Form.Label>Small Pipe</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter smallPipe"
                          name="smallPipe"
                          value={formik.values.smallPipe}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={
                            formik.touched.smallPipe && !formik.errors.smallPipe
                          }
                          isInvalid={
                            formik.touched.smallPipe && formik.errors.smallPipe
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.smallPipe}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col></Col>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-5">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseProdWeight}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <hr />

      <h4 className="home-heading mt-4">Production Vs Scrap</h4>
      <FontAwesomeIcon
        className="Add"
        icon={faPlus}
        size="2x"
        variant="primary"
        onClick={handleShowProdAndScrap}
      />

      <div className="table-divss">
        <DataTable
          data={prodAndScrap}
          columns={prodAndScrapCols}
          highlightOnHover
          responsive
          pagination
        />

        <Modal show={prodAndScrapModal} onHide={handleCloseProdAndScrap}>
          <Modal.Header>
            <Modal.Title>Production vs Scrap</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={prodAndScrapSchema}
              onSubmit={(values, { resetForm }) =>
                handleSubmitProdAndScrap(values, resetForm)
              }
              enableReinitialize
              initialValues={{
                production: "",
                scrap: "",
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient stage"
                      >
                        <Form.Label>Production</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter production"
                          name="production"
                          value={formik.values.production}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={
                            formik.touched.production &&
                            !formik.errors.production
                          }
                          isInvalid={
                            formik.touched.production &&
                            formik.errors.production
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.production}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        role="form"
                        className="mb-3"
                        controlId="formBasicClient name"
                      >
                        <Form.Label>Scrap</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter scrap"
                          name="scrap"
                          value={formik.values.scrap}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isValid={formik.touched.scrap && !formik.errors.scrap}
                          isInvalid={
                            formik.touched.scrap && formik.errors.scrap
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.scrap}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-5">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseProdAndScrap}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ProductionPhase;
