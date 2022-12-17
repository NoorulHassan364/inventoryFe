import React, { useEffect, useState } from "react";
import "./Products.css";
import DataTable from "react-data-table-component";
import { Tab, Tabs } from "react-bootstrap";
import api from "../../api";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const [points, setPoints] = useState([]);
  const productTypeColumns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    // {
    //   name: "Email",
    //   selector: (row) => row.email,
    //   sortable: true,
    //   // wrap: 'no',
    //   grow: 2,
    // cell: (row, index, column, id) => {
    //   return (
    //     <Link to={`/sellerDetails/${row.id}`} style={{ color: "black" }}>
    //       {row.email}
    //     </Link>
    //   );
    // },
    // },
  ];
  const itemNameColumns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "ProductType",
      selector: (row) => row.productType.name,
      sortable: true,
      grow: 2,
    },
  ];
  const pointsColumns = [
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
      grow: 2,
    },
    {
      name: "Item Name",
      selector: (row) => row.itemName.name,
      sortable: true,
      grow: 2,
    },
  ];

  const getProducts = async (values, resetForm) => {
    try {
      let res = await api.get("/mainproducts");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getItemnames = async (values, resetForm) => {
    try {
      let res = await api.get("/itemnames/items/all");
      setItemNames(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPoints = async (values, resetForm) => {
    try {
      let res = await api.get("/points/name/all");
      setPoints(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProducts();
    getItemnames();
    getPoints();
  }, []);

  return (
    <>
      <Tabs
        defaultActiveKey="productType"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="productType" title="Product Types">
          <div className="table-divss">
            <DataTable
              data={products}
              columns={productTypeColumns}
              highlightOnHover
              responsive
              pagination
            />
          </div>
        </Tab>
        <Tab eventKey="items" title="Items">
          <div className="table-divss">
            <DataTable
              data={itemNames}
              columns={itemNameColumns}
              highlightOnHover
              responsive
              pagination
            />
          </div>
        </Tab>

        <Tab eventKey="points" title="Points">
          <div className="table-divss">
            <DataTable
              data={points}
              columns={pointsColumns}
              highlightOnHover
              responsive
              pagination
            />
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default Products;
