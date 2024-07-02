import moment from 'jalali-moment';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { Sidebar } from '../../layouts/Sidebar';
import { IService } from '../../types/types';
import tools from '../../utils/tools';

const Color = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 25;
  const endOffset = itemOffset + itemsPerPage;
  let currentItems = data.filter(e => e.title?.toLowerCase()?.includes(query.toLowerCase()))?.slice(itemOffset, endOffset);
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

    currentItems.filter(e => e.title.toLowerCase()?.includes(query.toLowerCase()))?.map((service: any, index) => {
      rows.push(
        <tr className="dashTr2">
          <td className="">
            <i className="trash clickable" onClick={() => deleteItem(service.id)}></i>
            <i className="edit clickable" onClick={() => navigate('/color/edit/' + service.id)}></i>
          </td>
          <td className="">
            <p>{moment(service?.updatedAt).format('jYYYY/jMM/jDD')}</p>
            <p>{moment(service?.updatedAt).format('HH:ss')}</p>
          </td>
          <td>{service?.code}</td>
          <td>
            <span style={{ backgroundColor: service.code }} className="colorBox"/>
          </td>
          <td className="">{service?.title}</td>
          <td>{++index}</td>
        </tr>
      )
    })

    return rows;
  };

  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.color.index, true).get();

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
        <h1 className="dashBoardTitle">لیست رنگ ها</h1>
        <div className="searchContainer">
          <div className="keepRight svgContainer">
          <span className="dashboardHeader clickable" onClick={() => navigate('/color/add')}>
            <p>افزودن رنگ جدید</p>
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
          <th className="">
            <p> آخرین ویرایش</p>
            <i className="upDown"></i>
          </th>
          <th>کد رنگ</th>
          <th>رنگ</th>
          <th className="">عنوان</th>
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
export default Color