import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import LoadingSpinner from '../../layouts/LoadingSpinner/insdex';
import { popupSlice } from "../../services/reducers";
import { useDispatch } from "react-redux";
import restApi from '../../services/restApi';
import LoadingBody from '../App/loading/LoadingBody';

const Message = ({ user }: any) => {
  const dispatch: any = useDispatch();
  const [text, setText] = useState('');
  const submit = async () => {
    if (!text){
      Swal.fire({
        title: 'ناموفق',
        text: 'لطفا متن پیام را پر کنید',
        icon: 'warning',
        confirmButtonText: 'متوجه شدم'
      })
      return
    }
    const res = await restApi(endpoints.user.textMessage + user.id).post({
      text: text
    })

    if (res.code == 200){
      dispatch(popupSlice.hide());
      Swal.fire({
        title: 'موفق',
        text: 'پیام با موفقیت ارسال شد',
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
        <span className="billHeader">پیام به {user.name + ' ' + user.lastName} به شماره {user.phoneNumber}</span>
        <textarea rows={10} onChange={(input) => setText(input.target.value)}>{text}</textarea>
        <div>

          <span className="billDetSpan" onClick={submit}>
          <button className="billButton">ثبت</button>
    </span>
          <span className="billDetSpan" onClick={submit}>
          <button className="billButton">لفو</button>
    </span>
        </div>

      </div>
    </main>
  )
}
export default Message