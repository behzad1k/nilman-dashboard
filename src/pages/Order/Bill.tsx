import { useState } from 'react';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { popupSlice } from "../../services/reducers";
import { useDispatch } from "react-redux";
import restApi from '../../services/restApi';

const Bill = ({ order, workers }: any) =>{
  const dispatch: any = useDispatch();
  const [selectedWorker, setSelectedWorker] = useState({})
  const submit = async () => {
    if (!selectedWorker){
      Swal.fire({
        title: 'ناموفق',
        text: 'لطفا زیباکار را انتخاب کنید',
        icon: 'warning',
        confirmButtonText: 'متوجه شدم'
      })
      return
    }
    const res = await restApi(endpoints.order.assign + order.id).post({
      workerId: Number(selectedWorker),
    })

    if (res.code == 200){
      dispatch(popupSlice.hide());
      Swal.fire({
        title: 'موفق',
        text: 'سفارش با موفقیت محول شد',
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
  };

  return(
    <main className="billMain flex">
      <div className="billSec">
        <span className="billHeader">
          محول کردن
        </span>
        <span className="billDetSpan">
          <select className='selectBox width96 backGrey' defaultValue={order?.workerId} onChange={(e) => setSelectedWorker(e.target.value)}>
            <option value={null}>انتخاب کنید</option>
            {workers.map(e => <option value={e.id}>{e.name}</option>)}
          </select>
            <label>زیباکار </label>
    </span>
        <span className="billDetSpan" onClick={submit}>
          <button className="billButton">ثبت</button>
    </span>
      </div>
    </main>
  )
}
export default Bill