import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { useAppSelector } from '../../services/store';
import tools from '../../utils/tools';
import LoadingBody from '../App/loading/LoadingBody';
import BillDetail from './\u200CBillDetail';

const Status = ({
                      order,
                      status
                    }) => {
  const dispatch: any = useDispatch();
  const [description, setDescription] = useState('');
  const derhamPrice = useAppSelector(state => state.tickerReducer.euroPrice);

  const send = async () => {
    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/status/' + order.id, true).put({
      status: status,
      description: description
    });
    dispatch(popupSlice.hide())
    if(res.code == 200){
      Swal.fire({
        title: 'موفق',
        text: 'وضعیت با موفقیت تغییر کرد',
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          (status == 3 || status == 6) && dispatch(popupSlice.middle(<BillDetail status={status} id={order.id} order={order}/>))
        }
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
  return (
    <main className="billMain billSec">
    <span className="blueText billHeader">
      در صورت نیاز میتوانید توضیحاتی برای این تغییر وضعیت وارد کنید
    </span>
      <textarea className="textArea" onChange={(input) => setDescription(input.target.value)}></textarea>
      <span className="billButtons">
      <button className="billButton dashboardHeader" onClick={send}>ثبت</button>
      <button className="billButton cancelButton" onClick={() => dispatch(popupSlice.hide())}>انصراف</button>
    </span>
    </main>
  );
};
export default Status;