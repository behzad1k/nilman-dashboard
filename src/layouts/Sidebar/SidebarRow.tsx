import { useState } from "react";

const SidebarRow = ({ title, url, children }: any) => {
  const [showChildren, setShowChildren] = useState(false);
  
  return(
    <>
      {children ?
        <>
          <p className="sideBarTitle activeTitle" onClick={() => setShowChildren(!showChildren)}>{title}</p>
          {showChildren && children.map((subMenu) =>
            <a href={subMenu.url}>
              <p className="sideBarTitle1">{subMenu.title}</p>
            </a>
          )}
        </>
        :
        <a href={url} className="textDecorationNone">
          <p className="sideBarTitle">{title}</p>
        </a>
      }
    </>
  )
}
export default SidebarRow