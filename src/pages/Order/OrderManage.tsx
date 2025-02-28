import moment from 'jalali-moment';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import DatePicker from 'react-multi-date-picker';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
import MapModal from '../../layouts/Modal/MapModal';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { useAppSelector } from '../../services/store';
import tools from '../../utils/tools';
import { Sidebar } from '../../layouts/Sidebar';
import orderStatus = globalEnum.orderStatus;
import Switch from 'react-ios-switch';
import persian_fa from "react-date-object/locales/persian_fa"

const OrderManage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const serviceReducer = useAppSelector(state => state.serviceReducer);
  const [form, setForm] = useState<any>({ isMulti: false, orderServices: [], transportation: 0, finalPrice: 0, discountAmount: 0, serviceId: null, date: moment().format('jYYYY/jMM/jDD')});
  const [colors, setColors] = useState([]);
  const [address, setAddress] = useState(form?.address);
  const navigate = useNavigate();
  const isColored = form?.orderServices?.filter(e => serviceReducer?.allServices?.find(j => j.id == e.serviceId)?.hasColor) ?.length > 0
  const send = async () => {
    dispatch(setLoading(true));
    let addressRes, userRes, verifyNationalCode
    if (!id){
      if (!form.user?.isVerified) {
        verifyNationalCode = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user/verify').post({
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
        isVerified: verifyNationalCode?.code == 200 || form.user.isVerified
      })

      addressRes = await restApi(process.env.REACT_APP_BASE_URL + '/admin/address/basic/' + (form?.address?.id || '')).post({
        title: form.address.title,
        phoneNumber: form.address.phoneNumber,
        description: form.address.description,
        vahed: form.address.vahed,
        pelak: form.address.pelak,
        userId: userRes.data?.id,
        longitude: form.address.longitude,
        latitude: form?.address?.latitude
      })
    }

    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/basic/' + (id || ''), true).post({
      date: form.date,
      time: form.time,
      status: form.status,
      finalPrice: form.finalPrice ,
      price: form.price,
      serviceId: form.serviceId,
      discountAmount: form.discountAmount,
      transportation: form.transportation,
      addressId: form.address.id || addressRes.data.id,
      userId: form.user?.id || userRes.data?.id,
      isMulti: form.isMulti,
      isUrgent: form.isUrgent
    })

    await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/products/' + res.data.id).put({
      services: form.orderServices.map(e => ({
        serviceId: e.serviceId,
        count: e.count,
        colors: e.colors
      }))
    })

    if(res.code == 200){
      Swal.fire({
        title: 'موفق',
        text: 'سفارش با موفقیت ویرایش شد',
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          navigate(-1)
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

  const list = () => {
    const rows: ReactElement[] = []
    form?.orderServices?.map((orderProduct: any, index) => {
      const key = form.orderServices?.findIndex(e => e.serviceId == orderProduct.serviceId)
      const ancestors = tools.findAncestors(serviceReducer.allServices, orderProduct.serviceId)
      let title = ancestors?.reverse()?.filter((e, index ) => index <= 3 && index > 1)?.reduce((acc, curr, index) => acc + ((index == 0 ? '' : '> ') + curr?.title), '')
      if(!title){
        title = 'hi'
      }
      rows.push(
        <tr className="" key={'product' + index}>
          <td className="backGround1">
            <p>{tools.formatPrice(form?.orderServices[key].count * serviceReducer.allServices?.find(e => e.id == orderProduct.serviceId)?.price)}</p>
          </td>
         <td className="">
            <p>{tools.formatPrice(serviceReducer.allServices?.find(e => e.id == orderProduct.serviceId)?.price)}</p>
          </td>
          <td className="quantity">
          <div className="quantityButtom">
            <i className="tablePlusIcon" onClick={(e: any) => setForm(prev => {
              const cp = { ...form };

              cp.orderServices[key].count = Number(cp.orderServices[key].count) + 1;

              return cp
            })}></i>
            <input type='number' className="quantityNumber" value={form?.orderServices[key].count}
               onChange={(input: any) => setForm(prev => {
                 const cp = { ...prev }

                 cp.orderServices[key].count = input.target.value

                 return cp;
               })}
            />
            <i className="tableCollapsIcon" onClick={(e: any) =>
              form?.orderServices[key].count > 1 && setForm(prev => {
                const cp = { ...prev };

                cp.orderServices[key].count = Number(cp.orderServices[key].count) - 1;

                return cp;
            })}></i>
          </div>
        </td>
          {isColored &&
          <td>
            <Select
              styles={{valueContainer: (base) => ({
                  ...base,
                  maxHeight: '120px',
                  overflow: 'auto',
                  minWidth: '120px'
                })
              }}
              options={tools.selectFormatter(colors, 'id', 'title', 'انتخاب کنید')}
              defaultValue={orderProduct.colors?.map(e => ({
                value: e,
                label: colors.find(j => j.id == e)?.title
              }))}
              className="width100" id="infoTitle" isMulti={true} name='workerServices'
              onChange={(selected: any) => setForm(prev => {
                const cp: any = {...prev}
                if (key != undefined && key >= 0) {
                  cp.orderServices[key].colors = selected.map((e: any) => e.value);
                }
                return cp
              })}/>
          </td>
          }
          <td className="">
            <Select
              className="orderServiceSelect"
              options={serviceReducer.allServices.filter(e => e.price > 0).map(e => ({ value: e.id, label: tools.findAncestors(serviceReducer.allServices, e.id)?.filter((e, index ) => (index < 3)).reverse()?.reduce((acc, curr, index) => acc + ((index == 0 ? '' : '> ') + curr?.title), '')}))}
              value={{value: orderProduct.serviceId, label: tools.findAncestors(serviceReducer.allServices, orderProduct.serviceId)?.filter((e, index ) => (index < 3)).reverse().map((attr, index) => <span key={'bread' + index} className="breadCrumbItem">{(index == 0 ? '' : '> ') + attr?.title}</span>)}}
              onChange={(selected) => {setForm(prev => ({ ...prev, orderServices: (key == undefined || key < 0) ? [...prev, { serviceId: selected.value }] : prev.orderServices.map(e => e.serviceId == orderProduct.serviceId ? {...e, serviceId: selected.value } : e )}))}}
            />
          </td>
          {/* <td><img className="width100p" src={orderProduct.product.medias.find(e => e.code == 'main')?.url}/></td> */}
          {/* <td>{++index}</td> */}
          <td>
            <i className="cancelSvg" onClick={() => setForm(prev => ({ ...prev, orderServices: prev.orderServices.filter(e => e.serviceId != orderProduct.serviceId)}))}></i>
          </td>
        </tr>
      )
    })

    return rows;
  };

  const fetchUser = async (phoneNumber) => {
    const res = await restApi(endpoints.user.findBy, true).get({ phoneNumber: phoneNumber });
    if (res.code == 200){
      setForm(prev => ({ ...prev, user: res.data }))
    }
  };

  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await Promise.all([restApi(endpoints.color.index, true).get()]);

    setColors(res[0].data);

    if (id) {
      const res = await restApi(endpoints.order.single + id, true).get();

      setForm({
        date: res.data?.date,
        time: res.data?.fromTime,
        status: res.data?.status,
        finalPrice: res.data.finalPrice,
        price: Number(res.data?.price),
        serviceId: res.data?.serviceId,
        transportation: res.data?.transportation,
        discountAmount: res.data?.discountAmount,
        orderServices: res.data?.orderServices.map(e => ({
          ...e,
          colors: e.colors.map(j => j.id)
        })),
        address: res.data?.user?.addresses?.find(e => e.id == res.data?.addressId),
        addressId: res.data?.addressId,
        user: res.data?.user,
        createdAt: res.data?.createdAt,
        isMulti: res.data?.isMulti,
        isUrgent: res.data?.isUrgent,
        finalImage: res.data?.finalImage,
        doneDate: res.data?.doneDate,
        startDate: res.data?.startDate,
      });
      setAddress(res.data?.address)

    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (serviceReducer.allServices.length > 0) {
      const newPrice = form.orderServices?.reduce((acc, curr) => acc + Number(serviceReducer.allServices?.find(e => e.id == curr.serviceId)?.price * Number(curr.count) * (form?.isUrgent ? 1.5 : 1)), 0);
      setForm(prev => ({
        ...prev,
        price: newPrice,
        finalPrice: (newPrice) + form?.transportation - Number(form?.discountAmount)
      }));
    }
  }, [JSON.stringify(form?.orderServices), form?.transportation, form?.discountAmount, form?.isUrgent]);

  useEffect(() => {
    setForm(prev => ({...prev, address: address}))
  }, [address]);

  return(
    <>
      <body className="dashboardBody">
      <Sidebar/>
      <main className="dashBoardMain main">
        <div className="addInfoHeader">
          <button className="dashboardHeader keepRight" onClick={send}>
            <p>ثبت سفارش</p>
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
            <input className="editProductInput" value={form?.user?.name} onChange={(input) => {
              setForm(prev => ({
                ...prev,
                user: {
                  ...prev.user,
                  name: input.target.value
                }
              }))
            }}/>
            <label className="sideBarTitle">نام و خانوادگی</label>
            <input className="editProductInput" value={form?.user?.lastName} onChange={(input) => {
              setForm(prev => ({
                ...prev,
                user: {
                  ...prev.user,
                  lastName: input.target.value
                }
              }))
            }}/>
            <label className="sideBarTitle" >کد ملی</label>
            <input className="editProductInput" value={form?.user?.nationalCode} onChange={(input) => {
              setForm(prev => ({
                ...prev,
                user: {
                  ...prev.user,
                  nationalCode: input.target.value
                }
              }))
            }}/>
            <label className="sideBarTitle" >کیف پول</label>
            <input disabled className="editProductInput" value={form?.user?.walletBalance} onChange={(input) => {
              setForm(prev => ({
                ...prev,
                user: {
                  ...prev.user,
                  walletBalance: input.target.value
                }
              }))
            }}/>
          </div>
        </div>
          <div className="infoSection">
          <h1 className="dashBoardTitle">اطلاعات سفارش</h1>
          <div className="userInfoContainer">
          <label className="sideBarTitle">وضغیت سفارش</label>
            <Select name='status' value={{
              value: Object.keys(orderStatus).find(e => e == form?.status),
              label: orderStatus[Object.keys(orderStatus).find(e => e == form?.status)]
            }} options={Object.entries(orderStatus).map(([key, value]) => ({value: key, label: value}))} className="/dashCardLog" id="infoTitle" onChange={(selected) => setForm(prev => ({ ...prev, status: selected.value }))}/>
            <label className="sideBarTitle">تاریخ</label>
            <DatePicker inputClass="editProductInput" locale={persian_fa} value={form?.date} onChange={(e) => setForm(prev => ({ ...prev, date: tools.persianNumToEn(e.format('YYYY/MM/DD')) }))} />
            <label className="sideBarTitle">ساعت</label>
            <input className="editProductInput" value={form?.time} onChange={(input) => setForm(prev => ({ ...prev, time: input.target.value}))}/>
            <div className='inputRow'>
              <Switch
                checked={form.isUrgent}
                onChange={checked => setForm(prev => ({ ...prev, isUrgent: checked}))}
              />
              <label className="sideBarTitle" >سفارش فوری</label>
            </div>
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
              <Select className="addressInput dirRtl width100" options={tools.selectFormatter(form.user?.addresses, 'id', 'description', 'آدرس جدید')} value={{
                value: form?.address?.id || '',
                label: form.user?.addresses?.find(e => e.id == form?.address?.id)?.description
              }} id="infoTitle" onChange={(selected) => {
                setForm(prev => ({
                  ...prev,
                  address: form.user?.addresses?.find(e => e.id == selected.value) || {
                    phoneNumber: '',
                    title: '',
                    vahed: '',
                    pelak: '',
                    description: '',
                    id: null
                  }
                }));
                setAddress(form?.user?.addresses?.find(e => e.id == selected.value))
              }}/>
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
              <span onClick={() => dispatch(popupSlice.middle(<MapModal address={address} setAddress={setAddress}/>))}>جزئیات آدرس</span>
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
                <input className="tablePrice1" value={form?.finalPrice} onChange={(input) => setForm(prev => ({ ...prev, finalPrice: Number(input.target.value)}))}/>
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
          <table className="">
          <thead className="editOrderTable">
            <th className="sideBarTitle center" >قیمت کل</th>
            <th className="sideBarTitle center" >قیمت واحد</th>
            <th className="sideBarTitle center" >تعداد</th>
            {isColored && <th className="sideBarTitle center" >رنگ</th>}
            <th className="sideBarTitle center" >خدمت</th>
            {/* <th className="sideBarTitle center" >ردیف</th> */}
            <th className="sideBarTitle" ></th>
          </thead>
            <tbody>
            {list()}
            <tr className="addProductTr">
              <td className="addProductButton clickable" onClick={() => form?.serviceId && setForm(prev => ({ ...prev, orderServices: [...prev.orderServices, {serviceId: 1, count: 1 }] }))}>اضافه کردن محصول</td>
            </tr>
            </tbody>
          </table>
        </section>

        {form?.startDate && <h6 className="dashBoardTitle">زمان شروع: {moment(form?.startDate).format('jYYYY/jMM/jDD HH:mm')}</h6>}
        {form?.doneDate && <h6 className="dashBoardTitle">زمان پایان: {moment(form?.doneDate).format('jYYYY/jMM/jDD HH:mm')}</h6>}

        {form?.finalImage?.url && <section className="bottom width100">
          <h6 className="dashBoardTitle">عکس پایان کار</h6>
          <img className='orderFinalImage' src={form.finalImage?.url}/>

        </section>}
      </main>
      </body>
    </>
  )
}
export default OrderManage;