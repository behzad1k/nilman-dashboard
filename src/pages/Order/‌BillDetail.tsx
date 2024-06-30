import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { useAppSelector } from '../../services/store';
import tools from '../../utils/tools';
import LoadingBody from '../App/loading/LoadingBody';

const BillDetail = ({
                      id,
                      order,
                      status
                    }) => {
  const dispatch: any = useDispatch();
  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState<any>();
  const [percent, setPercent] = useState(status == 3 ? order?.payments[0]?.percent || 100 : 100 - order?.payments[0]?.percent);
  const [deliveryPrice, setDeliveryPrice] = useState(order?.delivery?.price ?? '');
  const [havale, setHavale] = useState(order?.payments[0]?.havale);
  const derhamPrice = useAppSelector(state => state.tickerReducer.euroPrice);

  const send = async () => {
    dispatch(setLoading(true));

    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/preBill/' + id, true).post({
      deliveryPrice: deliveryPrice,
      percent: percent,
      havale: havale
    });

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: 'فاکتور با موفقیت ایجاد شد',
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
  const fetchData = async () => {
    setIsloading(true);

    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/preBill/' + id, true).get();

    if (res.code == 200) {
      setData(res.data);
    }

    setIsloading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isloading) {
    return (
      <main className="billBody">
        <LoadingBody/>
      </main>
    );
  }
  return (
    <main className="billMain billSec">
    <span className="blueText billHeader">
      جزئیات صورتحساب
    </span>
      {/* <span className="billDetSpan"> */}
      {/*   <p>{data?.preProductPrice} </p> */}
      {/*   <p className="blueText">کالای پیش سفارش - {data?.preProduct} کالا</p> */}
      {/* </span> */}
      {/* <span className="billDetSpan"> */}
      {/*   <p>{data?.stockProductPrice} </p> */}
      {/*   <p className="blueText">کالای موجود - {data?.stockProduct} کالا</p> */}
      {/* </span> */}
      <span className="billDetSpan fontSize">
            <p>{Number(data?.stockProductPrice) + Number(data?.preProductPrice)} AED </p>
            <p className="blueText">مبلغ کل سفارش - {Number(data?.preProduct) + Number(data?.stockProduct)} کالا</p>
          </span>
      {
        status == 6 &&
          <span className="billDetSpan fontSize">
            <p>{tools.formatPrice((Number(data?.stockProductPrice) + Number(data?.preProductPrice)) / 100 * percent)} AED </p>
            <p className="blueText">مبلغ کل باقی مانده - {Number(data?.preProduct) + Number(data?.stockProduct)} کالا</p>
          </span>
      }

      <div className="billForm">
        <span className="billFormSpan">
      <input className="billInput" defaultValue={havale} onChange={(input) => setHavale(Number(input.target.value))}/>
      <p className="blueText">نرخ درهم حواله دبی به تومان</p>
    </span>
        <span className="billFormSpan">
      <input className="billInput" defaultValue={order?.delivery?.price ?? ''} onChange={(input) => setDeliveryPrice(Number(input.target.value))}/>
      <p className="blueText">هزینه ارسال (‌تومان)</p>
    </span>
        <span className="billFormSpan">
      <input className="billInput" defaultValue={percent} onChange={(input) => setPercent(Number(input.target.value))}/>
      <p className="blueText">{status == 3 ? 'درصد پیش پرداخت' : 'درصد باقی مانده'}</p>
    </span>
      </div>
      <span className="billFinalPrice">
      <p className="blueText">{status == 3 ? 'مبلغ پیش پرداخت به تومان' : 'مبلغ تسویه به تومان'}</p>
      <p>{tools.formatPrice(havale * ((percent / 100 * (Number(data?.stockProductPrice) + Number(data?.preProductPrice)))))} ({tools.formatPrice(percent / 100 * (Number(data?.stockProductPrice) + Number(data?.preProductPrice)))})</p>
    </span>
      <span className="billButtons">
      <button className="billButton dashboardHeader" onClick={send}>ارسال به مشتری برای پرداخت</button>
      <button className="billButton cancelButton" onClick={() => dispatch(popupSlice.hide())}>انصراف</button>
    </span>
    </main>
  );
};
export default BillDetail;