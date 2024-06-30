import { Sidebar } from '../../layouts/Sidebar';

const AddNewGroup = () => {

  return (
    <>
      <body className="dashboardBody">
      <Sidebar />
      <main className="dashBoardMain main">
        <div className="addInfoHeader">
          <span className="dashboardHeader keepRight">
            <p>ایجاد گروه</p>
          </span>
          <span>
            <h1 className="sideBarTitle">بازگشت به صفحه دسته بندی مشخصات</h1>
             <h1 className="dashBoardTitle">افزودن گروه جدید</h1>
          </span>
          <i className="backAdd"></i>
        </div>
        <section className="bottomSection">
          <h1 className="dashBoardTitle">اطلاعات گروه</h1>
          <form className="addInfo">
            <label className="sideBarTitle" htmlFor="infoTitle">عنوان گروه مشخصات</label>
            <input className="addInput" id="infoTitle"/>
            <label className="sideBarTitle" htmlFor="infoAmount">لیست مشخصات</label>
            <span className="iconInput downIcon">
              <input className="addInput" placeholder="-" id="infoAmount" />
            </span>
          </form>
        </section>
      </main>
      </body>
    </>
  )
}
export default AddNewGroup