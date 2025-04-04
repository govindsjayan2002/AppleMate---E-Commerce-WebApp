import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home_page/Home';
import Products from './pages/Products_page/Products';
import About from './pages/About_page/About';
import Signup from './pages/SignUp_page/SignupPg';
import Login from './pages/Login_page/LoginPg';
import Staff from './pages/Staff_page/Staff';
import Retail_main from './pages/Retail_page/default/RetailMain';
import RtCart from './pages/Retail_page/cart/RtCart';
import RtReg from './pages/SignUp_page/RtReg';
import RtProfile from './pages/Retail_page/profile/RtProfile';
import ChangePwd from './pages/Retail_page/changepwd/ChangePwd';
import RtOrders from './pages/Retail_page/orders/RtOrders';
import { FormDataContextProvider } from './pages/SignUp_page/FormDataContext';
import Registration from './pages/SignUp_page/retail/Registration';
import RetailMain from './pages/Retail_page/default/RetailMain';
import { AuthProvider } from './AuthenticationContext';
import Checkout from './pages/Payment/Checkout';
import WsProfile from './pages/Wholesale_page/profile/WsProfile';
import WsCart from './pages/Wholesale_page/cart/WsCart';
import PaymentComponent from './components/PaymentComponent';



const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
    <FormDataContextProvider>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/about_us' element={<About/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/logIn' element={<Login/>}/>
        <Route path='/staff' element={<Staff/>}/>
        <Route path='/retail_seller' element={<Retail_main/>}/>
        <Route path='/rtcart' element={<RtCart/>}/>
        <Route path='/orders' element={<RtOrders/>}/>
        <Route path='/profile' element={<ProtectedRoute><RtProfile/></ProtectedRoute>}/>
        <Route path='/change-password' element={<ChangePwd/>}/>
        <Route path='/retail_signup' element={<Registration/>}/>
        <Route path='/dashboard' element={<RetailMain/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/Ws_profile' element={<WsProfile/>}/>
        <Route path='/WsCart' element={<WsCart/>}/>

      </Routes>
    </Router>
    <div className="App">
            {/* <PaymentComponent /> */}
        </div>
    </FormDataContextProvider>
    </AuthProvider>
  );
}
 