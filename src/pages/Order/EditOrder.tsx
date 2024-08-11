import moment from 'jalali-moment';
import { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { useAppSelector } from '../../services/store';
import tools from '../../utils/tools';
import { Sidebar } from '../../layouts/Sidebar';
import orderStatus = globalEnum.orderStatus;

const EditOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const serviceReducer = useAppSelector(state => state.serviceReducer.services);
  const [order, setOrder] = useState<any>();
  const [form, setForm] = useState<any>({});
  const navigate = useNavigate();

  const send = async () => {
    dispatch(setLoading(true));

    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/update/' + id, true).put({
      date: form.date,
      time: form.time,
      status: form.status,
    })

    if(res.code == 200){
      Swal.fire({
        title: 'موفق',
        text: 'سفارش با موفقیت ویرایش شد',
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
    dispatch(setLoading(false));
  };

  const list = () => {
    const rows: ReactElement[] = []
    order?.orderServices?.map((orderProduct: any, index) => {
      rows.push(
        <tr className="" key={'product' + index}>
          <td className="priceHolder backGround1">
            <p>{orderProduct.price}</p>
          </td>
          {/* <td className="priceHolder"> */}
          {/*   <input type="text" name={`prices[]`} className="noBorder textAlignCenter" defaultValue={orderProduct.price}/> */}
          {/* </td> */}
        {/*   <td className="quantity"> */}
        {/*   <div className="quantityButtom"> */}
        {/*     <i className="tablePlusIcon" onClick={(e: any) => { */}
        {/*       e.target.nextElementSibling.value = Number(e.target.nextElementSibling.value) + 1; */}
        {/*       e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].innerHTML = Number(e.target.nextElementSibling.value) * Number(e.target.parentElement.parentElement.previousElementSibling.children[0].value) */}
        {/*     }}></i> */}
        {/*     <input className="quantityNumber" defaultValue={orderProduct.count} name={`counts[]`} onChange={(e: any) => e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].innerHTML = Number(e.target.value) * Number(e.target.parentElement.parentElement.nextElementSibling.children[0].value)}/> */}
        {/*     <i className="tableCollapsIcon" onClick={(e: any) => { */}
        {/*       e.target.previousElementSibling.value = Number(e.target.previousElementSibling.value) - 1; */}
        {/*       e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].innerHTML = Number(e.target.previousElementSibling.value) * Number(e.target.parentElement.parentElement.previousElementSibling.children[0].value) */}
        {/*     }}></i> */}
        {/*   </div> */}
        {/* </td> */}
        {/*   <td className="skuContainer textAlignCenter">{orderProduct.service.title}</td> */}
          <td className="">
            <p className="font12 textAlignRight">{serviceReducer?.find(e => e.id == orderProduct?.service?.id)?.parent?.title + ' - ' + orderProduct.service?.title }</p>
            {/* <p>{orderProduct.product.category.title}</p> */}
          </td>
          {/* <td><img className="width100p" src={orderProduct.product.medias.find(e => e.code == 'main')?.url}/></td> */}
          <td>{++index}</td>
          <td>
            <i className="cancelSvg"></i>
            <input type="hidden" name="products[]" value={orderProduct.productId}/></td>
        </tr>
      )
    })

    return rows;
  };
  console.log(form);
  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.order.single + id, true).get();

    setForm({
      date: res.data?.date,
      time: res.data?.fromTime,
      status: res.data?.status,
    })
    setOrder(res.data)
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return(
    <>
      <body className="dashboardBody">
      <Sidebar/>

      <main className="dashBoardMain main">
        <div className="addInfoHeader">
          <button className="dashboardHeader keepRight" onClick={send}>
            <p>ویرایش سفارش</p>
          </button>
          <span>
            <h1 className="sideBarTitle"> بازگشت به صفحه لیست سفارش ها</h1>
             <h1 className="dashBoardTitle">ویرایش سفارش</h1>
          </span>
          <i className="backAdd" onClick={() => navigate('/order')}></i>
        </div>
        <section className="topRow">
          <div className="infoSection">
          <h1 className="dashBoardTitle">اطلاعات کاربر</h1>
          <div className="userInfoContainer">
          <label className="sideBarTitle">نام و خانوادگی</label>
            <input className="editProductInput" value={order?.user?.name}/>
            <label className="sideBarTitle">شماره تلفن</label>
            <input className="editProductInput" value={order?.user?.phoneNumber}/>
            <label className="sideBarTitle" >ایمیل</label>
            <input className="editProductInput" value={order?.user?.email}/>
          </div>
        </div>
          <div className="infoSection">
          <h1 className="dashBoardTitle">اطلاعات کاربر</h1>
          <div className="userInfoContainer">
          <label className="sideBarTitle">وضغیت سفارش</label>
            <Select name='status' value={{
              value: Object.keys(orderStatus).find(e => e == form?.status),
              label: orderStatus[Object.keys(orderStatus).find(e => e == form?.status)]
            }} options={Object.entries(orderStatus).map(([key, value]) => ({value: key, label: value}))} className="dashCardLog" id="infoTitle" onChange={(selected) => setForm(prev => ({ ...prev, status: selected.value }))}/>
            <label className="sideBarTitle">تاریخ</label>
            <input className="editProductInput" value={form?.date} onChange={(input) => setForm(prev => ({ ...prev, date: input.target.value}))}/>
            <label className="sideBarTitle" >ساعت</label>
            <input className="editProductInput" value={form?.time} onChange={(input) => setForm(prev => ({ ...prev, time: input.target.value}))}/>
          </div>
        </div>
          <div className="infoSection">
            <h1 className="dashBoardTitle">آدرس</h1>
            <div className="userInfoContainer">
              <label className="sideBarTitle">ارسال به</label>
              <select className="selector width">
                <option>آدرس ۱</option>
              </select>
             <h6 className="sideBarTitle">جزئیات آدرس ۱</h6>
              <p className="catAdresses">
                {`${order?.address?.description}`}
                <br/>
                {`${order?.address?.pelak} پلاک `}
                <br/>
                {`${order?.address?.vahed} واحد `}
              <br/>
                {`${order?.address?.postalCode} کدپستی `}
              <br/>
                {`${order?.address?.phoneNumber} تلفن `}
              </p>
            </div>
          </div>
          <div className="infoSection">
            <h1 className="dashBoardTitle">مجموع فاکتور</h1>
            <div className="userInfoContainer">
             <span className="factorHeader">
               <p>{moment(order?.createdAt).format('jYYYY/jMM/jDD')}</p>
             </span>
              <span className="billItems dashboardBill">
              <h3 className="billItem">هزینه ارسال</h3>
              <div className="pricePart">
                <h1 className="billPrice">{tools.formatPrice(order?.transportation)}</h1>
              </div>
            </span>
              <span className="billItems dashboardBill">
              <h3 className="billItem">تخفیف</h3>
              <div className="pricePart">
                <h1 className="billPrice">{tools.formatPrice(order?.discountPrice || 0)}</h1>
              </div>
            </span>
            {/*   <span className="billItems dashboardBill"> */}
            {/*   <h3 className="billItem">مالیات</h3> */}
            {/*   <div className="pricePart"> */}
            {/*     <h1 className="billPrice">3%</h1> */}
            {/*   </div> */}
            {/* </span> */}
              <hr className="dashedBill"/>
              <span className="billItems dashboardBill">
              <h3 className="billItem">مبلغ قابل پرداخت</h3>
              <div className="pricePart">
                <h1 className="tablePrice1">{tools.formatPrice(order?.price)}</h1>
              </div>
            </span>
            </div>
          </div>
        </section>
        {/* <section className="bottom"> */}
        {/*   <h6 className="dashBoardTitle">وضعیت ها</h6> */}
        {/*   <table className="productTable"> */}
        {/*     <thead className="editOrderTable"> */}
        {/*     <th className="sideBarTitle center" >توضیحات</th> */}
        {/*     <th className="sideBarTitle center" >تاریخ</th> */}
        {/*     <th className="sideBarTitle center" >وضعیت</th> */}
        {/*     </thead> */}
        {/*     <tbody> */}
        {/*     {statusList()} */}
        {/*     </tbody> */}
        {/*     /!* <tr className="addProductTr"> *!/ */}
        {/*     /!*   <td className="addProductButton">اضافه کردن محصول</td> *!/ */}
        {/*     /!* </tr> *!/ */}
        {/*   </table> */}
        {/* </section> */}
        <section className="bottom width100">
        <h6 className="dashBoardTitle">خدمات</h6>
          <table className="productTable">
          <thead className="editOrderTable">
            <th className="sideBarTitle center" >قیمت کل</th>
            <th className="sideBarTitle center" >خدمت</th>
            <th className="sideBarTitle center" >ردیف</th>
            <th className="sideBarTitle center" ></th>
          </thead>
            <tbody>
            {list()}
            </tbody>
            {/* <tr className="addProductTr"> */}
            {/*   <td className="addProductButton">اضافه کردن محصول</td> */}
            {/* </tr> */}
          </table>
        </section>
      </main>
      </body>
    </>
  )
}
export default EditOrder