import React, { useEffect, useState } from "react";
import api from "../../api/index";
import DataTable from "react-data-table-component";
import { Form, Col, Button ,Modal,Row,Table} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as yup from "yup";
import "./purchaseOrders.css";
const PurchaseOrders = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [products, setProducts] = useState([]);
  const [itemname, setItemname] = useState([]);
  const [points, setPoints] = useState([]);

  const [clients, setClients] = useState([])
  const [clientsName, setClientsName] = useState(null)
  const [tableData, setTableData] = useState([])

  

  const [submitData, setSubmitData] = useState({
   clientData:"",
   productName:"",
   itamName:"",
   productPoint:"",
   productLength:""
  })
  

  const clientSchema = yup.object().shape({
    client: yup.string().required("Enter a valid client."),
    productType: yup.string().required("Enter a valid productType."),
    itemName: yup.string().required("Enter a valid itemName."),
    points: yup.string().required("Enter a valid points."),
    Length: yup.string().required("Enter a valid Length."),
  });

  


  const getProduct = async (values, resetForm) => {
    try {
      let res = await api.get("/mainproducts");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClients = async (values, resetForm) => {
    try {
      let res = await api.get("/clients");
      setClients(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  const purchaseOrderTableData = async (values, resetForm) => {
    try {
      let res = await api.get("/purchaseorder");
      setTableData(res.data);
      console.log("umair",tableData)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProduct();
    getClients();
    purchaseOrderTableData();

  }, []);

  const handleItemname = async (e, formik) => {
    try {
      formik.handleChange(e);
      let itemNames = e.target.value;
      let res = await api.get(`/points/itempoints/${itemNames}`);
      setPoints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProducttype = async (e, formik) => {
    try {
      formik.handleChange(e);
      let product = e.target.value;
      let res = await api.get(`/itemnames/${product}`);
      setItemname(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectClient = async (e, formik) => {
    try {
      formik.handleChange(e);
      let client = e.target.value;
     let foundClient= clients.find((elem)=>{
        return elem._id===client
      })

      console.log(foundClient)
      setClientsName(foundClient)
    } catch (error) {
      console.log(error);
    }
  };
 
  let { clientData,productName,itamName,productPoint,productLength}=submitData
  const handleSubmit = async (values, resetForm) => {
    setClientsName(null)
    console.log("Ali", tableData.length)
    try {
      // Find Client
       clientData= clients.find((elem)=>{
        return elem._id===values.client
      })
      console.log(clientData)

      //  fIND PRODUCT Type
     productName= products.find((elem)=>{
        return elem._id===values.productType
      })
      console.log(productName)
      
      // Find Item Name
      itamName= itemname.find((elem)=>{
          return elem._id===values.itemName
        })
        console.log(itamName)

            // Find Point
           productPoint= points.find((elem)=>{
                  return elem._id===values.points
                })
                console.log(productPoint)

               // Find Length
           productLength=values.Length
                console.log(productLength)

                // set State
          setSubmitData({clientData:clientData, productName: productName.name,itamName:itamName.name,productPoint: productPoint.value,productLength: productLength})

          handleShow()
          // addb invoice number
          values.invoice= tableData.length+1
        let res = await api.post("/purchaseorder", values);
          console.log(res.data)
          setTableData([...tableData,res.data])
          console.log(tableData)
          // console.log(values)
          purchaseOrderTableData()
          resetForm()
        } catch (error) {
          console.log(error);
    }
  };

  const deleteClient = async (id) => {
    try {
      let res = await api.delete(`/purchaseorder/${id}`);
      setTableData(
        tableData.filter((elem) => {
          return elem._id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  
  const clientDataColumns = [
    {
      name: "Invoice.no.",
      selector: (row) => row.invoice,
      sortable: true,
      grow: 2,
    },
    {
      name: "Client Name",
      selector: (row) => row.client.Name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Phone Number",
      selector: (row) => row.client.PhoneNumber,
      sortable: true,
      grow: 2,
    },
    {
      name: "Email ID",
      selector: (row) => row.client.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Pin Code",
      selector: (row) => row.client.pinCode,
      sortable: true,
      grow: 2,
    },
    {
      name: "Product Type",
      selector: (row) => row.productType.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Item Name",
      selector: (row) => row.itemName.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Points",
      selector: (row) => row.points.value,
      sortable: true,
      grow: 2,
    },
    {
      name: "Length",
      selector: (row) => row.Length,
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      cell: (row, index, column, id) => {
        return (
          <>
            <FontAwesomeIcon
              className="Delete-btn"
              icon={faTrash}
              size="1x"
              variant="primary"
              onClick={() => deleteClient(row._id)}
            />
          </>
        );
      },
    },
  ];

  return (<>
    <div className="selectclient_main">
      <Formik
        validationSchema={clientSchema}
        onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        enableReinitialize
        initialValues={{
          client: "",
          productType: "",
          itemName: "",
          points: "",
          Length:""
        }}
      >
        {(formik) => (
          // Select Client
          <Form onSubmit={formik.handleSubmit}>
            <h5>Select Client</h5>
            <div className="selectclient_dropdown">
              <Form.Group controlId="client" as={Col} hasValidation>
                <Form.Label className="form__label"></Form.Label>
                <Form.Control
                  className="rounded-0"
                  as="select"
                  name="client"
                  placeholder="Select Client"
                  value={formik.values.client}
                  onChange={(e) => handleSelectClient(e, formik)}
                  onBlur={formik.handleBlur}
                  isValid={
                    formik.touched.client && !formik.errors.client
                  }
                  isInvalid={
                    formik.touched.client && formik.errors.client
                  }
                >
                  <option value="" disabled>
                    CHOOSE
                  </option>
                  {clients.map((elem, index) => {
                    return (
                      <option key={index} value={elem._id}>
                        {elem.Name}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.client}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="clientPhoneNumber" as={Col} hasValidation>
                <Form.Label className="form__label"></Form.Label>
                <Form.Control
                  className="rounded-0"
                  disabled
                  name="clientPhoneNumber"
                  placeholder="Phone Number"
                  value={clientsName?.PhoneNumber}               
                >
                </Form.Control>
              
              </Form.Group>
              <Form.Group controlId="clientemail" as={Col} hasValidation>
                <Form.Label className="form__label"></Form.Label>
                <Form.Control
                  className="rounded-0"
                  disabled
                  name="clientemail"
                  placeholder="E-mail"
                  value={clientsName?.email}
                >
                </Form.Control>
               
              </Form.Group>
              <Form.Group controlId="clientpincode" as={Col} hasValidation>
                <Form.Label className="form__label"></Form.Label>
                <Form.Control
                  className="rounded-0"
                  disabled
                  name="clientpincode"
                  placeholder="Pin Code"
                  value={clientsName?.pinCode}
                >
                </Form.Control>
                
              </Form.Group>
            </div>
            <div className="purchaseOrder_main" >
            <h5>Create Purchase Order</h5>
            <div className="purchaseOrder_dropdown">
              <Form.Group controlId="productType" as={Col} hasValidation>
                <Form.Label className="form__label"></Form.Label>
                <Form.Control
                  className="rounded-0"
                  as="select"
                  name="productType"
                  placeholder="Select ProductType"
                  value={formik.values.productType}
                  onChange={(e) => handleProducttype(e, formik)}
                  onBlur={formik.handleBlur}
                  isValid={
                    formik.touched.productType && !formik.errors.productType
                  }
                  isInvalid={
                    formik.touched.productType && formik.errors.productType
                  }
                >
                  <option value="" disabled>
                    CHOOSE
                  </option>
                  {products.map((elem, index) => {
                    return (
                      <option key={index} value={elem._id}>
                        {elem.name}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.productType}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="itemName" as={Col} hasValidation>
                <Form.Label className="form__label"></Form.Label>
                <Form.Control
                  className="rounded-0"
                  as="select"
                  name="itemName"
                  placeholder="Select itemName"
                  value={formik.values.itemName}
                  onChange={(e) => handleItemname(e, formik)}
                  onBlur={formik.handleBlur}
                  isValid={formik.touched.itemName && !formik.errors.itemName}
                  isInvalid={formik.touched.itemName && formik.errors.itemName}
                >
                  <option value="" disabled>
                    CHOOSE
                  </option>
                  {itemname.map((elem, index) => {
                    return (
                      <option key={index} value={elem._id}>
                        {elem.name}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.itemName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="points" as={Col} hasValidation>
                <Form.Label className="form__label"></Form.Label>
                <Form.Control
                  className="rounded-0"
                  as="select"
                  name="points"
                  placeholder="Enter Points"
                  value={formik.values.points}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isValid={formik.touched.points && !formik.errors.points}
                  isInvalid={formik.touched.points && formik.errors.points}
                >
                  <option value="" disabled>
                    CHOOSE
                  </option>
                  {points.map((elem, index) => {
                    return (
                      <option key={index} value={elem._id}>
                        {elem.value}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.points}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="Length" as={Col} hasValidation>
                <Form.Label className="form__label"></Form.Label>
                <Form.Control
                  className="rounded-0"
                  name="Length"
                  placeholder="Enter Length/Bundles"
                  value={formik.values.Length}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isValid={formik.touched.Length && !formik.errors.Length}
                  isInvalid={formik.touched.Length && formik.errors.Length}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.Length}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            </div>
            <Button variant="primary" type="submit"  className="purchase_order_submit_button" >Submit</Button>
          </Form>
        )}
      </Formik>
    </div>
    <div className="table_divss">
    <h5>History</h5>
    <div className="scroll_bar" >
        <DataTable
          data={tableData}
          columns={clientDataColumns}
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
                      <Form.Label>Client Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Client Name"
                        name="name"
                        value={clientData.Name}
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
                        value={clientData.PhoneNumber}
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
                        value={clientData.email}
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
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Address"
                        name="Address"
                        value={clientData.Address}
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
                      <Form.Label>Pin Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Pin Code"
                        name="pinCode"
                        value={clientData.pinCode}
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
          <th>ProductType</th>
          <th>Item Name</th>
          <th>Points</th>
          <th>Length</th>
        </tr>
      </thead>
      <tbody>
        <tr> 
          <td>{submitData.productName} </td>   
          <td>{submitData.itamName} </td>
          <td>{submitData.productPoint} </td>    
          <td>{submitData.productLength} </td>   
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

export default PurchaseOrders;
