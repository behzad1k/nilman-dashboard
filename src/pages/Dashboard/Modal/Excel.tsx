import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { popupSlice } from '../../../services/reducers';
import { setLoading } from '../../../services/reducers/homeSlice';
import restApi from '../../../services/restApi';
import { useAppSelector } from '../../../services/store';

const Excel = () =>{
  const dispatch: any  = useDispatch();
  const [file, setFile] = useState<any>();

  const send = async () => {
    dispatch(setLoading(true));
    const formData = new FormData()
    formData.append('excel', file.data)
    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/setting/excel', true).upload(formData);

    if(res.code == 200){
      Swal.fire({
        title: 'موفق',
        text: 'فایل اکسل با موفقیت آپلود شد.',
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

  return(
    <main className="derhamMain">
      <span className="derhamHeader">
        <i className="coinSvg"></i>
        <p className="blueText">آپلود فایل اکسل</p>
      </span>
      <input type="file" className="derhamInput" onChange={(e: any) => {
        setFile({
          preview: URL.createObjectURL(e.target.files[0]),
          data: e.target.files[0],
        })
      }}
      />
      <span className="derhamButtons">
         <button className="cancelDerham" onClick={() => dispatch(popupSlice.hide())}>انصراف</button>
        <button className="dashboardHeader clickable" onClick={send}>ثبت</button>
      </span>
    </main>
  )
}
export default Excel