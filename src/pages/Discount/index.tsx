import moment from 'jalali-moment';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { Sidebar } from '../../layouts/Sidebar';
import { IService } from '../../types/types';
import tools from '../../utils/tools';

const Discount = () => {
  const [data, setData] = useState<IService[]>([]);
  const [query, setQuery] = useState('');
  const [itemOffset, setItemOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
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

    const res = await restApi(endpoints.discount.index, true).get();

    if(res.code == 200){
      setData(res.data);
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
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
      <main className="dashBoardMain">
        <h1 className="dashBoardTitle">لیست تخفیف ها</h1>
        <div className="searchContainer">
          <div className="keepRight svgContainer">
          <span className="dashboardHeader clickable" onClick={() => navigate('/service/add')}>
            <p>افزودن تخفیف جدید</p>
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
          <th>استفاده</th>
          <th>درصد</th>
          <th className="">مقدار</th>
          <th>کد</th>
          <th className="">
            <p>برای کاربر</p>
            <i className="upDown"></i>
          </th>
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
          onPageChange={(event) => {
            setSearchParams({['page']: (Number(event.selected) + 1).toString()})
            setItemOffset((event.selected * itemsPerPage) % data.length);
          }}
          initialPage={searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0}
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
export default Discount;