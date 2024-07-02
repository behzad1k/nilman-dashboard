import { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import endpoints from '../../../config/endpoints';
import { setLoading } from '../../../services/reducers/homeSlice';
import restApi from '../../../services/restApi';
import { Sidebar } from '../../../layouts/Sidebar';
import { IService } from '../../../types/types';
import tools from '../../../utils/tools';

const ColorManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState<any>();
  const [services, setServices] = useState<IService[]>([]);
  const [image, setImage] = useState<any>({});
  const { id: paramId } = useParams();

  const submit = async () => {
    dispatch(setLoading(true));

    const data: any = tools.extractor(form, ['title', 'code', 'description']);

    const res = await restApi(endpoints.color.basic + (paramId || '')).post(data);

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `رنگ با موفقیت ${paramId ? 'ویرایش' : 'اضافه'} شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          navigate('/color/')
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
      paramId && restApi(endpoints.color.single + paramId).get(),
    ]);
    
    if (paramId) {
      setForm({
        title: res[0].data?.title,
        code: res[0].data?.code,
        description: res[0].data?.description,
      })
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
        <div className="dashBoardMain main">
          <div className="addInfoHeader">
            <div className="buttonContainer keepRight">
              <button className="dashboardHeader keepRight" onClick={() => submit()}>
                <p>{paramId ? 'ویرایش' : 'ایجاد'} رنگ</p>
              </button>
            </div>
            <span>
          <h1 className="sideBarTitle">بازگشت به صفحه رنگ ها</h1>
           <h1 className="dashBoardTitle">{paramId ? 'ویرایش' : 'ایجاد'} رنگ</h1>
        </span>
            <i className="backAdd" onClick={() => navigate('/part')}></i>
          </div>
          <section className='addInfoSec'>
            <div className="AddInfoContainer">
              <label>عنوان</label>
              <input className="persianName" defaultValue={form?.title} onChange={(input) => setForm((prev) => ({...prev, title: input.target.value}))}/>
              <label>کد رنگ</label>
              <input className="persianName" type='color' value={form?.code} onChange={(input) => setForm((prev) => ({...prev, code: input.target.value}))}/>
              <label>توضیحات</label>
              <textarea className="ShortDiscription" defaultValue={form?.description} onChange={(input) => setForm((prev) => ({...prev, description: input.target.value}))} />
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default ColorManage;