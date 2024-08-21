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

const OrderManage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const serviceReducer = useAppSelector(state => state.serviceReducer);
  const [form, setForm] = useState<any>({ orderServices: [], transportation: 0, finalPrice: 0, discountAmount: 0, serviceId: null});
  const navigate = useNavigate();
  const send = async () => {
    // dispatch(setLoading(true));
    let addressRes, userRes
    if (!id){
      if (!form.user?.isVerified) {
        const verifyNationalCode = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user/verify').post({
          phoneNumber: form.user.phoneNumber,
          nationalCode: form.user.nationalCode
        });
        if (verifyNationalCode.code == 1005 && !confirm('کد ملی با شماره تلفن تطابق ندارد آیا به هرحال سفارش ثبت شود؟')){
          dispatch(setLoading(false));
          return;
        }
      }

      userRes = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user/basic/' + (form?.user?.id || '') ).post({
        name: form.user.name,
        lastName: form.user.lastName,
        nationalCode: form.user.nationalCode,
        phoneNumber: form.user.phoneNumber,
      })

      addressRes = await restApi(process.env.REACT_APP_BASE_URL + '/admin/address/basic/' + (form?.address?.id || '')).post({
        title: form.address.title,
        phoneNumber: form.address.phoneNumber,
        description: form.address.description,
        vahed: form.address.vahed,
        pelak: form.address.pelak,
        userId: userRes.data?.id
      })
    }
    console.log(form.address.id || addressRes.data.id);
    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/basic/' + (id || ''), true).post({
      date: form.date,
      time: form.time,
      status: form.status,
      finalPrice: form.finalPrice,
      price: form.price,
      serviceId: form.serviceId,
      discountAmount: form.discountAmount,
      transportation: form.transportation,
      addressId: form.address.id || addressRes.data.id,
      userId: form.user.id || userRes.data.id
    })

    await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/products/' + res.data.id).put({
      services: form.orderServices.map(e => ({
        serviceId: e.serviceId,
      }))
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
    form?.orderServices?.map((orderProduct: any, index) => {
      const key = form.orderServices?.findIndex(e => e.serviceId == orderProduct.serviceId)

      rows.push(
        <tr className="" key={'product' + index}>
          <td className="backGround1">
            <p>{tools.formatPrice(orderProduct.price || serviceReducer.services?.find(e => e.id == orderProduct.serviceId)?.price)}</p>
          </td>
          <td className="quantity">
          <div className="quantityButtom">
            <i className="tablePlusIcon" onClick={(e: any) => {
              e.target.nextElementSibling.value = Number(e.target.nextElementSibling.value) + 1;
              // e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].innerHTML = Number(e.target.nextElementSibling.value) * Number(e.target.parentElement.parentElement.previousElementSibling.children[0].value)
            }}></i>
            <input className="quantityNumber" defaultValue={1}
                   // onChange={(e: any) => e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].innerHTML = Number(e.target.value) * Number(e.target.parentElement.parentElement.nextElementSibling.children[0].value)}
            />
            <i className="tableCollapsIcon" onClick={(e: any) => {
              e.target.previousElementSibling.value = Number(e.target.previousElementSibling.value) - 1;
              // e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].innerHTML = Number(e.target.previousElementSibling.value) * Number(e.target.parentElement.parentElement.previousElementSibling.children[0].value)
            }}></i>
          </div>
        </td>
          <td className="">
            <Select
              options={serviceReducer.allServices.map(e => ({ value: e.id, label: tools.findAncestors(serviceReducer.allServices, e.id)?.reverse()?.reduce((acc, curr, index) => acc + ((index == 0 ? '' : '> ') + curr?.title), '')}))}
              value={{value: orderProduct.serviceId, label: tools.findAncestors(serviceReducer.allServices, orderProduct.serviceId)?.reverse()?.map((attr, index) => <span key={'bread' + index} className="breadCrumbItem">{(index == 0 ? '' : '> ') + attr?.title}</span>)}}
              onChange={(selected) => {setForm(prev => ({ ...prev, orderServices: (key == undefined || key < 0) ? [...prev, { serviceId: selected.value }] : prev.orderServices.map(e => e.serviceId == orderProduct.serviceId ? {...e, serviceId: selected.value } : e)}))}}
            />
          </td>
          {/* <td><img className="width100p" src={orderProduct.product.medias.find(e => e.code == 'main')?.url}/></td> */}
          <td>{++index}</td>
          <td>
            <i className="cancelSvg" onClick={() => setForm(prev => ({ ...prev, orderServices: prev.orderServices.filter(e => e.serviceId != orderProduct.serviceId)}))}></i>
          </td>
        </tr>
      )
    })

    return rows;
  };

  const fetchData = async () => {
    dispatch(setLoading(true));

    if (id) {
      const res = await restApi(endpoints.order.single + id, true).get();

      setForm({
        date: res.data?.date,
        time: res.data?.fromTime,
        status: res.data?.status,
        finalPrice: res.data?.finalPrice,
        price: res.data?.price,
        serviceId: res.data?.serviceId,
        transportation: res.data?.transportation,
        discountAmount: res.data?.discountAmount,
        orderServices: res.data?.orderServices,
        address: res.data?.address,
        user: res.data?.user,
        createdAt: res.data?.createdAt
      });
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUser = async (phoneNumber) => {
    const res = await restApi(endpoints.user.findBy, true).get({ phoneNumber: phoneNumber });
    if (res.code == 200){
      setForm(prev => ({ ...prev, user: res.data }))
    }
  };

  useEffect(() => {
    const newPrice = form.orderServices?.reduce((acc, curr) => acc + Number(serviceReducer.allServices?.find(e => e.id == curr.serviceId)?.price), 0)
    setForm(prev => ({ ...prev, price: newPrice, finalPrice: newPrice + form?.transportation}))
  }, [...form?.orderServices, form?.transportation]);
  console.log(form?.address);
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
            <label className="sideBarTitle">شماره تلفن</label>
            <input className="editProductInput" value={form?.user?.phoneNumber} onChange={async (input) => {
              setForm(prev => ({ ...prev, user: {
                  ...prev.user, phoneNumber: input.target.value
                }}))
              if (input.target.value.length == 11) {
                await fetchUser(input.target.value);
              }
            }}/>
          <label className="sideBarTitle">نام</label>
            <input className="editProductInput" value={form?.user?.name}/>
            <label className="sideBarTitle">نام و خانوادگی</label>
            <input className="editProductInput" value={form?.user?.lastName}/>
            <label className="sideBarTitle" >کد ملی</label>
            <input className="editProductInput" value={form?.user?.nationalCode}/>
          </div>
        </div>
          <div className="infoSection">
          <h1 className="dashBoardTitle">اطلاعات سفارش</h1>
          <div className="userInfoContainer">
          <label className="sideBarTitle">وضغیت سفارش</label>
            <Select name='status' value={{
              value: Object.keys(orderStatus).find(e => e == form?.status),
              label: orderStatus[Object.keys(orderStatus).find(e => e == form?.status)]
            }} options={Object.entries(orderStatus).map(([key, value]) => ({value: key, label: value}))} className="dashCardLog" id="infoTitle" onChange={(selected) => setForm(prev => ({ ...prev, status: selected.value }))}/>
            <label className="sideBarTitle">تاریخ</label>
            <input className="editProductInput" value={(form?.date || moment().add(2, 'd').format('jYYYY/jMM/jDD'))} onChange={(input) => setForm(prev => ({ ...prev, date: input.target.value}))}/>
            <label className="sideBarTitle" >ساعت</label>
            <input className="editProductInput" value={form?.time} onChange={(input) => setForm(prev => ({ ...prev, time: input.target.value}))}/>
          </div>
        </div>

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
        </section>
        <section className="topRow">
          <div className="infoSection">
            <h1 className="dashBoardTitle">آدرس</h1>
            <div className="userInfoContainer">
              <label className="sideBarTitle">آدرس های پیشین</label>
              <Select className="addressInput dirRtl width100" options={tools.selectFormatter(form.user?.addresses, 'id', 'description', 'آدرس جدید')} defaultValue={{
                value: form?.addressId || '',
                label: form.user?.addresses?.find(e => e.id == form?.addressId)?.description
              }} id="infoTitle" onChange={(selected) => setForm(prev => ({
                ...prev,
                address: form.user?.addresses?.find(e => e.id == selected.value) || { phoneNumber: '',title: '', vahed: '', pelak: '', description: '', id: null}
              }))}/>
              <label className="sideBarTitle" htmlFor="phoneNumber">عنوان</label>
              <input className="editProductInput" type="text" id="phoneNumber" name="addressPhone" value={form.address?.title} onChange={(input: any) => setForm(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  title: input.target.value
                }
              }))}/>
              <label className="sideBarTitle" htmlFor="phoneNumber">شماره تماس</label>
              <input className="editProductInput" type="text" id="phoneNumber" name="addressPhone" value={form.address?.phoneNumber} onChange={(input: any) => setForm(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  phoneNumber: input.target.value
                }
              }))}/>
              <label className="sideBarTitle" htmlFor="postalCode">پلاک</label>
              <input className="editProductInput" type="text" id="postalCode" name="addressPostal" value={form.address?.pelak} onChange={(input: any) => setForm(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  pelak: input.target.value
                }
              }))}/>
              <label className="sideBarTitle" htmlFor="postalCode">واحد</label>
              <input className="editProductInput" type="text" id="postalCode" name="addressPostal" value={form.address?.vahed} onChange={(input: any) => setForm(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  vahed: input.target.value
                }
              }))}/>
              <label className="sideBarTitle" htmlFor="address">جزئیات آدرس</label>
              <textarea className="editProductInput" id="address" name="addressText" value={form.address?.description} onChange={(input: any) => setForm(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  description: input.target.value
                }
              }))}/>
            </div>
          </div>
          <div className="infoSection">
            <h1 className="dashBoardTitle">مجموع فاکتور</h1>
            <div className="userInfoContainer">
             <span className="factorHeader">
               <p>{moment(form?.createdAt).format('jYYYY/jMM/jDD')}</p>
             </span>
              <span className="billItems dashboardBill">
              <h3 className="billItem">هزینه ارسال</h3>
              <div className="pricePart">
                <input className="billPrice" value={form?.transportation} onChange={(input) => setForm(prev => ({ ...prev, transportation: Number(input.target.value) > 0 ? Number(input.target.value) : 0}))}/>
              </div>
            </span>
              <span className="billItems dashboardBill">
              <h3 className="billItem">مبلغ سفارش</h3>
              <div className="pricePart">
                <input className="billPrice" value={form?.price} onChange={(input) => setForm(prev => ({ ...prev, price: Number(input.target.value)}))}/>
              </div>
            </span>
              <span className="billItems dashboardBill">
              <h3 className="billItem">تخفیف</h3>
              <div className="pricePart">
                <input className="billPrice" value={form?.discountAmount || 0} onChange={(input) => setForm(prev => ({ ...prev, discountAmount: Number(input.target.value) > 0 ? Number(input.target.value) : 0 }))}/>
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
                <input className="tablePrice1" value={form?.finalPrice - form?.discountAmount} onChange={(input) => setForm(prev => ({ ...prev, finalPrice: Number(input.target.value)}))}/>
              </div>
            </span>
            </div>
          </div>
        </section>
        <section className="bottom width100">
        <h6 className="dashBoardTitle">خدمات</h6>
          <Select
            options={[{ id: null }, ...serviceReducer.services.filter(e => !e.parent)].map(e => ({ value: e.id, label: serviceReducer.services.find(j => j.id == e?.id)?.title || 'انتخاب کنید' }))}
            value={{value: form?.serviceId, label: serviceReducer.services.find(e => e.id == form?.serviceId)?.title || 'انتخاب کنید'}}
            onChange={(selected) => {setForm(prev => ({ ...prev, serviceId: selected.value }))}}
            className='width300p'
          />
          <table className="productTable">
          <thead className="editOrderTable">
            <th className="sideBarTitle center" >قیمت کل</th>
            <th className="sideBarTitle center" >تعداد</th>
            <th className="sideBarTitle center" >خدمت</th>
            <th className="sideBarTitle center" >ردیف</th>
            <th className="sideBarTitle center" ></th>
          </thead>
            <tbody>
            {list()}
            <tr className="addProductTr">
              <td className="addProductButton clickable" onClick={() => form?.serviceId && setForm(prev => ({ ...prev, orderServices: [...prev.orderServices, {serviceId: 1 }] }))}>اضافه کردن محصول</td>
            </tr>
            </tbody>
          </table>
        </section>
      </main>
      </body>
    </>
  )
}
export default OrderManage;