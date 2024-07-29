// import mapImg from '../../../../public/img/map.jpg'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';

const MapModal = ({ setShowModal, setAddress, address }: any) => {
  const dispatch = useDispatch();

  const send = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.address.basic + (address.id || '')).post({
      title: address.title,
      phoneNumber: address.phoneNumber,
      pelak: address.pelak,
      vahed: address.vahed,
      description: address.description,
      postalCode: address.postalCode,
    });

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `آدرس با موفقیت ${address ? 'ویرایش' : 'ساخته'} شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          setShowModal(false)
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


  return (
    <div className="modalContainer">
      <div className="rowSection">
        <h2>انتخاب آدرس</h2>
        <i className="modalExit"></i>
      </div>
      <div className="modalConte//nt">
        <img src="/img/map.jpg"/>
        <div className="modalForm" >
          <div>
            <label htmlFor="title">عنوان</label>
            <input type="text" id="title" name="title" value={address?.title} onChange={(input: any) => setAddress((prev: any) => {
              const cp = [...prev];
              const index = prev.findIndex(e => e.id == address.id);

              cp[index] = {...cp[index], title: input.target.value }

              return cp;
            })}/>
          </div>
          <div>
            <label htmlFor="title">شماره تلفن</label>
            <input type="text" id="title" name="title" value={address?.phoneNumber} onChange={(input: any) => setAddress((prev: any) => {
              const cp = [...prev];
              const index = prev.findIndex(e => e.id == address.id);

              cp[index] = {...cp[index], phoneNumber: input.target.value }

              return cp;
            })}/>
          </div>
          <div>
            <label htmlFor="title">کد پستی</label>
            <input type="text" id="title" name="title" value={address?.postalCode} onChange={(input: any) => setAddress((prev: any) => {
              const cp = [...prev];
              const index = prev.findIndex(e => e.id == address.id);

              cp[index] = {...cp[index], postalCode: input.target.value }

              return cp;
            })}/>
          </div>
          <div>
            <label htmlFor="title">پلاک</label>
            <input type="text" id="title" name="title" value={address?.pelak} onChange={(input: any) => setAddress((prev: any) => {
              const cp = [...prev];
              const index = prev.findIndex(e => e.id == address.id);

              cp[index] = {...cp[index], pelak: input.target.value }

              return cp;
            })}/>
          </div>
          <div>
            <label htmlFor="title">واحد</label>
            <input type="text" id="title" name="title" value={address?.vahed} onChange={(input: any) => setAddress((prev: any) => {
              const cp = [...prev];
              const index = prev.findIndex(e => e.id == address.id);

              cp[index] = {...cp[index], vahed: input.target.value }

              return cp;
            })}/>
          </div>
          <div className="addressSection">
            <label htmlFor="address">جزئیات آدرس</label>
            <textarea id="address" name="addressText" value={address?.description} onChange={(input: any) => setAddress((prev: any) => {
              const cp = [...prev];
              const index = prev.findIndex(e => e.id == address.id);

              cp[index] = {...cp[index], description: input.target.value }

              return cp;
            })}/>
          </div>
        </div>
      </div>
      <div className="modalBtns">
        <span className="cancel clickable" onClick={() => setShowModal(false)}>بازگشت</span>
        <span className="submit clickable" onClick={send}>ثبت</span>
      </div>
    </div>
  );
};

export default MapModal;