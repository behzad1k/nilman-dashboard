import moment from 'jalali-moment';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useTicker from '../../hooks/useTicker';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { useAppSelector } from '../../services/store';
import tools from '../../utils/tools';

const PayDetail = ({ order }: any) => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const [code, setCode] = useState('');
  const [date, setDate] = useState(moment().format('jYYYY/jMM/jDD'));
  const [bank, setBank] = useState('');
  const type = order.status == 3 ? 'pre' : 'full';
  const payment = order.payments?.find((e) => e.isPre == (type == 'pre'))

  const send = async () => {
    dispatch(setLoading(true));
    dispatch(popupSlice.hide());

    const res = await restApi(process.env.REACT_APP_BASE_URL + '/order/bill/' + order.id, true).post({
      bank: bank,
      code: code,
      date: date,
    })

    if (res.code == 200){
      Swal.fire({
        title: 'موفق',
        text: 'اطلاعات شما با موفقیت ثبت شد',
        icon: 'success',
        confirmButtonText: 'متوجه شدم'
      })
    } else {
      Swal.fire({
        title: 'ناموفق',
        text: 'مشکلی پیش آمده لطفا دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
        icon: 'error',
        confirmButtonText: 'متوجه شدم'
      })
    }

    dispatch(setLoading(false));
  };

  return(
    <main className="payDetailMain">
      <div className="leftPay">
        <img className="cardImg" src='/img/card.jpg'/>
        <div className="inputHolder">
          <div className="input">
            <label>شماره پیگیری</label>
            <input placeholder="00000000" onChange={(input: any) => setCode(input.target.value)}/>
            </div>
            <div className="input">
            <label>تاریخ واریز</label>
            <input placeholder="0000/00/00" onChange={(input: any) => setDate(input.target.value)}/>
          </div>
        </div>
        <div className="inputHolder">
          {/* <div className="input"> */}
          {/* <label>بارگزاری فیش واریزی (اختیاری) </label> */}
          {/* <div className="uploadPhoto"> */}
          {/* <i className="uploadSvg1"></i> */}
          {/*   <p>فایل خود را بارگزاری کنید</p> */}
          {/* </div> */}
          {/* </div> */}
          <div className="input">
          <label>بانک مبدا</label>
          <input placeholder="تجارت" onChange={(input: any) => setBank(input.target.value)} />
          </div>
        </div>
        <div className="inputHolder">
          <button className="pay clickable" onClick={send}>ثبت فیش واریزی</button>
          <button className="notPay clickable" onClick={() => dispatch(popupSlice.hide())}>هنوز پرداخت نکرده ام</button>
        </div>
      </div>
      <div className="leftPay borderZero">
        <span className="payHeader">جزئیات صورتحساب</span>
      <div className="payDetail">
        <h6>{tools.formatPrice(order?.price)} </h6>
        <h5>مبلغ کل سفارش به درهم (AED)</h5>
      </div>
      <div className="payDetail">
        <h6>{tools.formatPrice(payment?.price)} </h6>
        <h5>مبلغ قابل پرداخت در این مرحله به درهم (AED)</h5>
      </div>
        {type == 'pre' &&
          <div className="payDetail">
            <h6>{tools.formatPrice(order?.price - order.payments.reduce((acc, curr) => acc + (curr.isPaid || curr.id == payment.id) ? curr.price : 0, 0))} </h6>
            <h5>مبلغ باقیمانده به درهم</h5>
          </div>
        }
      <div className="payDetail">
        <h6>{tools.formatPrice(payment?.havale)} </h6>
        <h5>نرخ کنونی درهم حواله دبی به تومان</h5>
      </div>
      <div className="payDetail">
        <h6>{tools.formatPrice(order?.delivery?.price)} </h6>
        <h5>هزینه ارسال</h5>
      </div>
        {type != 'pre' &&
            <div className="payDetail">
                <h6>{tools.formatPrice(order?.price - payment?.price)} </h6>
                <h5>مبلغ پرداخت شده به درهم</h5>
            </div>
        }
        <div className="timeDetail">
            <div className="input">
              <p>
              {type == 'pre' ? "مبلغ پیش پرداخت" : "مبلغ باقی مانده"}
              </p>
              <p className="price">{`${tools.formatPrice(payment?.price)} (${tools.formatPrice(payment?.price * payment?.havale)}   تومان)`}</p>
            </div>
          {/* <div className="input"> */}
          {/*   <p>زمان باقیمانده پرداخت</p> */}
          {/*   <p className="time">23:34:09</p> */}
          {/* </div> */}
        </div>
      </div>
    </main>
  )
}
export default PayDetail