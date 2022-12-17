import { NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./Sidebar";
import "./style.css";
import Logo from "../../assets/Logo.png";
import { AuthContext } from "../../contexts/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";

import {
  faSuitcase,
  faRecycle,
  faBars,
  faBasketShopping,
  faArrowUpFromGroundWater,
  faIndustry,
  faPrescriptionBottle,
  faUniversalAccess,
  faC,
  faUser,
  faFileWaveform,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Signin from "../../pages/Signin/Signin";
const routes = [
  {
    path: "/createuser",
    name: "Clients",
    icon: <FontAwesomeIcon icon={faUsers} />,
  },
  {
    path: "/",
    name: "Products",
    icon: <FontAwesomeIcon icon={faProductHunt} />,
    // subRoutes: [
    //   {
    //     path: "/",
    //     name: "Utiles",
    //     icon: <FontAwesomeIcon icon={faProductHunt} />,
    //   },
    //   {
    //     path: "/",
    //     name: "Products",
    //     icon: <FontAwesomeIcon icon={faProductHunt} />,
    //   },
    // ],
  },

  {
    path: "/purchaseorders",
    name: "Purchase orders",
    icon: <FontAwesomeIcon icon={faBasketShopping} />,
  },
  {
    path: "/vendors",
    name: "Vendors",
    icon: <FontAwesomeIcon icon={faBasketShopping} />,
  },
  {
    path: "/rawmaterial",
    name: "Raw Material",
    icon: <FontAwesomeIcon icon={faRecycle} />,
  },
  {
    path: "/materialinward",
    name: "Material Inward",
    icon: <FontAwesomeIcon icon={faArrowUpFromGroundWater} />,
  },
  {
    path: "/productionphase",
    name: "Production Phase",
    icon: <FontAwesomeIcon icon={faIndustry} />,
  },
  {
    path: "/scrapmanagement",
    name: "Scrap Management",
    icon: <FontAwesomeIcon icon={faPrescriptionBottle} />,
  },
  {
    path: "/packaging",
    name: "Packaging",
    icon: <FontAwesomeIcon icon={faSuitcase} />,
  },
  {
    path: "/dispatch&sales",
    name: "Dispatch/Sales",
    icon: <FontAwesomeIcon icon={faUniversalAccess} />,
  },
  {
    path: "/coilstock",
    name: "Coil Stock Details",
    icon: <FontAwesomeIcon icon={faC} />,
  },
  {
    path: "/usermgmt",
    name: "User Mgmt.",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    path: "/extrareports",
    name: "Extra Reports",
    icon: <FontAwesomeIcon icon={faFileWaveform} />,
  },
  {
    path: "/logout",
    name: "Logout",
    icon: <FontAwesomeIcon icon={faBasketShopping} />,
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { isLogin } = useContext(AuthContext);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      {isLogin ? (
        <div className="main-container">
          <motion.div
            animate={{
              width: isOpen ? "200px" : "45px",

              transition: {
                duration: 0.3,
                type: "spring",
                damping: 10,
              },
            }}
            className={`sidebar `}
          >
            <div className="top_section">
              <AnimatePresence>
                {isOpen && (
                  <motion.h1
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="logo"
                  ></motion.h1>
                )}
              </AnimatePresence>
              {isOpen ? <img src={Logo} style={{ width: "62%" }} /> : ""}
              <div
                className="bars"
                style={{ fontSize: "22px", cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faBars} onClick={toggle} />
              </div>
            </div>

            <section className="routes">
              {routes.map((route, index) => {
                if (route.subRoutes) {
                  return (
                    <SidebarMenu
                      setIsOpen={setIsOpen}
                      route={route}
                      showAnimation={showAnimation}
                      isOpen={isOpen}
                    />
                  );
                }

                return (
                  <NavLink
                    to={route.path}
                    key={index}
                    className="link sidebar_Navlink"
                    activeClassName="active"
                  >
                    <div style={{ fontSize: "22px" }} onClick={toggle}>
                      {route.icon}
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="link_text"
                        >
                          {route.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </section>
          </motion.div>

          <main style={{ margin: "7px", width: "100%", overflow: "hidden" }}>
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default SideBar;
