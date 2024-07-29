// import mapImg from '../../../../public/img/map.jpg'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';

const WorkerOffModal = ({ userId }) => {
  const dispatch: any = useDispatch();
  const [workerOff, setWorkerOff] = useState<any>({});
  const send = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.user.workerOff + userId).post({
      date: workerOff.date,
      fromTime: workerOff.fromTime,
      toTime: workerOff.toTime,
    });

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `تایم مشغولی با موفقیت اضافه شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          dispatch(popupSlice.hide());
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
        <h2>افزودن تایم مشغولی</h2>
        <i className="modalExit" onClick={() => dispatch(popupSlice.hide())}></i>
      </div>
      <div className="modalContent">
        <div className="modalForm workerOff">
          <div>
            <label htmlFor="title">از ساعت</label>
            <input type="text" id="title" name="title" value={workerOff?.formTime} onChange={(input: any) => setWorkerOff((prev: any) => ({ ...prev, fromTime: input.target.value }))}/>
          </div>
          <div>
            <label htmlFor="title">تا ساعت</label>
            <input type="text" id="title" name="title" value={workerOff?.toTime} onChange={(input: any) => setWorkerOff((prev: any) => ({ ...prev, toTime: input.target.value }))}/>
          </div>
          <div>
            <label htmlFor="title">تاریخ</label>
            <input type="text" id="title" name="title" value={workerOff?.date} onChange={(input: any) => setWorkerOff((prev: any) => ({ ...prev, date: input.target.value }))}/>
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

export default WorkerOffModal;