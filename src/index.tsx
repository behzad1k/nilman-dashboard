import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './pages/App';
import { Loading } from './pages/App/loading';
import Popup from './pages/App/popup';
import Login from './pages/Login';
import Orders from './pages/Order';
import EditOrder from './pages/Order/EditOrder';
import Service from './pages/Service';
import ServiceManage from './pages/Service/Manage';
import AddUser from './pages/User/AddUser';
import EditUser from './pages/User/EditUser';
import UsersList from './pages/User/UsersList';
import reportWebVitals from './reportWebVitals';
import store from './services/store';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App/>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="order">
          <Route path="" element={<Orders/>}/>
          <Route path="edit/:id" element={<EditOrder/>}/>
        </Route>
        <Route path="service">
          <Route path="" element={<Service/>}/>
          <Route path="add" element={<ServiceManage/>}/>
          <Route path="edit/:id" element={<ServiceManage/>}/>
        </Route>
        <Route path="user">
          <Route path="" element={<UsersList/>}/>
          <Route path="add" element={<AddUser/>}/>
          <Route path="edit/:id" element={<EditUser/>}/>
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
