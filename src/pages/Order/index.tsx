import moment from 'jalali-moment';
import { LegacyRef, ReactElement, useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
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
import FeedbackModal from './FeedbackModal';
import Status from './Status';
import BillDetail from './\u200CBillDetail';
import orderStatus = globalEnum.orderStatus;

const Orders = () => {
  const [data, setData] = useState<any>([]);
  const [workers, setWorkers] = useState([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [itemOffset, setItemOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 25;
  const endOffset = (itemOffset || 0) + itemsPerPage;
  const filteredData = data?.filter((e) => e.code.includes(query))?.filter((e: any) => {
    switch (tab){
      case('Paid'):
        return e.status == orderStatus.Paid;
      case('Canceled'):
        return e.status == orderStatus.Canceled;
      case('Done'):
        return e.status == orderStatus.Done;
      case('Assigned'):
        return e.status == orderStatus.Assigned;
      case('InProgress'):
        return e.status == orderStatus.InProgress;
      default: return true;
    }
  }).sort((a, b) => Number(b.code.split('-')[1]) - Number(a.code.split('-')[1]))?.filter(e => e.code.toLowerCase().includes(query.toLowerCase()));
  let currentItems = filteredData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredData?.length / itemsPerPage)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabTitles = {
    all: 'همه',
    Paid: 'پرداخت شده',
    Assigned: 'محول شده',
    InProgress: 'در حال انجام',
    Canceled: 'لغو شده',
    Done: 'تمام شده',
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

  const list = () => {
    const rows: ReactElement[] = [];

    currentItems.map((order: any, index) => {
      rows.push(
        <tr className="dashTr2" key={'order' + index}>
          <td className="svgContainer">
            <i className="trash clickable" onClick={() => deleteOrder(order.id)}></i>
            <i className="edit clickable" onClick={() => navigate('/order/edit/' + order.id)}></i>
            <i className="usersSvg clickable" onClick={() => dispatch(popupSlice.middle(<Bill order={order} /> ))}></i>
            {order.isFeedbacked && <i className="feedbackIcon clickable" onClick={() => dispatch(popupSlice.middle(<FeedbackModal order={order}/>))}></i>}
          </td>
          <td className="">{tools.formatPrice(order.finalPrice)}</td>
          <td>{order.worker ? `${order.worker?.name} ${order.worker?.lastName}` : '-'}</td>
          <td>{order.service?.title}</td>
          <td>
            {/* <select className="" onChange={(input) => dispatch(popupSlice.middle(<Status order={order} status={input.target.value}/>))}> */}
            {/*   {statuses?.map((status) => <option value={status.id} selected={status.id == order.status}>{status.title}</option>)} */}
            {/* </select> */}
            {order.status}
          </td>
          <td className="">{order?.user?.name + ' ' + order?.user?.lastName}</td>
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
      await restApi(endpoints.user.index, true).get({ role: 'WORKER'}),
      await restApi(process.env.REACT_APP_BASE_URL + '/order/status', true).get(),
    ]).then((res) => {
      setData(res[0].data?.filter(e => e.status != orderStatus.Created));
      setWorkers(res[1].data);
      // setStatuses(res[1].data);
    })

    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const curPage = searchParams.get('page')
    if (curPage){
      if (Number(curPage) > pageCount){
        setSearchParams({['page']: '1'})
        // searchParams.set('page', '1')
      }
      setItemOffset(((Number(searchParams.get('page')) - 1) * itemsPerPage) % data.length)
    }
  }, [data]);

  return (
    <>
      <body className="dashboardBody">
     <Sidebar />
      <main className="dashBoardMain">
        <h1 className="dashBoardTitle">سفارش ها</h1>
        <div className="dashTabs">
          {Object.entries(tabTitles).map(([key, value]) =>
            <span className={`ordersTag clickable ${key == tab ? 'activeTab' : ''}`} onClick={() => setTab(key)}>
            {value}
            <span className={`numberTag ${key == tab ? 'activeTab' : ''}`}>{data?.filter((e: any) => {
              switch (key){
                case('Paid'):
                  return e.status == orderStatus.Paid;
                case('Canceled'):
                  return e.status == orderStatus.Canceled;
                case('Done'):
                  return e.status == orderStatus.Done;
                case('Assigned'):
                  return e.status == orderStatus.Assigned;
                case('InProgress'):
                  return e.status == orderStatus.InProgress;
                default: return true;
              }
            }).length}</span>
          </span>
          )}
        </div>
        <div className="searchContainer">
          <span className="backSpan keepRight">
           <span className="dashboardHeader clickable" onClick={() => navigate('/order/add')}>
            <p>ثبت سفارش جدید</p>
            <i className="plusIcon"></i>
          </span>
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
            <th className="">استایلیست</th>
            <th className="">خدمت</th>
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
          onPageChange={(event) => {
            setSearchParams({['page']: (Number(event.selected) + 1).toString()})
            setItemOffset((event.selected * itemsPerPage) % data.length);
          }}
          initialPage={Number(searchParams.get('page')) - 1}
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