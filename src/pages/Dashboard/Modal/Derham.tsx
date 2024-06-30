import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { popupSlice } from '../../../services/reducers';
import { setLoading } from '../../../services/reducers/homeSlice';
import restApi from '../../../services/restApi';
import { useAppSelector } from '../../../services/store';

const Derham = () =>{
  const dispatch: any  = useDispatch();
  const ticker = useAppSelector(state => state.tickerReducer.euroPrice);
  const [value, setValue] = useState(ticker);
  console.log(ticker);
  const send = async () => {
    dispatch(setLoading(true));

    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/setting/derhamPrice', true).put({
      value: value
    });

    if(res.code == 200){
      Swal.fire({
        title: 'موفق',
        text: 'نرخ درهم با موفقیت بروزرسانی شد',
        icon: 'success',
        confirmButtonText: 'متوجه شدم'
      })
    } else {
      Swal.fire({
        title: 'ناموفق',
        text: res?.data,
        icon: 'error',
        confirmButtonText: 'متوجه شدم'
      })
    }

    dispatch(setLoading(false));
  };
  return(
    <main className="derhamMain">
      <span className="derhamHeader">
        <i className="coinSvg"></i>
        <p className="blueText">قیمت روز درهم</p>
      </span>
      <input placeholder={ticker.toString()} className="derhamInput" onChange={(input) => setValue(Number(input.target.value))}/>
      <span className="derhamButtons">
         <button className="cancelDerham" onClick={() => dispatch(popupSlice.hide())}>انصراف</button>
        <button className="dashboardHeader clickable" onClick={send}>ثبت</button>
      </span>
    </main>
  )
}
export default Derham