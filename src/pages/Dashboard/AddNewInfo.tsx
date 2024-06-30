import { Sidebar } from "../../layouts/Sidebar";

const AddNewInfo = () =>{
  return(
    <>
      <body className="dashboardBody">
      <Sidebar />
      <main className="dashBoardMain main">
        <div className="addInfoHeader">
          <span className="dashboardHeader keepRight">
            <p>ایجاد مشخصه</p>
          </span>
          <span>
            <h1 className="sideBarTitle">بازگشت به صفحه لیست مشخصات فنی</h1>
             <h1 className="dashBoardTitle">لیست مشخصات فنی</h1>
          </span>
          <i className="backAdd"></i>
        </div>
        <section className="bottomSection">
        <h1 className="dashBoardTitle">اطلاعات مشخصه</h1>
          <form className="addInfo">
            <label className="sideBarTitle" htmlFor="infoTitle">عنوان مشخصه</label>
            <input className="addInput" id="infoTitle"/>
            <label className="sideBarTitle" htmlFor="infoAmount">مقدار مشخصه</label>
            <span className="iconInput">
              <input className="addInput" placeholder="مقدار شماره یک" id="infoAmount" />
            </span>
            <span className="inputContainer">
              <span className="addNewButton">
                <p>افزودن مقدار جدید</p>
                <i className="plusIcon"></i>
              </span>
              <input className="addInput"/>
            </span>
          </form>
        </section>
      </main>
      </body>
    </>
  )
}
export default AddNewInfo