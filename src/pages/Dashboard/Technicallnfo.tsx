const Technicallnfo = () =>{
  return(
    <>
      <body className="dashboardBody">
      <aside className="sideBarContainer">
        <div className="sideBar">
          <div className="pic"></div>
          <i className="basketSvg"></i>
          <i className="productSvg activSvg"></i>
          <i className="usersSvg"></i>
          <i className="menuSvg"></i>
          <i className="infoSvg"></i>
          <i className="sidBarExit"></i>
        </div>
        <div className="adminInfoContainer">
      <span className="admininfo">
        <i className="adminSvg"></i>
        <div className="adminNameSection">
          <h6 className="adminName">احمد مزینانی</h6>
          <p className="adminTitle">ادمین</p>
        </div>
      </span>
          <p className="sideBarTitle">سفارشات</p>
          <p className="sideBarTitle">خدمات</p>
          <p className="sideBarTitle">کاربران</p>
          <p className="sideBarTitle">منوها</p>
          <p className="sideBarTitle activeTitle">مشخصات فنی</p>
          <span className="sideBarTitle1">لیست مشخصات فنی</span>
          <span className="sideBarTitle1">دسته بندی مشخصات</span>
        </div>
      </aside>
      <main className="dashBoardMain">
        <h1 className="dashBoardTitle">لیست مشخصات فنی</h1>
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
            <td className="amount">مقدار مشخصه</td>
            <td>عنوان مشخصه</td>
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
export default Technicallnfo