// import mapImg from '../../../../public/img/map.jpg'
import moment from 'jalali-moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import tools from '../../utils/tools';

const TransactionModal = ({ userId, orders }) => {
  const dispatch: any = useDispatch();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [transaction, setTransaction] = useState<any>({
    date: moment().format('jYYYY/jMM/jDD')
  });
  const [image, setImage] = useState<any>({});
  const send = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.transaction.basic).post({
      date: transaction.date,
      code: transaction.code,
      amount: transaction.amount,
      description: transaction.description,
      userId: userId,
      orders: selectedOrders
    });
    if (image.data) {
      const formData = new FormData();

      formData.append('file', image.data);

      await restApi(endpoints.transaction.medias + res.data?.id).upload(formData);
    }
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

  const list = () => {
    return orders.map((order, index) =>
      <tr>
        <td>{tools.formatPrice((order.price * order.workerPercent / 100) + 100000)}</td>
        <td>{tools.formatPrice(order.finalPrice)}</td>
        <td><a href={`/order/edit/${order.id}`} target='_blank'>{order.code}</a></td>
        <td>{++index}</td>
        <td><input type='checkbox' checked={selectedOrders.includes(order.id)} onChange={(e) => setSelectedOrders(prev => prev.includes(order.id) ? prev.filter(e => e != order.id) : [...prev, order.id])}/></td>
      </tr>
    )
  };

  useEffect(() => {
    setTransaction(prev => ({ ...prev, amount: orders.filter(e => selectedOrders.includes(e.id)).reduce((acc, order) => acc + (order.price * order.workerPercent / 100) + 100000,0)}))
  }, [selectedOrders]);

  return (
    <div className="modalContainer">
      <div className="rowSection">
        <h2>پرداختی جدید</h2>
        <i className="modalExit" onClick={() => dispatch(popupSlice.hide())}></i>
      </div>
      <div>
        <table>
          <thead>
          <tr>
            <th>سهم استایلیست</th>
            <th>مبلغ کل</th>
            <th>کد</th>
            <th>ردیف</th>
            <th><input type='checkbox' checked={selectedOrders?.length == orders?.length} onChange={(e) => setSelectedOrders(prev => prev?.length == orders?.length ? [] : orders?.map(e => e.id))} /></th>
          </tr>
          </thead>
          <tbody>
          {list()}
          </tbody>
        </table>
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
            <img className='attachmentImage' src={image.preview} alt="فیش"/>
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