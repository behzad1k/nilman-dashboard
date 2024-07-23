// import mapImg from '../../../../public/img/map.jpg'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';

const MapModal = ({ setShowModal, setAddress, address }: any) => {
  const dispatch = useDispatch();
  const [states, setStates] = useState([]);
  const [state, setState] = useState<any>();
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState<any>();

  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await restApi(process.env.REACT_APP_BASE_URL + '/address/states').get();

    if (res.code == 200) {
      setStates(res.data);
      if (address.cityId > 0 && address.provinceId > 0){
        setState(address.provinceId)
        setCity(address.cityId)
        setCities(res.data.find((e) => e.id == address.provinceId)?.cities);
      }else{
        setState(res.data[0]);
        setCity(res.data[0]?.cities[0]);
        setCities(res.data[0]?.cities);
      }
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCities(state?.cities)
  }, [state]);

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
            <label htmlFor="city">شهرستان</label>
            <select id="city" className="addressInput dirRtl width100" name="addressCity">
              {cities?.map((e) => <option value={e.id} selected={e.id == address?.cityId} onClick={() => {
                setCity(e);
                setAddress((prev: any) => {
                  return {
                    ...prev,
                    cityId: e.id
                  }
                })
              }}>{e.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="province">استان</label>
            <select id="province" className="addressInput dirRtl width100" name="addressProvince">
              {states.map((e) => <option value={e.id} selected={e.id == address?.provinceId} onClick={() => {
                setState(e);
                setAddress((prev: any) => {
                  return {
                    ...prev,
                    provinceId: e.id
                  }
                })
              }}>{e.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="phoneNumber">شماره تماس</label>
            <input type="text" id="phoneNumber" name="addressPhone" defaultValue={address?.phoneNumber} onChange={(input: any) => setAddress((prev: any) => {return { ...prev, phoneNumber: input.target.value }})}/>
          </div>
          <div>
            <label htmlFor="postalCode">کد پستی</label>
            <input type="text" id="postalCode" name="addressPostal" defaultValue={address?.postalCode} onChange={(input: any) => setAddress((prev: any) => {return { ...prev, postalCode: input.target.value }})}/>
          </div>
          <div className="addressSection">
            <label htmlFor="address">جزئیات آدرس</label>
            <textarea id="address" name="addressText" defaultValue={address?.text} onChange={(input: any) => setAddress((prev: any) => {return { ...prev, text: input.target.value }})}/>
          </div>
        </div>
      </div>
      <div className="modalBtns">
        <span className="cancel clickable" onClick={() => setShowModal(false)}>بازگشت</span>
        <span className="submit clickable" onClick={() => setShowModal(false)}>ثبت</span>
      </div>
    </div>
  );
};

export default MapModal;