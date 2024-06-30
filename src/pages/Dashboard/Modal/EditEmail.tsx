import { popupSlice } from "../../../services/reducers";
import { useDispatch } from "react-redux";
import SendCode from "./SendCode";
const EditPhoneNumber=() =>{
  const dispatch=useDispatch()
  
  return(
    <main className="EditPhoneNumber">
      <div className="payDetail">
        <i className="modalExit"></i>
        <p>ویرایش ایمیل</p>
      </div>
      <p>ایمیل جدید خود را وارد کنید</p>
      <input className="phoneInput"/>
      <span className="pay width100" onClick={()=>dispatch(popupSlice.middle(<SendCode />))}>ارسال کد</span>
    </main>
  )
}
export default EditPhoneNumber