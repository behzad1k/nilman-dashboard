import moment from 'jalali-moment';
import ReactPaginate from 'react-paginate';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
import useUrlParam from '../../hooks/useUrlParam';
import { Sidebar } from "../../layouts/Sidebar";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../services/reducers/homeSlice';
import { services } from '../../services/reducers/serviceSlice';
import restApi from '../../services/restApi';

import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from "sweetalert2";
import { useAppSelector } from '../../services/store';
import tools from '../../utils/tools';
import usePagination from "../../hooks/usePagination";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<any>([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState(searchParams.get('tab') || 'all');
  const serviceReducer = useAppSelector(state => state.serviceReducer)
  const { pageCount, endOffset, itemOffset, itemsPerPage, setPageCount, setItemOffset, setItemsPerPage } = usePagination(data)

  const tabTitles = {
    all: 'همه',
    USER: 'کاربران عادی',
    WORKER: 'زیباکار ها',
    OPERATOR: 'اپراتور ها',
    SUPER_ADMIN: 'ادمین ها',
  }

  const deleteItem = async (id: number) => {
    if(confirm('آیا مطمئن هستید؟')) {
      dispatch(setLoading(true));
      
      const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user/' + id, true).delete({});
      
      if(res.code == 204) {
        Swal.fire({
          title: 'موفق',
          text: 'کاربر با موفقیت حذف شد',
          icon: 'success',
          confirmButtonText: 'متوجه شدم'
        })
        fetchData()
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
  }
  const changeStatus = async (id, status) => {
    if(confirm('آیا مطمئن هستید؟')) {
      dispatch(setLoading(true));

      const res = await restApi(endpoints.user.active + id, true).post({
        status: status == 1 ? 0 : 1
      });

      if(res.code == 200) {
        Swal.fire({
          title: 'موفق',
          text: `کاربر با موفقیت ${status == 0 ? 'فعال' : 'غیرفعال'} شد`,
          icon: 'success',
          confirmButtonText: 'متوجه شدم'
        })
        fetchData()
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
  }

  const list = () => {
    const rows = [];
    
    data?.users?.map((user: any, index) => {
      const userServices: any = {}
      user.services?.map(e => {
        const ancs = tools.findAncestors(serviceReducer.services, e.id)?.reverse()
        if (ancs.length) {
          userServices[ancs[0]?.title] = true;
        }
      })
      rows.push(
        <tr className="dashTr2">
          <td className="svgContainer">
            <i className={`${user.status == 1 ? 'activeUser' : 'deactiveUser'}`} onClick={() => changeStatus(user.id, user.status)}></i>
            <i className="trash clickable" onClick={() => deleteItem(user.id)}></i>
            <i className="edit clickable" onClick={() => navigate('/user/edit/' + user.id)}></i>
          </td>
          <td className="">{user.lastEntrance && moment(user.lastEntrance).format('jYYYY/jMM/jDD')}</td>
          <td className="">{tab == 'worker' ? Object.keys(userServices).reduce((acc, curr, index) => acc + curr + (index == 0 ? '' : ', ') ,'') : user.tmpCode}</td>
          <td className="">{(user.name || '') + ' ' + (user.lastName || '')}</td>
          <td className="">{user.phoneNumber}</td>
          <td>{((searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0) * itemsPerPage) + ++index}</td>
        </tr>
      )
    })
    
    return rows;
  };
  
  const fetchData = async () => {
    !query && dispatch(setLoading(true));

    const params: any = {
      page: searchParams.get('page') || 1,
      perPage: itemsPerPage,
      query: query,
    }
    if (tab != 'all'){
      params.role = tab
    }
    await Promise.all([
      await restApi(endpoints.user.index, true).get(params),
    ]).then((res) => {
      setData(res[0].data);
    })

    !query && dispatch(setLoading(false));
  };
  
  useEffect(() => {
    fetchData();
  }, [searchParams.get('page'), itemsPerPage, query, tab]);

  // useEffect(() => {
  //   setSearchParams({ ['page']: searchParams.get('page'), ['tab']: tab })
  // }, [tab]);

  useEffect(() => {
    if (data.count) {
      const newPage = Number(searchParams.get('page')) <= Math.ceil(data.count / itemsPerPage) ? searchParams.get('page') || '1' : '1';
      setSearchParams({
        ['page']: newPage,
        ['tab']: tab
      })
    }
  }, [data]);
  return(
    
    <>
      <body className="dashboardBody">
      <Sidebar />
      <main className="dashBoardMain">
        <h1 className="dashBoardTitle">لیست کاربران</h1>
        <div className="dashTabs">
          {Object.entries(tabTitles).map(([key, value]) =>
            <span className={`ordersTag clickable ${key == tab ? 'activeTab' : ''}`} onClick={() => {
              setTab(key);
              setSearchParams({ ['page']: '1', ['tab']: tab })
            }}>
            {value}
              {data?.rolesCount && <span className={`numberTag ${key == tab ? 'activeTab' : ''}`}>{data?.rolesCount[key]?.count}</span>}
          </span>
          )}
        </div>
        <div className="searchContainer">
          <span className="dashboardHeader clickable" onClick={() => navigate('/user/add')}>
            <p>افزودن کاربر جدید</p>
            <i className="addPlus"></i>
          </span>
          <div className="dashboardseaechBox">
            <i className="dashMagnifierIcon"></i>
            <input className="dashSearchInput" placeholder="جستجو" onChange={(input: any) => setQuery(input.target.value)}></input>
          </div>
        </div>
        <table>
          <thead>
          <tr className="dashTr1">
            <th>عملیات</th>
            <th>آخرین ورود</th>
              <th>{tab == 'worker' ? 'لاین خدمت دهی' :'آخرین کد ورود'}</th>
            <th>نام و نام خانوادگی</th>
            <th>شماره موبایل</th>
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
export default UsersList;