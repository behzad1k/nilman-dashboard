import ReactPaginate from 'react-paginate';
import globalEnum from '../../enums/globalEnum';
import { Sidebar } from "../../layouts/Sidebar";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UsersList = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 25;
  const endOffset = itemOffset + itemsPerPage;
  let currentItems = data.filter(e => e.name?.toLowerCase()?.includes(query.toLowerCase()) || e.phoneNumber?.toLowerCase()?.includes(query.toLowerCase()))?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const tabTitles = {
    all: 'همه',
    user: 'کاربران عادی',
    worker: 'زیباکار ها',
    operator: 'اپراتور ها',
    admin: 'ادمین ها',
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
  const list = () => {
    const rows = [];
    
    currentItems.filter((e: any) => {
      switch (tab){
        case('user'):
          return e.role == globalEnum.roles.USER;
        case('admin'):
          return e.role == globalEnum.roles.SUPER_ADMIN;
        case('worker'):
          return e.role == globalEnum.roles.WORKER;
        case('operator'):
          return e.role == globalEnum.roles.OPERATOR;
        default: return true;
      }
    })?.map((user: any, index) => {
      rows.push(
        <tr className="dashTr2">
          <td className="svgContainer">
            <i className="activeUser"></i>
            <i className="trash clickable" onClick={() => deleteItem(user.id)}></i>
            <i className="edit clickable" onClick={() => navigate('/user/edit/' + user.id)}></i>
          </td>
          <td className="">{user.lastEntrance}</td>
          <td className="">{user.email}</td>
          <td className="">{user.name}</td>
          <td className="">{user.phoneNumber}</td>
          <td className="">فعال</td>
          <td>{++index}</td>
        </tr>
      )
    })
    
    return rows;
  };
  
  const fetchData = async () => {
    dispatch(setLoading(true));
    
    const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user', true).get();

    if(res.code == 200){
      setData(res.data);
    }
    
    dispatch(setLoading(false));
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return(
    
    <>
      <body className="dashboardBody">
      <Sidebar />
      <main className="dashBoardMain">
        <h1 className="dashBoardTitle">لیست کاربران</h1>
        <div className="dashTabs">
          {Object.entries(tabTitles).map(([key, value]) =>
              <span className={`ordersTag ${key == tab ? 'activeTab' : ''}`} onClick={() => setTab(key)}>
            {value}
                <span className={`numberTag ${key == tab ? 'activeTab' : ''}`}>{data?.filter((e: any) => {
                  switch (key){
                    case('user'):
                      return e.role == globalEnum.roles.USER;
                    case('admin'):
                      return e.role == globalEnum.roles.SUPER_ADMIN;
                    case('worker'):
                      return e.role == globalEnum.roles.WORKER;
                    case('operator'):
                      return e.role == globalEnum.roles.OPERATOR;
                    default: return true;
                  }
                }).length}</span>
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
            <th> ایمیل</th>
            <th>نام و نام خانوادگی</th>
            <th>شماره موبایل</th>
            <th>وضعیت</th>
            <th>ردیف</th>
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
export default UsersList;