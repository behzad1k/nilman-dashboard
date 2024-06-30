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
  
  const deleteItem = async (id: number) => {
    if(confirm('آیا مطمئن هستید؟')) {
      dispatch(setLoading(true));
      
      const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user/' + id, true).delete({});
      
      if(res.code == 200) {
        Swal.fire({
          title: 'موفق',
          text: 'کاربر با موفقیت حذف شد',
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
  }
  const list = () => {
    const rows = [];
    
    data.filter((user:any) => user.name.toLowerCase().includes(query.toLowerCase())).map((user: any, index) => {
      rows.push(
        <tr className="dashTr2">
          <td className="svgContainer">
            <i className="activeUser"></i>
            <i className="trash clickable" onClick={() => deleteItem(user.id)}></i>
            <i className="edit clickable" onClick={() => navigate('/dashboard/user/edit/' + user.id)}></i>
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
    console.log(res)
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
        <div className="searchContainer">
          <span className="dashboardHeader clickable" onClick={() => navigate('/dashboard/user/add')}>
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
      </main>
      </body>
    </>
  )
}
export default UsersList;