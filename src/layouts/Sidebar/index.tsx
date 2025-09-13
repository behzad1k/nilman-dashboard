import Cookies from 'js-cookie';
import { useAppSelector } from "../../services/store";
import SidebarRow from "./SidebarRow";

export const Sidebar = () => {
  const userReducer = useAppSelector(state => state.userReducer);
  const logout = () => {
    Cookies.remove('adminToken');
    window.location.reload();
  };
  return (
    <aside className="sideBarContainer">
      <div className="sideBar">
        <div className="pic"></div>
        <i className="basketSvg"></i>
        <i className="productSvg activSvg"></i>
        <i className="usersSvg activSvg"></i>
        <i className="categorySvg"></i>
        <i className="menuSvg"></i>
        {/* <i className="tagSvg"></i> */}
        {/* <i className="brandSvg"></i> */}
        {/* <i className="articleSvg"></i> */}
        {/* <i className="infoSvg"></i> */}
        <i className="sidBarExit" onClick={logout}></i>
      </div>
      <div className="adminInfoContainer">
      <span className="admininfo">
        <i className="adminSvg"></i>
        <div className="adminNameSection">
          <h6 className="adminName">{userReducer?.profile?.name}</h6>
          <p className="adminTitle">ادمین</p>
        </div>
      </span>

        <SidebarRow title="سفارشات" url="/order/"/>
        <SidebarRow title="کاربران" url="/User"/>
        {userReducer?.profile?.role == 'SUPER_ADMIN' &&
            <>
                <SidebarRow title="داشبورد" url="/"/>
                <SidebarRow title="خدمات" url="/Service"/>
                <SidebarRow title="رنگ ها" url="/Color"/>
                <SidebarRow title="حسابداری" url="/Accounting"/>
                <SidebarRow title="موارد بازخوردها" url="/FeedbackFactor"/>
                <SidebarRow title="تخفیف" url="/discount"/>
            </>
        }
        {/* <SidebarRow title="بازخوردها" url="/FeedbackFactor"/> */}
        {/* <SidebarRow title="مشخصات فنی" url="/Dashboard/Attribute" children={[ */}
        {/*   { */}
        {/*     title: "لیست مشخصات فنی", */}
        {/*     url: "/Dashboard/Attribute" */}
        {/*   }, */}
        {/*   { */}
        {/*     title: "دسته بندی مشخصات", */}
        {/*     url: "/Dashboard/AttributeGroup" */}
        {/*   }, */}
        {/*   { */}
        {/*     title: "لیست مقادیر مشخصات فنی", */}
        {/*     url: "/Dashboard/AttributeValue" */}
        {/*   } */}
        {/* ]}/> */}
        
      </div>
    </aside>
  );
};