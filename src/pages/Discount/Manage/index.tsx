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

const DiscountManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState<any>();
  const [users, setUsers] = useState<any[]>([]);
  const [image, setImage] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [selectedSpecifics, setSelectedSpecifics] = useState([]);
  const { id: paramId } = useParams();

  const submit = async () => {
    dispatch(setLoading(true));

    const data: any = tools.extractor(form, ['title', 'percent', 'amount', 'maxCount', 'forUserId', 'code']);

    const res = await restApi(endpoints.discount.basic + (paramId || '')).post(data);

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `تخفیف با موفقیت ${paramId ? 'ویرایش' : 'اضافه'} شد`,
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
      restApi(endpoints.user.index).get(),
      paramId && restApi(endpoints.discount.single + paramId).get(),
    ]);

    setUsers(res[0]?.data);

    if (paramId) {
      setForm({
        title: res[1].data?.title,
        percent: res[1].data?.percent,
        amount: res[1].data?.amount,
        maxCount: res[1].data?.maxCount,
        forUserId: res[1].data?.forUserId,
        code: res[1].data?.code,
      });
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
                <p>{paramId ? 'ویرایش' : 'ایجاد'} تخفیف</p>
              </button>
            </div>
            <span>
          <h1 className="sideBarTitle">بازگشت به صفحه تخفیف ها</h1>
           <h1 className="dashBoardTitle">{paramId ? 'ویرایش' : 'ایجاد'} تخفیف</h1>
            </span>
            <i className="backAdd" onClick={() => navigate('/discount')}></i>
          </div>
          <section className="addInfoSec">
            <div className="AddInfoContainer">
              <label>عنوان</label>
              <input className="persianName" defaultValue={form?.title} onChange={(input) => setForm((prev) => ({
                ...prev,
                title: input.target.value
              }))}/>
              <label>مقدار</label>
              <input className="persianName" defaultValue={form?.amount} onChange={(input) => setForm((prev) => ({
                ...prev,
                amount: input.target.value
              }))}/>
              <label>درصد</label>
              <input className="persianName" defaultValue={form?.percent} onChange={(input) => setForm((prev) => ({
                ...prev,
                percent: input.target.value
              }))}/>
              <label>کد</label>
              <input className="persianName" defaultValue={form?.code} onChange={(input) => setForm((prev) => ({
                ...prev,
                code: input.target.value
              }))}/>

              <label>حداکثر استفاده</label>
              <input className="persianName" defaultValue={form?.maxCount} onChange={(input) => setForm((prev) => ({
                ...prev,
                maxCount: input.target.value
              }))}/>
              <label>برای کاربر</label>
              <Select options={tools.selectFormatter(users, 'id', 'phoneNumber', 'انتخاب کنید')} value={{
                value: form?.forUserId,
                label: users.find(e => e.id == form.forUserId)?.phoneNumber
              }} className="width100" id="infoTitle" onChange={(selected: any) => setForm(prev => ({
                ...prev,
                forUserId: selected.value
              }))}/>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default DiscountManage;