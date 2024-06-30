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

const ServiceManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState<any>();
  const [services, setServices] = useState<IService[]>([]);
  const [image, setImage] = useState<any>({});

  const [selectedSpecifics, setSelectedSpecifics] = useState([]);
  const { id: paramId } = useParams();

  const submit = async () => {
    dispatch(setLoading(true));

    const data: any = tools.extractor(form, ['title', 'parentId', 'description', 'price', 'hasColor', 'section']);
    data.specifics = selectedSpecifics;

    const res = await restApi(endpoints.service.basic + (paramId || '')).post(data);

    if (image.data) {
      const formData = new FormData();

      formData.append('file', image.data);

      const mediaRes = await restApi(endpoints.service.medias + res.data.id).upload(formData);
    }

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `خدمت با موفقیت ${paramId ? 'ویرایش' : 'اضافه'} شد`,
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        didClose() {
          // navigate('/service/')
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
      restApi(endpoints.service.client).get(),
      paramId && restApi(endpoints.service.single + paramId).get(),
    ]);

    const sortedData = [];

    res[0].data.map(e => tools.extractChildren(e, sortedData));

    setServices(sortedData);

    if (paramId) {
      setForm({
        title: res[1].data?.title,
        parentId: res[1].data?.parent?.id,
        description: res[1].data?.description,
        section: res[1].data?.section,
        hasColor: res[1].data?.hasColor,
        price: res[1].data?.price,
      })
      if (res[1].data?.media?.url){
        setImage({ preview: res[1].data?.media?.url, data: undefined})
      }
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
                <p>{paramId ? 'ویرایش' : 'ایجاد'} خدمت</p>
              </button>
            </div>
            <span>
          <h1 className="sideBarTitle">بازگشت به صفحه خدمات</h1>
           <h1 className="dashBoardTitle">{paramId ? 'ویرایش' : 'ایجاد'} خدمت</h1>
        </span>
            <i className="backAdd" onClick={() => navigate('/part')}></i>
          </div>
          <section className='addInfoSec'>
            <div className="AddInfoContainer">
              <label>عنوان</label>
              <input className="persianName" defaultValue={form?.title} onChange={(input) => setForm((prev) => ({...prev, title: input.target.value}))}/>
              <label>قیمت</label>
              <input className="persianName" defaultValue={form?.price} onChange={(input) => setForm((prev) => ({...prev, price: input.target.value}))}/>
              <label>سانس</label>
              <input className="persianName" defaultValue={form?.section} onChange={(input) => setForm((prev) => ({...prev, section: input.target.value}))}/>
              <label>رنگ</label>
              <select className="persianName" defaultValue={form?.hasColor} onChange={(input) => setForm((prev) => ({...prev, title: input.target.value}))}>
                <option value="false">ندارد</option>
                <option value="true">دارد</option>
              </select>
              <label>دسته بندی والد</label>
              <Select options={tools.selectFormatter(services, 'id', 'title', 'انتخاب کنید')} value={{ value: form?.parentId , label: services.find(e => e.id == form?.parentId)?.title }} className="width100" id="infoTitle" onChange={(selected: any) => setForm(prev => ({...prev, parentId: selected.value }))}/>
              <label>توضیحات</label>
              <textarea className="ShortDiscription" defaultValue={form?.description} onChange={(input) => setForm((prev) => ({...prev, description: input.target.value}))} />
            </div>
          </section>
          <section className='addInfoSec'>
            <div className="AddInfoContainer">
            <input type="file" onChange={(input) => setImage({
              data: input.target.files[0],
              preview: URL.createObjectURL(input.target.files[0]),
            })}/>
            <img src={image.preview} alt='نمونه کار'/>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default ServiceManage;