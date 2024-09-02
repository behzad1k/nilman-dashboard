import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Accounting from './pages/Accounting';
import AccountingManage from './pages/Accounting/Manage';
import App from './pages/App';
import { Loading } from './pages/App/loading';
import Popup from './pages/App/popup';
import Color from './pages/Color';
import ColorManage from './pages/Color/Manage';
import Dashboard from './pages/Dashboard';
import Discount from './pages/Discount';
import DiscountManage from './pages/Discount/Manage';
import FeedbackFactor from './pages/FeedbackFactor';
import FeedbackFactorManage from './pages/FeedbackFactor/Manage';
import Login from './pages/Login';
import Orders from './pages/Order';
import OrderManage from './pages/Order/OrderManage';
import Service from './pages/Service';
import ServiceManage from './pages/Service/Manage';
import UsersList from './pages/User';
import UserManage from './pages/User/UserManage';
import reportWebVitals from './reportWebVitals';
import store from './services/store';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App/>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="login" element={<Login />} />
        <Route path="order">
          <Route path="" element={<Orders/>}/>
          <Route path="edit/:id" element={<OrderManage/>}/>
          <Route path="add" element={<OrderManage/>}/>
        </Route>
        <Route path="service">
          <Route path="" element={<Service/>}/>
          <Route path="add" element={<ServiceManage/>}/>
          <Route path="edit/:id" element={<ServiceManage/>}/>
        </Route>
        <Route path="feedbackFactor">
          <Route path="" element={<FeedbackFactor/>}/>
          <Route path="add" element={<FeedbackFactorManage/>}/>
          <Route path="edit/:id" element={<FeedbackFactorManage/>}/>
        </Route>
        <Route path="color">
          <Route path="" element={<Color/>}/>
          <Route path="add" element={<ColorManage/>}/>
          <Route path="edit/:id" element={<ColorManage/>}/>
        </Route>
        <Route path="user">
          <Route path="" element={<UsersList/>}/>
          <Route path="add" element={<UserManage/>}/>
          <Route path="edit/:id" element={<UserManage/>}/>
        </Route>
        <Route path="discount">
          <Route path="" element={<Discount/>}/>
          <Route path="add" element={<DiscountManage/>}/>
          <Route path="edit/:id" element={<DiscountManage/>}/>
        </Route>
        <Route path="accounting">
          <Route path="" element={<Accounting/>}/>
          <Route path="add" element={<AccountingManage/>}/>
          <Route path="edit/:id" element={<AccountingManage/>}/>
        </Route>
      </Routes>
      <Popup/>
      <Loading/>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your App, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
