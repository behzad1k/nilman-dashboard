import moment from 'jalali-moment';
import { LegacyRef, ReactElement, useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import useTicker from '../../hooks/useTicker';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import { orders } from '../../services/reducers/userSlice';
import restApi from '../../services/restApi';
import tools from '../../utils/tools';
import { Sidebar } from "../../layouts/Sidebar"
import Derham from '../Dashboard/Modal/Derham';
import Excel from '../Dashboard/Modal/Excel';
import Bill from './Bill';
import Status from './Status';
import BillDetail from './\u200CBillDetail';

const Orders = () => {
  const [data, setData] = useState<any>([]);
  const [statuses, setStatuses] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedForExcel, setSelectedForExcel] = useState([]);
  const downloadExcelLink = useRef<HTMLAnchorElement>(null);
  const itemsPerPage = 25;
  const endOffset = itemOffset + itemsPerPage;
  let currentItems = data?.filter(e => e.code.toLowerCase().includes(query.toLowerCase())).slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data?.length / itemsPerPage)
  const dispatch = useDispatch();
  const { ticker } = useTicker();
  const navigate = useNavigate();
  const tabTitles = {
    all: 'همه',
    process: 'در حال پردازش',
    canceled: 'لغو شده',
    sent: 'ارسال شده',
    wait: 'در انتظار',
  }

  const deleteOrder = async (id: number) => {
    if(confirm('آیا مطمئن هستید؟')){
      dispatch(setLoading(true));

      const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/' + id, true).delete({});

      if(res.code == 204){
        Swal.fire({
          title: 'موفق',
          text: 'سفارش با موفقیت حذف شد',
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
    }
  };

  const sendForExcel = async () => {
    // if(confirm('آیا مطمئن هستید؟')){
      dispatch(setLoading(true));

      const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/excel' , true).post({ orders: selectedForExcel});
      if(res?.code == 200){
        if (downloadExcelLink.current) {
          downloadExcelLink.current.href = res.data.link;
          downloadExcelLink.current.click();
        }
      }

      dispatch(setLoading(false));
    // }
  };

  const list = () => {
    const rows: ReactElement[] = [];

    currentItems?.filter((e) => e.code.includes(query)).filter((e: any) => {
      switch (tab){
        case('process'):
          return e.status == 8;
        case('canceled'):
          return e.status == 10;
        case('sent'):
          return e.status == 9;
        case('wait'):
          return [2,4,7].includes(e.status)
        default: return true;
      }
    }).sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix()).map((order: any, index) => {
      rows.push(
        <tr className="dashTr2" key={'order' + index}>
          <td className="svgContainer">
            {/* <i className="trash clickable" onClick={() => deleteOrder(order.id)}></i> */}
            <i className="edit clickable" onClick={() => navigate('/order/edit/' + order.id)}></i>
            <i className="usersSvg clickable" onClick={() => dispatch(popupSlice.middle(<Bill order={order} workers={workers.filter(e => e.serviceId == order.serviceId)}/> ))}></i>
          </td>
          <td className="">{tools.formatPrice(order.price)}</td>
          <td>
            {/* <select className="" onChange={(input) => dispatch(popupSlice.middle(<Status order={order} status={input.target.value}/>))}> */}
            {/*   {statuses?.map((status) => <option value={status.id} selected={status.id == order.status}>{status.title}</option>)} */}
            {/* </select> */}
            {order.status}
          </td>
          <td className="">{order?.user?.name}</td>
          <td className="">
            <p>{moment(order?.createdAt).format('jYYYY/jMM/jDD HH:MM')}</p>
          </td>
          <td className="">{order?.code}</td>
        </tr>
      )
    })

    return rows;
  };

  const fetchData = async () => {
    dispatch(setLoading(true));

    await Promise.all([
      await restApi(endpoints.order.index, true).get(),
      await restApi(endpoints.user.index, true).get({ type: 'worker'}),
      await restApi(process.env.REACT_APP_BASE_URL + '/order/status', true).get(),
    ]).then((res) => {
      setData(res[0].data);
      setWorkers(res[1].data);
      setStatuses(res[1].data);
    })

    dispatch(setLoading(false));
  };
  console.log(workers);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <body className="dashboardBody">
     <Sidebar />
      <main className="dashBoardMain">
        <h1 className="dashBoardTitle">سفارش ها</h1>
        <div className="dashTabs">
          {Object.entries(tabTitles).map(([key, value]) =>
            <span className={`ordersTag ${key == tab ? 'activeTab' : ''}`} onClick={() => setTab(key)}>
            {value}
            <span className={`numberTag ${key == tab ? 'activeTab' : ''}`}>{data?.filter((e: any) => {
              switch (key){
                case('process'):
                  return e.status == 8;
                case('canceled'):
                  return e.status == 10;
                case('sent'):
                  return e.status == 9;
                case('wait'):
                  return [2,4,7].includes(e.status)
                default: return true;
              }
            }).length}</span>
          </span>
          )}
        </div>
        <div className="searchContainer">
          <span className="backSpan keepRight">
          {/*  <span className="dashboardHeader clickable" onClick={() => dispatch(popupSlice.middle(<Excel />))}> */}
          {/*   <p>بارگزاری فایل اکسل</p> */}
          {/*   <i className="exelSvg"></i> */}
          {/* </span> */}
          {/*   <span className="dashboardHeader clickable" onClick={() => sendForExcel()}> */}
          {/*   <p>خروجی اکسل از خدمات انتخابی</p> */}
          {/*   <i className="exelSvg"></i> */}
          {/*     <a href="#" ref={(downloadExcelLink as any)} download="orderExcel.xlsx"></a> */}
          {/* </span> */}
          {/* <span className="dashboardHeader clickable" onClick={() => dispatch(popupSlice.middle(<Derham />))}> */}
          {/*   <p>قیمت روز درهم</p> */}
          {/*   <i className="derhamSvg"></i> */}
          {/* </span> */}
            </span>
          <div className="dashboardseaechBox">
            <i className="dashMagnifierIcon"></i>
            <input className="dashSearchInput" placeholder="جستجو" onChange={(input: any) => setQuery(input.target.value)}></input>
          </div>
        </div>
        <table>
          <thead>
          <tr className="dashTr1 blueText">
            <th>عملیات</th>
            <th className="">مبلغ کل</th>
            <th className="">وضعیت سفارش</th>
            <th>کاربر</th>
            <th className="">تاریخ</th>
            <th>شماره سفارش</th>
          </tr>
          </thead>
          {list()}
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel="بعدی >"
          onPageChange={(event) => setItemOffset((event.selected * itemsPerPage) % data.length)}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< قبلی"
          renderOnZeroPageCount={null}
          className="pagination"
          pageClassName="paginationBreak"
          previousClassName="paginationBreak"
          nextClassName="paginationBreak"
          activeClassName="paginationActive"
        />
      </main>
      </body>
    </>
  )
}
 export default Orders