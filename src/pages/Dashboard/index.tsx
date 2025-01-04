import moment from 'jalali-moment';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { DatePicker } from 'zaman';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
import TransactionModal from '../../layouts/Modal/TransactionModal';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { Sidebar } from '../../layouts/Sidebar';
import { useAppSelector } from '../../services/store';
import { IService } from '../../types/types';
import tools from '../../utils/tools';
import roles = globalEnum.roles;

const Dashboard = () => {
  const serviceReducer = useAppSelector(state => state.serviceReducer)
  const [data, setData] = useState<IService[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [itemOffset, setItemOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState(0);
  const [workers, setWorkers] = useState([]);
  const [generalInfo, setGeneralInfo] = useState<any>({});
  const [generalWorkerId, setGeneralWorkerId] = useState<any>(0);
  const [workerInfo, setWorkerInfo] = useState({ id: 0, last1: 0, last7: 0, last30: 0 });
  const [dateRange, setDateRange] = useState({
    from: '1403/05/01',
    to: moment().format('jYYYY/jMM/jDD')
  });
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

  const fetchGeneralInfo = async () => {
    const res = await restApi(endpoints.dashboard.generalInfo).get({
      from: dateRange.from,
      to: dateRange.to,
      worker: generalWorkerId,
      service: selectedService
    })
    setGeneralInfo(res.data)
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
      restApi(endpoints.dashboard.sales, true).get({ service: selectedService ,worker: id, from: moment().subtract(1, 'd').format('jYYYY-jMM-jDD-HH-ss'), to: moment().format('jYYYY-jMM-jDD-HH-ss'), }),
      restApi(endpoints.dashboard.sales, true).get({ service: selectedService ,worker: id, from: moment().subtract(1, 'd').format('jYYYY-jMM-jDD-HH-ss'), to: moment().format('jYYYY-jMM-jDD-HH-ss'), }),
      restApi(endpoints.dashboard.sales, true).get({ service: selectedService ,worker: id, from: moment().subtract(1, 'd').format('jYYYY-jMM-jDD-HH-ss'), to: moment().format('jYYYY-jMM-jDD-HH-ss'), }),
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
    // fetchLogs();
    fetchData();
    fetchWorkerInfo(workerInfo.id)
    fetchGeneralInfo()
  }, []);

  useEffect(() => {
    if (searchParams.get('page')){
      setItemOffset(((Number(searchParams.get('page')) - 1) * itemsPerPage) % data.length)
    }
  }, [data]);

  return(
    <>
      <body className="dashboardBody">
      <Sidebar />
      <main className="accountingMain">
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
            <Select className="dashCardLog" value={{ label: [...workers, { id: 0, name: 'انتخاب ', lastName: 'کنید'}]?.find(e => e.id == workerInfo?.id)?.name + ' ' + [...workers, { id: 0, name: 'انتخاب ', lastName: 'کنید'}]?.find(e => e.id == workerInfo?.id)?.lastName, value: workerInfo?.id}} options={[...workers, { id: 0, name: 'انتخاب ', lastName: 'کنید'}]?.map(e => ({ label: `${e.name} ${e.lastName}`, value: e.id }))} onChange={(selected) => {
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
        <div className="dashCardContainer">
          <Select className="dashCardLog" value={{ label: [...workers, { id: 0, name: 'انتخاب ', lastName: 'همه'}]?.find(e => e.id == generalWorkerId)?.name + ' ' + [...workers, { id: 0, name: 'انتخاب ', lastName: 'همه'}]?.find(e => e.id == generalWorkerId)?.lastName, value: generalWorkerId}} options={[...workers, { id: 0, name: 'انتخاب ', lastName: 'همه'}]?.map(e => ({ label: `${e.name} ${e.lastName}`, value: e.id }))} onChange={(selected) => {
            setGeneralWorkerId(
               selected.value
            )
          }} />
          <Select className="dashCardLog" value={{ label: [...serviceReducer.services, { id: 0, title: 'انتخاب همه'}]?.find(e => e.id == selectedService)?.title , value: selectedService}} options={[...serviceReducer.services.filter(e => !e.parent), { id: 0, title: 'انتخاب همه'}]?.map(e => ({ label: e.title, value: e.id }))} onChange={(selected) => {
            setSelectedService(
               selected.value
            )
          }} />
          <div>
            <DatePicker inputClass="editProductInput" defaultValue={moment(dateRange?.to, 'jYYYY/jMM/jDD').toDate()} onChange={(e) => setDateRange(prev => ({ ...prev, to: moment(e.value.valueOf()).format('jYYYY/jMM/jDD') }))} />
            <label className="sideBarTitle">از</label>
            <DatePicker inputClass="editProductInput" defaultValue={moment(dateRange?.from, 'jYYYY/jMM/jDD').toDate()} onChange={(e) => setDateRange(prev => ({ ...prev, from: moment(e.value.valueOf()).format('jYYYY/jMM/jDD') }))} />
            <label className="sideBarTitle">تا</label>
          </div>
          <span className="dashboardHeader keepRight clickable" onClick={() => fetchGeneralInfo()} >
              ثبت
            </span>
          <h2>گذشته</h2>
          <div className="dashCard">
            <span>سهم شرکت</span>
            <span>
                {tools.formatPrice(generalInfo?.past?.profit)}
              </span>
          </div>
          <div className="dashCard">
            <span>سهم زیباکار</span>
            <span>
                {tools.formatPrice(generalInfo?.past?.worker)}
              </span>
          </div>
          <div className="dashCard">
            <span>درآمد کل</span>
            <span>
                {tools.formatPrice(generalInfo?.past?.all)}
              </span>
          </div>
          <h2>آینده</h2>
          <div className="dashCard">
              <span>سهم شرکت</span>
            <span>
                {tools.formatPrice(generalInfo?.future?.profit)}
              </span>
          </div>
          <div className="dashCard">
              <span>سهم زیباکار</span>
            <span>
                {tools.formatPrice(generalInfo?.future?.worker)}
              </span>
          </div>
          <div className="dashCard">
            <span>درآمد کل</span>
            <span>
                {tools.formatPrice(generalInfo?.future?.all)}
              </span>
          </div>
          </div>
      </main>
      </body>
    </>
  )
}
export default Dashboard;