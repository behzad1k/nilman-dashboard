import { LegacyRef, ReactElement, useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import usePagination from '../../hooks/usePagination';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import tools from '../../utils/tools';
import { Sidebar } from "../../layouts/Sidebar"
import Bill from './Bill';
import FeedbackModal from './FeedbackModal';
import Message from '../../layouts/Modal/Message';

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<any>([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState(searchParams.get('tab') || 'all');
  const { pageCount, endOffset, itemOffset, itemsPerPage, setPageCount, setItemOffset, setItemsPerPage } = usePagination(data)
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

    data.orders?.map((order: any, index) => {
      rows.push(
        <tr className="dashTr2" key={'order' + index}>
          <td className="svgContainer">
            <i className="trash clickable" onClick={() => deleteOrder(order.id)}></i>
            <i className="edit clickable" onClick={() => navigate('/order/edit/' + order.id)}></i>
            <i className="usersSvg clickable" onClick={() => dispatch(popupSlice.middle(<Bill order={order} /> ))}></i>
            <i className="messageIcon clickable" onClick={() => dispatch(popupSlice.middle(<Message user={order.user} /> ))}></i>
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
            <p>{order?.date + ' - ' + order?.fromTime}</p>
          </td>
          <td className="">{order?.code}</td>
          <td className="">{++index}</td>
        </tr>
      )
    })

    return rows;
  };

  const fetchOrders = async () => {
    dispatch(setLoading(true));

    const params: any = {
      page: searchParams.get('page') || 1,
      perPage: itemsPerPage,
      query: query
    }
    if (tab != 'all'){
      console.log('eee');
      params.status = tab
    }
    await Promise.all([
      await restApi(endpoints.order.index, true).get(params),
    ]).then((res) => {
      setData(res[0].data);
    })

    dispatch(setLoading(false));
  }

  useEffect(() => {
    fetchOrders();
  }, [searchParams.get('page'), itemsPerPage, query, tab]);

  // useEffect(() => {
  //   setSearchParams({ ['page']: searchParams.get('page'), ['tab']: tab })
  // }, [tab]);

  useEffect(() => {
    if (data.count) {
      const newPage = Number(searchParams.get('page')) <= Math.ceil(data.count / itemsPerPage) ? searchParams.get('page') : '1';
      console.log(newPage);
      console.log(data.count);
      console.log(Math.ceil(data.count / itemsPerPage));
      setSearchParams({
        ['page']: newPage,
        ['tab']: tab
      })
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
            <span className={`ordersTag clickable ${key == tab ? 'activeTab' : ''}`} onClick={() => {
              setTab(key);
              setSearchParams({ ['page']: '1', ['tab']: tab })
            }}>
            {value}
              {data?.statusCount && <span className={`numberTag ${key == tab ? 'activeTab' : ''}`}>{data?.statusCount[key]?.count}</span>}
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
          <div className='itemsPerPage'>
            <label htmlFor="itemPerPage">تعداد در صفحه</label>
            <input id='itemPerPage' defaultValue={itemsPerPage} onChange={(input) => input.target.value && Number(input.target.value) > 0 && setItemsPerPage(Number(input.target.value))}/>
          </div>
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
            <th>ردیف</th>
          </tr>
          </thead>
          {list()}
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel="بعدی >"
          onPageChange={(event) => {
            setSearchParams({['page']: (Number(event.selected) + 1).toString(), ['tab']: tab})
            setItemOffset((event.selected * itemsPerPage) % data.length);
          }}
          forcePage={Number(searchParams.get('page')) - 1}
          initialPage={searchParams.get('page') != null ? Number(searchParams.get('page')) - 1 : 0}
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