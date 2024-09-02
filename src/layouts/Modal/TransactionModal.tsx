// import mapImg from '../../../../public/img/map.jpg'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';

const TransactionModal = ({ userId }) => {
  const dispatch: any = useDispatch();
  const [transaction, setTransaction] = useState<any>({});
  const [image, setImage] = useState<any>({});
  const send = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.transaction.basic).post({
      date: transaction.date,
      code: transaction.code,
      amount: transaction.amount,
      description: transaction.description,
      userId: userId
    });

    const formData = new FormData()

    formData.append('file', image.data)

    await restApi(endpoints.transaction.medias + res.data?.id).upload(formData);

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `تایم مشغولی با موفقیت اضافه شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          window.location.reload()
        }
      });
    } else {
      Swal.fire({
        title: 'ناموفق',
        text: res?.data,
        icon: 'error',
        confirmButtonText: 'متوجه شدم'
      });
    }

    dispatch(setLoading(false));
  };

  return (
    <div className="modalContainer">
      <div className="rowSection">
        <h2>پرداختی جدید</h2>
        <i className="modalExit" onClick={() => dispatch(popupSlice.hide())}></i>
      </div>
      <div className="modalContent">
        <div className="modalForm workerOff">
          <div>
            <label htmlFor="title">مبلغ</label>
            <input type="text" id="title" name="title" value={transaction?.amount} onChange={(input: any) => setTransaction((prev: any) => ({ ...prev, amount: input.target.value }))}/>
          </div>
          <div>
            <label htmlFor="title">کد</label>
            <input type="text" id="title" name="title" value={transaction?.code} onChange={(input: any) => setTransaction((prev: any) => ({ ...prev, code: input.target.value }))}/>
          </div>
          <div>
            <label htmlFor="title">تاریخ</label>
            <input type="text" id="title" name="title" value={transaction?.date} onChange={(input: any) => setTransaction((prev: any) => ({ ...prev, date: input.target.value }))}/>
          </div>
          <div>
            <label htmlFor="title">توضیحات</label>
            <input type="text" id="title" name="title" value={transaction?.description} onChange={(input: any) => setTransaction((prev: any) => ({ ...prev, description: input.target.value }))}/>
          </div>
          <div>
            <label htmlFor="title">فایل ضمیمه</label>
            <input type="file" onChange={(input) => setImage({
              data: input.target.files[0],
              preview: URL.createObjectURL(input.target.files[0]),
            })}/>
            <img src={image.preview} alt="نمونه کار"/>
          </div>
        </div>
      </div>
      <div className="modalBtns">
        <span className="cancel clickable" onClick={() => dispatch(popupSlice.hide())}>بازگشت</span>
        <span className="submit clickable" onClick={send}>ثبت</span>
      </div>
    </div>
  );
};

export default TransactionModal;