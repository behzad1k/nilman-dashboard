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

const FeedbackFactorManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState<any>();
  const { id: paramId } = useParams();

  const submit = async () => {
    dispatch(setLoading(true));

    const data: any = tools.extractor(form, ['title', 'description', 'isPositive']);

    const res = await restApi(endpoints.feedbackFactors.basic + (paramId || '')).post(data);

    if (res.code == 200) {
      Swal.fire({
        title: 'موفق',
        text: `جزییات بازخورد با موفقیت ${paramId ? 'ویرایش' : 'اضافه'} شد`,
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
      paramId && restApi(endpoints.feedbackFactors.single + paramId).get(),
    ]);

    if (paramId) {
      setForm({
        title: res[0].data?.title,
        description: res[0].data?.description,
        isPositive: res[0].data?.isPositive
      });
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(form?.isPositive);
  return (
    <>
      <main className="dashboardBody">
        <Sidebar/>
        <div className="dashBoardMain main">
          <div className="addInfoHeader">
            <div className="buttonContainer keepRight">
              <button className="dashboardHeader keepRight" onClick={() => submit()}>
                <p>{paramId ? 'ویرایش' : 'ایجاد'} جزییات بازخورد</p>
              </button>
            </div>
            <span>
          <h1 className="sideBarTitle">بازگشت به صفحه جزییات بازخورد ها</h1>
           <h1 className="dashBoardTitle">{paramId ? 'ویرایش' : 'ایجاد'} جزییات بازخورد</h1>
        </span>
            <i className="backAdd" onClick={() => navigate('/feedbackFactor')}></i>
          </div>
          <section className="addInfoSec">
            <div className="AddInfoContainer">
              <label>عنوان</label>
              <input className="persianName" defaultValue={form?.title} onChange={(input) => setForm((prev) => ({
                ...prev,
                title: input.target.value
              }))}/>
              <label>عنوان</label>
              <select className="persianName" value={form?.isPositive} onChange={(input) => setForm((prev) => ({
                ...prev,
                isPositive: input.target.value
              }))}>
                <option value="0">منفی</option>
                <option value="1">مثبت</option>
              </select>
              <label>توضیحات</label>
              <textarea className="ShortDiscription" defaultValue={form?.description} onChange={(input) => setForm((prev) => ({
                ...prev,
                description: input.target.value
              }))}/>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default FeedbackFactorManage;