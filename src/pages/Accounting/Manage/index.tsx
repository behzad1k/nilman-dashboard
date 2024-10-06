import moment from 'jalali-moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DatePicker } from 'zaman';
import endpoints from '../../../config/endpoints';
import globalEnum from '../../../enums/globalEnum';
import TransactionModal from '../../../layouts/Modal/TransactionModal';
import WorkerOffModal from '../../../layouts/Modal/WorkerOffModal';
import { Sidebar } from '../../../layouts/Sidebar';
import { popupSlice } from '../../../services/reducers';
import { setLoading } from '../../../services/reducers/homeSlice';
import restApi from '../../../services/restApi';
import tools from '../../../utils/tools';
import orderStatus = globalEnum.orderStatus;

const AccountingManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState<any>();
  const [salesInRange, setSalesInRange] = useState(0);
  const [dateRange, setDateRange] = useState({
    from: moment().startOf('jMonth').format('jYYYY/jMM/jDD'),
    to: moment().format('jYYYY/jMM/jDD')
  });
  const { id: paramId } = useParams();

  const submit = async () => {
    dispatch(setLoading(true));

    const data: any = tools.extractor(form, ['title', 'code', 'description']);

    const res = await restApi(endpoints.color.basic + (paramId || '')).post(data);

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `رنگ با موفقیت ${paramId ? 'ویرایش' : 'اضافه'} شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          navigate('/color/');
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

  const orderList = () => {
    return form?.orders.filter(e => e.status == orderStatus.Done).slice(0, 30)?.map((order, index) =>
      <tr>
        <td>{order.transactionId > 0 ? 'بله' : 'خیر'}</td>
        <td>{tools.formatPrice((order.price * order.workerPercent / 100) + 100000)}</td>
        <td>{order.workerPercent}</td>
        <td>{tools.formatPrice(order.finalPrice)}</td>
        <td><a href={`/order/edit/${order.id}`} target='_blank'>{order.code}</a></td>
        <td>{++index}</td>
      </tr>
    )
  };


  const transactionList = () => {
    return form?.transactions?.map((transaction, index) =>
      <tr>
        <td><img className='tableImg' src={transaction.media?.url}/></td>
        <td>{transaction.description}</td>
        <td>{transaction.date}</td>
        <td>{transaction.code}</td>
        <td>{tools.formatPrice(transaction.amount)}</td>
        <td>{++index}</td>
      </tr>
    )
  };

  const fetchSales = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.dashboard.sales).get({
        from: dateRange.from,
        to: dateRange.to,
        worker: paramId
      })

    if(res.code == 200){
      setSalesInRange(res.data?.salary)
    }
    dispatch(setLoading(false));
  };
  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await Promise.all([
      restApi(endpoints.user.single + paramId).get(),
    ]);

    setForm({
      name: res[0].data?.name + ' ' + res[0].data?.lastName,
      walletBalance: res[0].data?.walletBalance,
      cardNumber: res[0].data?.cardNumber,
      heasbNumber: res[0].data?.heasbNumber,
      shebaNumber: res[0].data?.shebaNumber,
      bankName: res[0].data?.bankName,
      transactions: res[0].data?.transactions,
      orders: res[0].data?.jobs
    });

    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
    fetchSales();
  }, []);

  return (
    <>
      <main className="dashboardBody">
        <Sidebar/>
        <div className="dashBoardMain main">
          <div className="addInfoHeader">
            <div className="buttonContainer keepRight">
              <button className="dashboardHeader keepRight" onClick={() => submit()}>
                <p>ثبت</p>
              </button>
            </div>
            <span>
          <h1 className="sideBarTitle">بازگشت به صفحه حسابداری</h1>
           <h1 className="dashBoardTitle">اطلاعات مالی {form?.name}</h1>
        </span>
            <i className="backAdd" onClick={() => navigate(-1)}></i>
          </div>
          <section className="userInfo">
            <h6 className="dashBoardTitle">اطلاعات بانکی</h6>
            <div className="userInfoContainer width96">
              <div className="section48">
                <label className="sideBarTitle">شماره کارت</label>
                <input className="editProductInput" disabled defaultValue={form?.cardNumber} name="cardNumber"/>
                <label className="sideBarTitle">شماره حساب</label>
                <input className="editProductInput" disabled defaultValue={form?.hesabNumber} name="hesabNumber"/>
              </div>
              <div className="section48">
                <label className="sideBarTitle">شماره شبا</label>
                <input className="editProductInput" disabled defaultValue={form?.shebaNumber} name="shebaNumber"/>
                <label className="sideBarTitle">نام بانک</label>
                <input className="editProductInput" disabled defaultValue={form?.bankName} name="bankName"/>
              </div>
            </div>
          </section>
          <section className="bottom">

            <h6 className="dashBoardTitle">کارکرد کاربر</h6>
            <div className='rowGap10'>
              <span className="dashboardHeader keepRight clickable" onClick={fetchSales} >
              جستجو
            </span>
              <DatePicker inputClass="editProductInput" defaultValue={moment(dateRange?.to, 'jYYYY/jMM/jDD').toDate()} onChange={(e) => setDateRange(prev => ({ ...prev, to: moment(e.value.valueOf()).format('jYYYY/jMM/jDD') }))} />
              <label className="sideBarTitle">تا</label>
              <DatePicker inputClass="editProductInput" defaultValue={moment(dateRange?.from, 'jYYYY/jMM/jDD').toDate()} onChange={(e) => setDateRange(prev => ({ ...prev, from: moment(e.value.valueOf()).format('jYYYY/jMM/jDD') }))} />
              <label className="sideBarTitle">از</label>

            </div>
            <div>
              کارکرد در بازه مشخص شده: {tools.formatPrice(salesInRange)}
            </div>
            <div>
              طلب زیباکار: {tools.formatPrice(form?.walletBalance + form?.orders?.filter(e => !e.transactionId && e.status == orderStatus.Done).reduce((acc, curr) => acc + (curr.price * curr.workerPercent / 100) + 100000, 0))}
            </div>
            <div>
              سود زیباکار برای مجموعه: {tools.formatPrice(form?.orders.filter(e => e.status == orderStatus.Done)?.reduce((acc, curr) => acc + (curr.finalPrice - (curr.price * curr.workerPercent / 100) - 100000), 0))}
            </div>

          </section>
          <section className="bottom">
            <h6 className="dashBoardTitle">پرداخت ها</h6>
            <span className="dashboardHeader keepRight clickable" onClick={() => dispatch(popupSlice.middle(<TransactionModal userId={paramId} orders={form.orders.filter(e => e.status == orderStatus.Done && !e.transactionId)} />))} >
              افزودن
            </span>
            <table>
              <thead>
              <tr>
                <th>فایل ضمیمه</th>
                <th>توضیحات</th>
                <th>تاریخ</th>
                <th>کد رهگیری</th>
                <th>مبلغ</th>
                <th>ردیف</th>
              </tr>
              </thead>
              <tbody>
              {transactionList()}
              </tbody>
            </table>
          </section>
          <section className="bottom">
            <h6 className="dashBoardTitle">۳۰ سفارش اخیر</h6>
            <table>
              <thead>
              <tr>
                <th>تسویه شده</th>
                <th>سهم استایلیست</th>
                <th>درصد استایلیست</th>
                <th>مبلغ کل</th>
                <th>کد</th>
                <th>ردیف</th>
              </tr>
              </thead>
              <tbody>
              {orderList()}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  );
};
export default AccountingManage;