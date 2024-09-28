// import mapImg from '../../../../public/img/map.jpg'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import Neshan from '../Neshan';

const MapModal = ({ address, setAddress = null }: any) => {
  const dispatch: any = useDispatch();
  const [form, setForm] = useState(address);
  const defaultPosition = {
    lat: '35.80761631591913',
    lng: '51.4319429449887'
  };
  const [position, setPosition] = useState({ lng: address?.longitude || defaultPosition.lng, lat: address?.latitude || defaultPosition.lat } );
  const send = async () => {
    if (setAddress){
      setAddress(form)
      dispatch(popupSlice.hide())
      return;
    }

    dispatch(setLoading(true));

    const res = await restApi(endpoints.address.basic + (address?.id || '')).post({
      title: form.title,
      phoneNumber: form.phoneNumber,
      pelak: form.pelak,
      vahed: form.vahed,
      description: form.description,
      postalCode: form.postalCode,
      longitude: position.lng,
      latitude: position.lat,

    });

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `آدرس با موفقیت ${address ? 'ویرایش' : 'ساخته'} شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          dispatch(popupSlice.hide())
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

  useEffect(() => {
    setForm(prev => ({ ...prev, latitude: position.lat, longitude: position.lng }))
  }, [position]);

  return (
    <div className="modalContainer">
      <div className="rowSection">
        <h2>انتخاب آدرس</h2>
        <i className="modalExit" onClick={() => dispatch(popupSlice.hide())}></i>
      </div>
      <div className="modalConte//nt">
        {/* <img src="/img/map.jpg"/> */}
        <div className="modalForm" >
          <div>
            <label htmlFor="title">عنوان</label>
            <input type="text" id="title" name="title" value={form?.title} onChange={(input: any) => setForm(prev => ({...prev, title: input.target.value}))}/>
          </div>
          <div>
            <label htmlFor="title">شماره تلفن</label>
            <input type="text" id="title" name="title" value={form?.phoneNumber} onChange={(input: any) => setForm(prev => ({...prev, phoneNumber: input.target.value}))}/>
          </div>
          <div>
            <label htmlFor="title">کد پستی</label>
            <input type="text" id="title" name="title" value={form?.postalCode} onChange={(input: any) => setForm(prev => ({...prev, postalCode: input.target.value}))}/>
          </div>
          <div>
            <label htmlFor="title">پلاک</label>
            <input type="text" id="title" name="title" value={form?.pelak} onChange={(input: any) => setForm(prev => ({...prev, pelak: input.target.value}))}/>
          </div>
          <div>
            <label htmlFor="title">واحد</label>
            <input type="text" id="title" name="title" value={form?.vahed} onChange={(input: any) => setForm(prev => ({...prev, vahed: input.target.value}))}/>
          </div>
          <div className="addressSection">
            <label htmlFor="address">جزئیات آدرس</label>
            <textarea id="address" name="addressText" value={form?.description} onChange={(input: any) => setForm(prev => ({...prev, description: input.target.value}))}/>
          </div>
          <div className="modalMapContainer">
            <Neshan position={position} setPosition={setPosition}/>
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

export default MapModal;