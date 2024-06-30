const SendCode =()=>{
  return(
    <main className="sendCode">
      <div className="payDetail">
        <i className="modalExit"></i>
        <p>ویرایش شماره همراه</p>
      </div>
      <p>کد ارسال شده به شماره همراه خود را وارد کنید</p>
      <span className="svgText">
        <i className="editNum"></i>
        <p>۰۹۱۲۵۴۵۸۰۹۲</p>
      </span>
      <div className="inputCode">
        <input className="borderZero"/>
        <input/>
        <input/>
        <input/>
        <input/>
        <input/>
      </div>
      <div className="svgText">
        <p>ارسال مجدد تا ۱:۵۹ ثانیه دیگر</p>
        <i className="refresh"></i>
      </div>
      <button className="pay width100">ثبت</button>
    </main>
  )
}
export default SendCode