import moment from 'jalali-moment';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { Sidebar } from '../../layouts/Sidebar';
import { IService } from '../../types/types';
import tools from '../../utils/tools';
import roles = globalEnum.roles;

const Dashboard = () => {
  const [data, setData] = useState<IService[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [itemOffset, setItemOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [workerInfo, setWorkerInfo] = useState({ id: 1, last1: 0, last7: 0, last30: 0 });
  const itemsPerPage = 25;
  const endOffset = (itemOffset || 0) + itemsPerPage;
  let currentItems = data.filter(e => e.title?.toLowerCase()?.includes(query.toLowerCase()))?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deleteItem = async (id: number) => {
    if(confirm('آیا مطمئن هستید؟')){
      dispatch(setLoading(true));

      const res = await restApi(endpoints.discount.index + id, true).delete({});
      if(res.code == 200){
        Swal.fire({
          title: 'موفق',
          text: 'تخفیف با موفقیت حذف شد',
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
      await fetchData()
    }
  }

  const list = () => {
    const rows = [];

    currentItems.filter(e => e.title.toLowerCase()?.includes(query.toLowerCase()))?.map((discount: any, index) => {
      rows.push(
        <tr className="dashTr2">
          <td className="">
            <i className="trash clickable" onClick={() => deleteItem(discount.id)}></i>
            <i className="edit clickable" onClick={() => navigate('/discount/edit/' + discount.id)}></i>
          </td>
          <td>{`${discount?.timesUsed}/${discount.maxCount}`}</td>
          <td className="">{discount?.percent || '-'}</td>
          <td>{tools.formatPrice(discount?.amount) || '-'}</td>
          <td className="">
            {discount?.code}
          </td>
          <td className="">
            {discount?.forUser?.name ? <a href={`/user/edit/${discount?.forUser?.id}`} target='_blank'>{discount?.forUser?.name + ' - ' + discount?.forUser?.lastName}</a> : '-'}
          </td>
          <td className="">{discount?.title}</td>
          <td>{((searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0) * itemsPerPage) + ++index}</td>
        </tr>
      )
    })

    return rows;
  };

  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await Promise.all([
      restApi(endpoints.user.index, true).get({ role: roles.WORKER }),
    ]);

    if(res[0].code == 200){
      setWorkers(res[0].data);
      if (res[0].data.length > 0) {
        setWorkerInfo(prev => ({
          ...prev,
          id: res[0].data[0].id
        }));
      }
    }

    dispatch(setLoading(false));
  };

  const fetchWorkerInfo = async (id: number) => {
    dispatch(setLoading(true));

    const res = await Promise.all([
      restApi(endpoints.dashboard.sales, true).get({ worker: id, from: moment().subtract(1, 'd').format('jYYYY-jMM-jDD-HH-ss'), to: moment().format('jYYYY-jMM-jDD-HH-ss'), }),
      restApi(endpoints.dashboard.sales, true).get({ worker: id, from: moment().subtract(1, 'd').format('jYYYY-jMM-jDD-HH-ss'), to: moment().format('jYYYY-jMM-jDD-HH-ss'), }),
      restApi(endpoints.dashboard.sales, true).get({ worker: id, from: moment().subtract(1, 'd').format('jYYYY-jMM-jDD-HH-ss'), to: moment().format('jYYYY-jMM-jDD-HH-ss'), }),
    ]);

    if(res[0].code == 200){
      setWorkerInfo({
        id: workerInfo.id,
        last1: res[0].data.salary,
        last7: res[1].data.salary,
        last30: res[2].data.salary,
      });
    }

    dispatch(setLoading(false));
  };

  const fetchLogs = async (options: any = { path: '/service'}) => {
    const params = {}
    Object.entries(options).map(([key, value]) => {
      params[key] = value;
    });

    const res = await restApi(endpoints.log.index, true).get(params);

    if(res.code == 200){
      setLogs(res.data);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchData();
    fetchWorkerInfo(workerInfo.id)
  }, []);

  useEffect(() => {
    if (searchParams.get('page')){
      setItemOffset(((Number(searchParams.get('page')) - 1) * itemsPerPage) % data.length)
    }
  }, [data]);

  console.log(workers);
  return(
    <>
      <body className="dashboardBody">
      <Sidebar />
      <main className="dashBoardMain">
        <div>
          <div className="dashCardContainer">
            <Select options={[
              {
                value: '/service',
                label: 'صفحه اصلی'
              },
              {
                value: '/newOrder',
                label: 'ثبت سفارش'
              },{
                value: '/user',
                label: 'پروفایل'
              },
            ]} className="dashCardLog" id="infoTitle" onChange={ async (selected: any) => fetchLogs({ path: selected.value.replaceAll('/', '%2') })}/>
            <div className="dashCard">
              <span>
                همه بازدید ها
              </span>
                <span>
                {logs.length}
              </span>
            </div>
            <div className="dashCard">
              <span>
                لاگین شده
              </span>
                <span>
                {logs.filter(e => e.userId != null).length}
              </span>
            </div>
            <div className="dashCard">
              <span>
                بدون لاگین
              </span>
                <span>
                {logs.filter(e => !e.userId).length}
              </span>
            </div>
            </div>
        </div>
        <div>
          <div className="dashCardContainer">
            <Select className="dashCardLog" value={{ label: workers?.find(e => e.id == workerInfo?.id)?.name + ' ' + workers?.find(e => e.id == workerInfo?.id)?.lastName, value: workerInfo?.id}} options={workers?.map(e => ({ label: `${e.name} ${e.lastName}`, value: e.id }))} onChange={(selected) => {
              setWorkerInfo({
                id: selected.value,
                last1: 0,
                last7: 0,
                last30: 0
              });
              fetchWorkerInfo(selected.value);
            } }/>
            <div className="dashCard">
              <span>
                امروز
              </span>
              <span>
                {workerInfo.last1}
              </span>
            </div>
            <div className="dashCard">
              <span>
                ۷ روز گذشته
              </span>
              <span>
                {workerInfo.last7}
              </span>
            </div>
            <div className="dashCard">
              <span>
                ۳۰ روز گذشته
              </span>
              <span>
                {workerInfo.last30}
              </span>
            </div>
          </div>
        </div>
      </main>
      </body>
    </>
  )
}
export default Dashboard;