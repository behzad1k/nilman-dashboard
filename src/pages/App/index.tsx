import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import '../../App.css';
import { useDispatch } from 'react-redux';
import '../../Dashboard.css';
import { setLoading, statuses } from '../../services/reducers/homeSlice';
import { services } from '../../services/reducers/serviceSlice';
import { euroPrice } from '../../services/reducers/tickerSlice';
import { address, cart, favorites, fetchProfile, orders, profile } from '../../services/reducers/userSlice';
import restApi from '../../services/restApi';
import { useAppSelector } from '../../services/store';

function App() {
  const dispatch: any = useDispatch();

  const initialize = async () => {
    if(!Cookies.get('adminToken') && !window.location.href.includes('login')){
      window.location.href = '/login';
    }
    else{
      dispatch(setLoading(true));

      const res = await restApi(process.env.REACT_APP_BASE_URL + '/user', true).get();

      if (res.code == 200){
        if (res.data.role !== "SUPER_ADMIN" && window.location.href.includes('dashboard')){
          window.location.href = '/' ;
        }
      }else if(res.code == 401){
        Cookies.remove('adminToken')
      }

      dispatch(profile(res.data));
      dispatch(services());
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <></>
  );
}

export default App;
