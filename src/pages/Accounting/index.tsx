import moment from 'jalali-moment';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import globalEnum from '../../enums/globalEnum';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { Sidebar } from '../../layouts/Sidebar';
import { IService } from '../../types/types';
import tools from '../../utils/tools';
import roles = globalEnum.roles;

const Accounting = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [itemOffset, setItemOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 25;
  const endOffset = itemOffset + itemsPerPage;
  let currentItems = data.filter(e => (e.name + ' ' + e.lastName)?.toLowerCase()?.includes(query.toLowerCase()))?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deleteItem = async (id: number) => {
    if(confirm('آیا مطمئن هستید؟')){
      dispatch(setLoading(true));

      const res = await restApi(endpoints.color.index + id).delete({});
      if(res.code == 200){
        Swal.fire({
          title: 'موفق',
          text: 'رنگ با موفقیت حذف شد',
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

    currentItems?.map((worker: any, index) => {
      rows.push(
        <tr className="dashTr2">
          <td className="">
            <i className="trash clickable" onClick={() => deleteItem(worker.id)}></i>
            <i className="edit clickable" onClick={() => navigate('/accounting/edit/' + worker.id)}></i>
          </td>
          <td className="">
            {worker.services?.find(e => !e.parent)?.title}
          </td>
          <td>{worker?.phoneNumber}</td>
          <td className="">{worker?.name + ' ' + worker.lastName}</td>
          <td>{++index}</td>
        </tr>
      )
    })

    return rows;
  };
  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.user.index, true).get({ role: roles.WORKER, relations: 'service' });

    if(res.code == 200){
      setData(res.data);
    }

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

  return(
    <>
      <body className="dashboardBody">
      <Sidebar />
      <main className="dashBoardMain">
        <h1 className="dashBoardTitle">لیست استایلیست ها</h1>
        <div className="searchContainer">
          <div className="keepRight svgContainer">
          <span className="dashboardHeader clickable" onClick={() => navigate('/color/add')}>
            <p>افزودن استایلیست جدید</p>
            <i className="addPlus"></i>
          </span>
          </div>
          <div className="dashboardseaechBox">
            <i className="dashMagnifierIcon"></i>
            <input className="dashSearchInput" placeholder="جستجو" onChange={(input) => setQuery(input.target.value)} />
          </div>
        </div>
      <table>
        <thead>
        <tr className="dashTr1">
          <th className="">عملیات</th>
          <th>تخصص</th>
          <th>شماره تماس</th>
          <th className="">نام و نام خانوادگی</th>
          <th>ردیف</th>
        </tr>
        </thead>
        <tbody>
        {list()}
        </tbody>
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
export default Accounting