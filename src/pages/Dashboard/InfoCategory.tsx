import { Sidebar } from "../../layouts/Sidebar";

const InfoCategory = () =>{
  return(
    <> <body className="dashboardBody">
   <Sidebar />
    <main className="dashBoardMain">
      <h1 className="dashBoardTitle">دسته بندی مشخصات</h1>
      <div className="searchContainer">
          <span className="dashboardHeader">
            <p>افزودن محصول جدید</p>
            <i className="addPlus"></i>
          </span>
        <div className="dashboardseaechBox">
          <i className="dashMagnifierIcon"></i>
          <input className="dashSearchInput" placeholder="جستجو"></input>
        </div>
      </div>
      <table>
        <tr className="dashTr1">
          <td className="amount">مشخصه ها</td>
          <td>عنوان گروه</td>
          <td>ردیف</td>
        </tr>
        <tr className="dashTr2">
          <td className="svgContainer marginAuto">
            <i className="trash"></i>
            <i className="edit"></i>
          </td>
          <td>Vinti BRECKEN-AT8525</td>
          <td>Vinti BRECKEN-AT8525</td>
          <td>1</td>
        </tr>
      </table>
    </main>
    </body>
    
    </>
  )
}
export default InfoCategory