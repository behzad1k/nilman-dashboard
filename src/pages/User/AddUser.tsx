import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { Sidebar } from '../../layouts/Sidebar';
import MapModal from './MapModal';

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [sign, setSign] = useState(1);
  const [address, setAddress] = useState<any>({
    phoneNumber: '',
    text: '',
    postal: '',
    cityId: 0,
    provinceId: 0
  });
  const send = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user', true).post({
      name: formData.get('name'),
      lastName: formData.get('lastName'),
      nationalCode: formData.get('nationalCode'),
      phoneNumber: formData.get('phoneNumber'),
      password: formData.get('password'),
      email: formData.get('email'),
      bankCard: formData.get('bankCard'),
      role: formData.get('role'),
      specialPercent: Number(formData.get('specialPercent')) * sign,
      status: formData.get('status'),
      address: {
        cityId: formData.get('addressCity'),
        provinceId: formData.get('addressProvince'),
        text: formData.get('addressText'),
        postalCode: formData.get('addressPostal'),
        phone: formData.get('addressPhone'),
      }
    });

    if (res.code == 201) {
      Swal.fire({
        title: 'موفق',
        text: 'کاربر با موفقیت ساخته شد',
        icon: 'success',
        confirmButtonText: 'متوجه شدم'
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
    <>
      <body className="dashboardBody">
      <Sidebar/>
      <main className="dashBoardMain main">
        <form onSubmit={send}>
          <div className="addInfoHeader">
            <button className="dashboardHeader keepRight clickable" type="submit">
              <p>ایجاد کاربر</p>
            </button>
            <span>
            <h1 className="sideBarTitle"> بازگشت به صفحه کاربران</h1>
             <h1 className="dashBoardTitle">افزودن کاربر</h1>
          </span>
            <i className="backAdd clickable" onClick={() => navigate('/dashboard/user/')}></i>
          </div>
          <section className="userInfo">
            <h1 className="dashBoardTitle">اطلاعات کاربر</h1>
            <div className="userInfoContainer width96">
              <div className="section30">
                <label className="sideBarTitle">کد ملی</label>
                <input className="editProductInput" name="nationalCode"/>
                <label className="sideBarTitle">رمز عبور</label>
                <input className="editProductInput" name="password"/>
                <div>
                  <div className="column">
                    <label className="sideBarTitle">وضعیت مشاهده قیمت</label>
                    <span className="radioButtons">
                <input className="smallInput" placeholder="0%" type="number" name="specialPercent"/>
                  <span className="radioButtons">
                    <p>بالاتر</p>
                      <i className={`${sign === 1 ? 'slectedradioButton' : 'radioButton'}`} onClick={() => setSign(1)}></i>
                    <hr className="verLine"/>
                    <p>پایین تر</p>
                    <i className={`${sign === -1 ? 'slectedradioButton' : 'radioButton'}`} onClick={() => setSign(-1)}></i>
                    </span>
                      </span>
                  </div>
                </div>
              </div>
              <div className="section30">
                <label className="sideBarTitle">رمز عبور</label>
                <input className="editProductInput" name="password"/>
                <label className="sideBarTitle">شماره تلفن</label>
                <input className="editProductInput" name="phoneNumber"/>
                <label className="sideBarTitle">ایمیل</label>
                <input className="editProductInput" name="email"/>
              </div>
              <div className="section30">
                <label className="sideBarTitle">وضعیت</label>
                <select className="selector30" name="status">
                  <option value={1}>فعال</option>
                  <option value={0}>غیر فعال</option>
                </select>
                <label className="sideBarTitle">نقش کاربری</label>
                <select className="selector30" name="role">
                  <option value="USER">کاربر عادی</option>
                  <option value="SUPER_ADMIN">ادمین کل</option>
                </select>
                <label className="sideBarTitle">نام و نام خانوادگی</label>
                <input className="editProductInput" name="name"/>
              </div>
            </div>
          </section>
          <section className="bottom">
            <h6 className="dashBoardTitle">آدرس ها</h6>
            <div className="bottomDiv">
              {address.phoneNumber && address.text &&
                  <span className="adressCard">
                     <div>
                       <span className="adressPin">
                         <i className="mapPin"></i>
                         <h6>آدرس ۱</h6>
                       </span>
                       <p className="adressText marginZero">{address?.text}
                        <br/>{address?.phoneNumber}</p>
                     </div>
                     <div className="addressImage">
                     <img src="/img/map.jpg" className="mapPhoto"/>
                   <span className="svgContainer">
                       <i className="trash" onClick={() => setAddress({})}></i>
                         <i className="edit"></i>
                   </span>
                       </div>
                 </span>
              }
              <div className="buttonHolder">
          <span className="dashboardHeader clickable" onClick={() => setShowModal(true)}>
            <p>افزودن آدرس جدید</p>
            <i className="addPlus"></i>
          </span>
              </div>
            </div>
            <div className={`formModal ${showModal ? 'flex' : ''}`}>
              <div className="modalOverLay" onClick={() => setShowModal(false)}>
              </div>
              <MapModal setShowModal={setShowModal} address={address} setAddress={setAddress}/>
            </div>
          </section>
        </form>
      </main>
      </body>
    </>
  );
};
export default AddUser;