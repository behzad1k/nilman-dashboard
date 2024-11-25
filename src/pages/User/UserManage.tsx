import moment from 'jalali-moment';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
import MapModal from '../../layouts/Modal/MapModal';
import WorkerOffModal from '../../layouts/Modal/WorkerOffModal';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { Sidebar } from '../../layouts/Sidebar';
import { useAppSelector } from '../../services/store';
import { IService } from '../../types/types';
import tools from '../../utils/tools';

const UserManage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serviceReducer = useAppSelector(state => state.serviceReducer)
  const [workerOffs, setWorkerOffs] = useState<any>({});
  const [item, setItem] = useState<any>({});
  const [services, setServices] = useState<IService[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedWorkerServices, setSelectedWorkerServices] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [image, setImage] = useState({
    data: undefined,
    preview: undefined
  });
  const send = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true));

    const formData = new FormData(e.target);
    const res = await restApi(endpoints.user.basic + (paramId || '')).post({
      name: formData.get('name'),
      lastName: formData.get('lastName'),
      nationalCode: formData.get('nationalCode'),
      phoneNumber: formData.get('phoneNumber'),
      password: formData.get('password'),
      email: formData.get('email'),
      percent: formData.get('percent'),
      role: formData.get('role'),
      status: formData.get('status'),
      username: formData.get('username'),
      bankName: formData.get('bankName'),
      shebaNumber: formData.get('shebaNumber'),
      cardNumber: formData.get('cardNumber'),
      hesabNumber: formData.get('hesabNumber'),
      walletBalance: formData.get('walletBalance'),
      services: selectedWorkerServices,
      districts: selectedDistricts,
    });

    if (res.data?.id && image.data){
      const formData = new FormData();
      formData.append('file', image.data);

      await restApi(endpoints.user.medias + res.data?.id).upload(formData);
    }

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `کاربر با موفقیت ${paramId ? 'ویرایش' : 'ساخته'} شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          navigate(-1)
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

  const ordersList = () => {
    return [...(item?.orders || []), ...(item?.jobs || [])]?.map((order, index) =>
        <tr key={order?.id}>
          <td>{++index}</td>
          <td><a href={`/order/edit/${order?.id}`}>{order?.code}</a></td>
          <td>{order?.date + ' - ' + order?.fromTime}</td>
          <td>{order?.status}</td>
          <td>{tools.formatPrice(order?.finalPrice)}</td>
        </tr>)
  };

  const workerOffList = () => {

    return Object.entries(workerOffs).sort(([key, value]: any, [key2, value2]: any) => moment(value2.date, 'jYYYY/jMM/JDD').unix() || moment(value.date, 'jYYYY/jMM/JDD').unix() ).map(([key, value]: [key: string, value: any]) =>
      <tr key={key}>
        <td>{key}</td>
        {value.sort((a, b) => a.fromTime - b.fromTime).map(e =>
          <>
            <td>
              <span>({e.fromTime} - {e.toTime})</span>
              <br/>
              <small>{e.order?.id ? <a href={`/order/edit/${e.order?.id}`}>{e.order?.code}</a> : '-'}</small></td>
          </>
        )}
      </tr>
    )
  };

  const addressList = () => {
    return addresses?.map(address =>
      <div key={address.id} className="bottomDiv">
            <span className="adressCard">
          <div className="addressCardRight">
            <span className="adressPin">
              <i className="mapPin"></i>
              <h6>{address?.title}</h6>
            </span>
             <p className="adressText marginZero">{address?.description}
               <br/>{address?.phoneNumber}</p>
          </div>
          <div className="addressImage">
          <img src="/img/map.jpg" className="mapPhoto"/>
        <span className="svgContainer">
            {/* <i className="trash"></i> */}
          <i className="edit clickable" onClick={() => dispatch(popupSlice.middle(<MapModal address={address}/>))}></i>
        </span>
            </div>
        </span>
      </div>
    )
  };
  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await Promise.all([
      restApi(endpoints.service.client).get(),
      restApi(endpoints.district.index).get(),
      paramId && restApi(endpoints.user.single + paramId).get(),
    ]);

    setDistricts(res[1].data);

    const sortedData = [];

    res[0]?.data?.map(e => tools.extractChildren(e, sortedData));

    setServices(sortedData);

    if (paramId) {
      setItem(res[2].data);
      setAddresses(res[2].data?.addresses);
      setSelectedWorkerServices(res[2].data?.services?.map(e => e.id));
      setSelectedDistricts(res[2].data?.districts?.map(e => e.id));
      if (res[2].data?.profilePic?.url){
        setImage({ data: undefined, preview: res[2].data?.profilePic?.url })
      }

      const formattedData: any = {};
      res[2].data?.workerOffs?.map(worekrOff => {
        if (!formattedData[worekrOff.date]){
          formattedData[worekrOff.date] = []
        }
        formattedData[worekrOff.date].push(worekrOff)
      })
      setWorkerOffs(formattedData)
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <main className="dashboardBody">
      <Sidebar/>
        <form className="dashBoardMain main" onSubmit={send}>

        <div className="addInfoHeader">
          <button className="dashboardHeader keepRight clickable" type="submit" >
            ارسال
          </button>
          <span>
            <h1 className="sideBarTitle"> بازگشت به صفحه کاربران</h1>
             <h1 className="dashBoardTitle">ویرایش کاربر</h1>
          </span>
          <i className="backAdd clickable" onClick={() => navigate('/user/')}></i>
        </div>
        <section className="userInfo">
          <h1 className="dashBoardTitle">اطلاعات کاربر</h1>
          <div className="userInfoContainer width96">
            <div className="section30">
              {item?.role == globalEnum.roles.WORKER &&
              <>
                  <label className="sideBarTitle">خدمت مربوطه</label>
                  <Select
                      styles={{valueContainer: (base) => ({
                        ...base,
                            maxHeight: '120px',
                          overflow: 'auto'
                      })
                      }}
                      options={tools.selectFormatter(services, 'id', 'title', 'انتخاب کنید')}
                          defaultValue={selectedWorkerServices?.map(e => ({
                            value: e,
                              label: services.find(j => j.id == e)?.title
                          }))}
                          className="width100" id="infoTitle" isMulti={true} name='workerServices'
                          onChange={(selected: any) => setSelectedWorkerServices(selected.map(e => e.value))}/>
                  <label className="sideBarTitle">درصد همکاری</label>
                  <input className="editProductInput" defaultValue={item?.percent} name="percent"/>
                  <label className="sideBarTitle">مناطق تحت پوشش</label>
                  <Select
                      options={tools.selectFormatter(districts, 'id', 'title', 'انتخاب کنید')}
                      defaultValue={selectedDistricts?.map(e => ({
                        value: e,
                        label: districts.find(j => j.id == e)?.title
                      }))}
                      className="width100" id="infoTitle" isMulti={true} name='workerServices'
                      onChange={(selected: any) => setSelectedDistricts(selected.map(e => e.value))}/>
              </>
              }
              {(item?.role == globalEnum.roles.SUPER_ADMIN || item?.role == globalEnum.roles.OPERATOR || item?.role == globalEnum.roles.WORKER) &&
                  <>
                      <label className="sideBarTitle">نام کاربری</label>
                      <input className="editProductInput" defaultValue={item?.username} name="username"/>
                    <label className="sideBarTitle">رمز عبور <small>(فقط در صورت نیاز به تغییر وارد کنید)</small></label>
                      <input className="editProductInput" name="password"/>
                  </>
              }
                {/* <div> */}
              {/*   <div className="column"> */}
              {/*     <label className="sideBarTitle">وضعیت مشاهده قیمت</label> */}
              {/*     <span className="radioButtons"> */}
              {/*   <input className="smallInput" placeholder="0%" type="number" defaultValue={item?.specialPercent < 0 ? item?.specialPercent * -1 : item?.specialPercent} name="specialPercent"/> */}
              {/*     <span className="radioButtons"> */}
              {/*       <p>بالاتر</p> */}
              {/*         <i className={`${sign === 1 ? 'slectedradioButton' : 'radioButton'}`} onClick={() => setSign(1)}></i> */}
              {/*       <hr className="verLine"/> */}
              {/*       <p>پایین تر</p> */}
              {/*       <i className={`${sign === -1 ? 'slectedradioButton' : 'radioButton'}`} onClick={() => setSign(-1)}></i> */}
              {/*       </span> */}
              {/*         </span> */}
              {/*   </div> */}
              {/* </div> */}
            </div>
            <div className="section30">
              <label className="sideBarTitle">نام</label>
              <input className="editProductInput" defaultValue={item?.name} name="name"/>
              <label className="sideBarTitle">نام خانوادگی</label>
              <input className="editProductInput" defaultValue={item?.lastName} name="lastName"/>
              <label className="sideBarTitle">شماره تلفن</label>
              <input className="editProductInput" defaultValue={item?.phoneNumber} name="phoneNumber"/>
              </div>
            <div className="section30">
              <label className="sideBarTitle">وضعیت</label>
              <select className="selector30"  value={item?.status} name="status" onChange={(input) => setItem(prev => ({ ...prev, status: input.target.value}))}>
                <option value={0}>غیر فعال</option>
                <option value={1} >فعال</option>
              </select>
              <label className="sideBarTitle">نقش کاربری</label>
              <select className="selector30" name="role" value={item?.role} onChange={(input) => setItem(prev => ({ ...prev, role: input.target.value }))}>
                {Object.entries(globalEnum.roles).map(([key, value]) => <option value={key} key={key}>{value}</option>)}
              </select>
              <label className="sideBarTitle">کد ملی</label>
              <input className="editProductInput" defaultValue={item?.nationalCode} name="nationalCode"/>
              <label className="sideBarTitle">کیف پول</label>
              <input className="editProductInput" defaultValue={item?.walletBalance} name="walletBalance"/>
            </div>
            </div>
        </section>
        <section className="bottom">
          <h6 className="dashBoardTitle">آدرس ها</h6>
          <div>
            {addressList()}
          </div>
        </section>
          <section className="bottom">
            <h6 className="dashBoardTitle">سفارش ها</h6>
            <table dir="rtl">
              <thead>
              <tr>
                <th>ردیف</th>
                <th>کد</th>
                <th>تاریخ</th>
                <th>وضعیت</th>
                <th>قیمت</th>
              </tr>
              </thead>
              <tbody>
              {ordersList()}
              </tbody>
            </table>
          </section>
          <section className="bottom">
            <h6 className="dashBoardTitle">تایم های مشغولی</h6>
            <span className="dashboardHeader keepRight clickable" onClick={() => dispatch(popupSlice.middle(<WorkerOffModal userId={item.id}/>))} >
              افزودن
            </span>
            <table dir="rtl">
              <thead>
              <tr>
                <th>تاریخ</th>
                <th>سانس ها</th>
              </tr>
              </thead>
              <tbody>
              {workerOffList()}
              </tbody>
            </table>
          </section>
          {item?.role == 'WORKER' &&
              <section className="bottom">
                <h6 className="dashBoardTitle">اطلاعات بانکی</h6>
                  <label className="sideBarTitle">شماره کارت</label>
                  <input className="editProductInput" defaultValue={item?.cardNumber} name="cardNumber"/>
                  <label className="sideBarTitle">شماره حساب</label>
                  <input className="editProductInput" defaultValue={item?.hesabNumber} name="hesabNumber"/>
                  <label className="sideBarTitle">شماره شبا</label>
                  <input className="editProductInput" defaultValue={item?.shebaNumber} name="shebaNumber"/>
                  <label className="sideBarTitle">نام بانک</label>
                  <input className="editProductInput" defaultValue={item?.bankName} name="bankName"/>
              </section>
          }
          <section className="bottom">

          <div className="AddInfoContainer">
            <input type="file" onChange={(input) => setImage({
              data: input.target.files[0],
              preview: URL.createObjectURL(input.target.files[0]),
            })}/>
            {/* {paramId && image.preview && !image.data && <i className="deleteSvg" onClick={deleteImage}></i>} */}
            <img src={image.preview} className='maxWidth100' alt="عکس کاربر"/>
          </div>
          </section>
        </form>
      </main>
    </>
  );
};
export default UserManage;