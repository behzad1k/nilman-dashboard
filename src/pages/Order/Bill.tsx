import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import LoadingSpinner from '../../layouts/LoadingSpinner/insdex';
import { popupSlice } from "../../services/reducers";
import { useDispatch } from "react-redux";
import restApi from '../../services/restApi';
import LoadingBody from '../App/loading/LoadingBody';

const Bill = ({ order }) => {
  const dispatch: any = useDispatch();
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null)
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

  const fetchData = async () => {
    setIsLoading(true)
    const res = await restApi(endpoints.order.relatedWorkers + order.id).get();

    setWorkers(res.data)

    setIsLoading(false)
  };
  console.log(selectedWorker);
  useEffect(() => {
    fetchData()
  }, []);

  return(
    <main className="billMain flex">
      <div className="billSec">
        <span className="billHeader">
          محول کردن
        </span>
        <span className="billDetSpan">
          {isLoading ? <LoadingSpinner/> : <>
            <select className='selectBox width96 backGrey' defaultValue={order?.workerId} onChange={(e) => setSelectedWorker(e.target.value)}>
              <option value={null}>انتخاب کنید</option>
              {workers.map(e => <option value={e.id}>{e.name + ' ' + e.lastName}</option>)}
            </select>
          </>}
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