import React, { useState, useEffect } from "react";
// import firebase from 'firebase';
// import jwt_decode from "jwt-decode";
import api from "../../api";

const AuthContext = React.createContext({});
const AuthConsumer = AuthContext.Consumer;
const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  // const [isProfileImg, setIsProfileImg] = useState(false);
  // const [profile, setProfile] = useState({
  //     name: "",
  //     phone: "",
  //     email: "",
  //     profileImage: "",
  //     socialToken: ""
  // });

  const loginSuccess = (token, user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(token));
    // if (profToken) {
    //     var decoded = jwt_decode(profToken);
    //     setProfile({ ...profile, profileImage: decoded.picture })
    //     localStorage.setItem('Profiletoken', profToken);
    //     setIsProfileImg(true);
    // }
    setIsLogin(true);
  };

  // const settingProfile = (data, profUrl) => {
  //     console.log("data context", data)
  //     setProfile({ ...profile, firstName: data.firstName, lastName: data.lastName, email: data.email, gender: data.gender, city: data.city, area: data.area, country: data.country })

  // }
  // const checkProfileUrl = async () => {
  //     const token = localStorage.getItem('Profiletoken');
  //     if (token) {
  //         var decoded = jwt_decode(token);
  //         setProfile({ firstName: decoded.name, profileImage: decoded.picture })
  //         setIsProfileImg(true);
  //         console.log("decoded", decoded);
  //     } else {
  //         try {
  //             const token2 = localStorage.getItem('token');
  //             var decoded2 = jwt_decode(token2);
  //             console.log('decoded2', decoded2);

  //             const res = await api.get(`/users/${decoded2.id}`);
  //             const { photo, name, email, phone } = res.data.doc
  //             console.log(photo);
  //             // history.push("/")
  //             setProfile({ name: name, email: email, phone: phone });

  //             if (photo !== 'default.png') {
  //                 setIsProfileImg(true);
  //                 setProfile({ profileImage: photo });
  //             }
  //             console.log(res);
  //         }
  //         catch (err) {
  //             console.log(err);
  //         }
  //     }
  // }
  const signOut = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem('Profiletoken');
    // firebase.auth().signOut();
    setIsLogin(false);
    // setIsProfileImg(false);
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }
  };
  useEffect(() => {
    checkToken();
    // checkProfileUrl();
  }, []);

  return (
    // <AuthContext.Provider
    // value={{ is, profile, isProfileImg, setIsProfileImg, setProfile, Success, settingProfile, signOut }}>
    <AuthContext.Provider value={{ isLogin, loginSuccess, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthConsumer, AuthProvider };
