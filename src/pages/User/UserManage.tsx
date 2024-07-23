import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
import MapModal from '../../layouts/Modal/MapModal';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { Sidebar } from '../../layouts/Sidebar';
import { useAppSelector } from '../../services/store';

const UserManage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serviceReducer = useAppSelector(state => state.serviceReducer)
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState<any>();
  const [accesses, setAccesses] = useState([]);
  const [selectedAccesses, setSelectedAccesses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [address, setAddress] = useState<any>({phoneNumber: '',
    text: '',
    postal: '',
    cityId: 0,
    provinceId: 0});

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
      serviceId: formData.get('serviceId'),
      percent: formData.get('percent'),
      role: formData.get('role'),
      status: formData.get('status'),
      username: formData.get('username'),
      address: {
        cityId: formData.get('addressCity'),
        provinceId: formData.get('addressProvince'),
        text: formData.get('addressText'),
        postalCode: formData.get('addressPostal'),
        phone: formData.get('addressPhone'),
      }
    });

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `کاربر با موفقیت ${paramId ? 'ویرایش' : 'ساخته'} شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          navigate('/user')
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
    dispatch(setLoading(true));

    const res = await Promise.all([
      paramId && restApi(endpoints.user.single + paramId).get(),
    ]);


    if (paramId) {
      setItem(res[0].data);
      setAddress(res[0].data?.addresses);
    }
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
                  <select className="selector30" name="serviceId" value={item.serviceId} onChange={(input) => setItem(prev => ({ ...prev, serviceId: input.target.value}))}>
                    {serviceReducer.services.filter(e => !e.parent).map(e => <option value={e.id} key={e.id}>{e.title}</option>)}
                  </select>
                  <label className="sideBarTitle">درصد همکاری</label>
                  <input className="editProductInput" defaultValue={item?.percent} name="percent"/>
              </>
              }
              {(item?.role == globalEnum.roles.SUPER_ADMIN || item?.role == globalEnum.roles.OPERATOR) &&
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
            </div>
            </div>
        </section>
        <section className="bottom">
          <h6 className="dashBoardTitle">آدرس ها</h6>
          <div className="bottomDiv">
            <span className="adressCard">
          <div className="addressCardRight">
            <span className="adressPin">
              <i className="mapPin"></i>
              <h6>{address?.title}</h6>
            </span>
             <p className="adressText marginZero">{address?.text}
               <br/>{address?.phoneNumber}</p>
          </div>
          <div className="addressImage">
          <img src="/img/map.jpg" className="mapPhoto"/>
        <span className="svgContainer">
            {/* <i className="trash"></i> */}
              <i className="edit clickable" onClick={() => setShowModal(true)}></i>
        </span>
            </div>
        </span>
            <div className={`formModal ${showModal ? 'flex' : ''}`}>
              <div className="modalOverLay" onClick={() => setShowModal(false)}>
              </div>
              <MapModal setShowModal={setShowModal} address={address} setAddress={setAddress}/>
            </div>
          </div>
        </section>

        </form>
      </main>
    </>
  );
};
export default UserManage;