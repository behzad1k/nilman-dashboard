import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import endpoints from '../../../config/endpoints';
import { Sidebar } from '../../../layouts/Sidebar';
import { setLoading } from '../../../services/reducers/homeSlice';
import restApi from '../../../services/restApi';
import { IService } from '../../../types/types';
import tools from '../../../utils/tools';

const ServiceManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState<any>({});
  const [services, setServices] = useState<IService[]>([]);
  const [image, setImage] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [selectedSpecifics, setSelectedSpecifics] = useState([]);
  const { id: paramId } = useParams();
  const deleteImage = async () => {
    if (confirm('آیا مطمئن هستید؟')) {
      dispatch(setLoading(true));
      const res = await restApi(endpoints.service.medias + paramId).delete({});

      if (res.code == 200) {
        Swal.fire({
          title: 'موفق',
          text: `عکس با موفقیت حذف شد`,
          icon: 'success',
          confirmButtonText: 'متوجه شدم',
          didClose() {
            navigate('/service/');
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
    }
  };

  const submit = async () => {
    dispatch(setLoading(true));

    const data: any = tools.extractor(form, ['title', 'parentId', 'description', 'price', 'hasColor', 'section', 'sort', 'hasMedia', 'isMulti', 'pricePlus', 'openDrawer', 'addOns', 'showInList']);
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
      setData(res[1].data);
      setForm({
        title: res[1].data?.title,
        parentId: res[1].data?.parent?.id,
        description: res[1].data?.description,
        section: res[1].data?.section,
        hasColor: res[1].data?.hasColor,
        isMulti: res[1].data?.isMulti,
        hasMedia: res[1].data?.hasMedia,
        price: res[1].data?.price,
        sort: res[1].data?.sort,
        pricePlus: res[1].data?.pricePlus,
        openDrawer: res[1].data?.openDrawer,
        showInList: res[1].data?.showInList,
        addOns: res[1].data?.addOns?.map(e => e.id.toString())
      });
      if (res[1].data?.media?.url) {
        setImage({
          preview: res[1].data?.media?.url,
          data: undefined
        });
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
            <i className="backAdd" onClick={() => navigate('/service')}></i>
          </div>
          <section className="addInfoSec">
            <div className="AddInfoContainer">
              <label>عنوان</label>
              <input className="persianName" defaultValue={form?.title} onChange={(input) => setForm((prev) => ({
                ...prev,
                title: input.target.value
              }))}/>
              <label>قیمت</label>
              <input className="persianName" defaultValue={form?.price} onChange={(input) => setForm((prev) => ({
                ...prev,
                price: input.target.value
              }))}/>
              <label>سانس</label>
              <input className="persianName" defaultValue={form?.section} onChange={(input) => setForm((prev) => ({
                ...prev,
                section: input.target.value
              }))}/>
              <label>چینش</label>
              <input className="persianName" defaultValue={form?.sort} onChange={(input) => setForm((prev) => ({
                ...prev,
                sort: input.target.value
              }))}/>

              <label>به علاوه</label>
              <input className="persianName" defaultValue={form?.pricePlus} onChange={(input) => setForm((prev) => ({
                ...prev,
                pricePlus: input.target.value
              }))}/>
              <div className="inputRow">
                <input className="checkBox" type="checkbox" checked={form?.hasColor} onChange={(input) => setForm((prev) => ({
                  ...prev,
                  hasColor: input.target.checked
                }))}/>
                <label>رنگ</label>
              </div>

              <div className="inputRow">
                <input className="checkBox" type="checkbox" checked={form?.showInList} onChange={(input) => setForm((prev) => ({
                  ...prev,
                  showInList: input.target.checked
                }))}/>
                <label>نمایش در فهرست</label>
              </div>
              {data?.attributes?.length > 0 &&
                  <>
                    <div className="inputRow">
                      <input className="checkBox" type="checkbox" checked={form?.isMulti} onChange={(input) => setForm((prev) => ({
                        ...prev,
                        isMulti: input.target.checked
                      }))}/>
                      <label>انتخاب چندگانه</label>
                    </div>
                    <div className="inputRow">
                      <input className="checkBox" type="checkbox" checked={form?.openDrawer} onChange={(input) => setForm((prev) => ({
                        ...prev,
                        openDrawer: input.target.checked
                      }))}/>
                      <label>مودال</label>
                    </div>
                  </>
              }
              <div className="inputRow">
                <input className="checkBox" type="checkbox" checked={form?.hasMedia} onChange={(input) => setForm((prev) => ({
                  ...prev,
                  hasMedia: input.target.checked
                }))}/>
                <label>عکس دار</label>
              </div>
              <label>دسته بندی والد</label>
              <Select options={tools.selectFormatter(services, 'id', 'title', 'انتخاب کنید')} value={{
                value: form?.parentId,
                label: services.find(e => e.id == form?.parentId)?.title
              }} className="width100" id="infoTitle" onChange={(selected: any) => setForm(prev => ({
                ...prev,
                parentId: selected.value
              }))}/>
              <label>خدمات اجباری</label>
              <Select isMulti options={tools.selectFormatter(services, 'id', 'title')} value={tools.selectFormatter(services.filter(e => form.addOns?.includes(e.id?.toString())), 'id', 'title')} className="width100" id="infoTitle" onChange={(selected: any) => setForm(prev => ({
                ...prev,
                addOns: selected.map(e => e.value.toString())
              }))}/>
              <label>توضیحات</label>
              <textarea className="ShortDiscription" defaultValue={form?.description} onChange={(input) => setForm((prev) => ({
                ...prev,
                description: input.target.value
              }))}/>
            </div>
          </section>
          <section className="addInfoSec">
            <div className="AddInfoContainer">
              <input type="file" onChange={(input) => setImage({
                data: input.target.files[0],
                preview: URL.createObjectURL(input.target.files[0]),
              })}/>
              {paramId && image.preview && !image.data && <i className="deleteSvg" onClick={deleteImage}></i>}
              <img src={image.preview} alt="نمونه کار"/>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default ServiceManage;