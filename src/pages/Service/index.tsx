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
import { useAppSelector } from '../../services/store';
import { IService } from '../../types/types';
import tools from '../../utils/tools';

const Service = () => {
  const [data, setData] = useState<IService[]>([]);
  const [query, setQuery] = useState('');
  const [itemOffset, setItemOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState('all');
  const itemsPerPage = 25;
  const endOffset = (itemOffset || 0) + itemsPerPage;
  const filteredData = data.filter(e => e.title?.toLowerCase()?.includes(query.toLowerCase())).filter(e => {
    if (tab != 'all'){
      const ancs = tools.findAncestors(data, e.id)
      if (ancs.length > 0){
        return tab == ancs.reverse()[0]?.slug
      }
      return false;
    }
    return true
  });
  let currentItems = filteredData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabTitles, setTabTitles] = useState({
    all: 'همه',
  })

  const deleteItem = async (id: number) => {
    if(confirm('آیا مطمئن هستید؟')){
      dispatch(setLoading(true));

      const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/service/' + id, true).delete({});
      if(res.code == 200){
        Swal.fire({
          title: 'موفق',
          text: 'خدمت با موفقیت حذف شد',
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
            <a href={'/service/edit/' + service.id}><i className="edit clickable"></i></a>
          </td>
          <td>{service?.section}</td>
          <td className="">{service?.hasColor ? 'دارد' : 'ندارد'}</td>
          <td>{tools.formatPrice(service?.price) || '-'}</td>
          <td className="">
            <p>{moment(service?.updatedAt).format('jYYYY/jMM/jDD')}</p>
            <p>{moment(service?.updatedAt).format('HH:ss')}</p>
          </td>
          <td className="">{tools.findAncestors(data, service.id).reverse().filter((e, index) => e && index < 2).reduce((acc, curr) => acc + ' -> ' + curr.title, '')}</td>
          <td className="">{service?.title}</td>
          <td>
            <img src={service?.media?.url} className="width100p"/>
          </td>
          <td>{((searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0) * itemsPerPage) + ++index}</td>
        </tr>
      )
    })

    return rows;
  };

  const fetchData = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.service.client, true).get();

    if(res.code == 200){
      const formatedData = [];
      const tabs: any = {}
      res.data.filter(e => e?.price == 0).map(e => {
        tabs[e.slug] = e.title;
      })
      setTabTitles(prev => ({ ...prev, ...tabs }))
      res.data.map(e => tools.extractChildren(e, formatedData))
      setData(formatedData);
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
        <h1 className="dashBoardTitle">لیست خدمات</h1>
        <div className="dashTabs">
          {Object.entries(tabTitles).map(([key, value]) =>
              <span className={`ordersTag clickable ${key == tab ? 'activeTab' : ''}`} onClick={() => setTab(key)}>
            {value}
                <span className={`numberTag ${key == tab ? 'activeTab' : ''}`}>{data?.filter((e: any) => {
                  if (key != 'all'){
                    const ancs = tools.findAncestors(data, e.id)
                    if (ancs.length > 0){
                      return key == ancs.reverse()[0]?.slug
                    }
                    return false;
                  }
                  return true
                }).length}</span>
          </span>
          )}
        </div>
        <div className="searchContainer">
          <div className="keepRight svgContainer">
          <span className="dashboardHeader clickable" onClick={() => navigate('/service/add')}>
            <p>افزودن خدمت جدید</p>
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
          <th>سانس</th>
          <th className="">رنگ</th>
          <th>قیمت</th>
          <th className="">
            <p> آخرین ویرایش</p>
            <i className="upDown"></i>
          </th>
          <th className="">والد</th>
          <th className="">عنوان</th>
          <th>عکس</th>
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
export default Service