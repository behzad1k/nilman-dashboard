import 'swiper/css';
import 'swiper/css/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import endpoints from '../../config/endpoints';
import cookieEnum from '../../enums/cookieEnum';
import { setLoading } from '../../services/reducers/homeSlice';
import { fetchProfile } from '../../services/reducers/userSlice';
import restApi from '../../services/restApi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const send = async () => {
    dispatch(setLoading(true));

    const res = await restApi(endpoints.login).post({
      username: username,
      password: password
    });

    dispatch(setLoading(false));
    console.log(res);
    if (res.code == 200){
      Cookies.set('adminToken', res.data);
      navigate('/service/');
      dispatch(fetchProfile());
    }
  };

  useEffect(() => {
    if (Cookies.get('adminToken')){
      navigate('/service')
    }
  }, []);

  return (
    <section className="loginPage">
      <div className="loginImageContainer">
        {/* <img src="/img/Login1.jpg" className="loginImage"/> */}
      </div>
      <div className="LoginInfoSection">
        <div className="loginheader">
          {/* <img src="/img/logo.png"/> */}
          <h1 className="loginTextName">Nilman</h1>
        </div>
        <div className="loginBoxSection">
          <label className="loginInfo" htmlFor="username">نام کاربری</label>
          <input className="inputBox" id="username" onChange={(input: any) => setUsername(input.target.value)} />
          <label className="loginInfo marginTop" htmlFor="password">رمز ورود</label>
          <input className="inputBox" type="password" onChange={(input: any) => setPassword(input.target.value)} id="password"/>
          {/* <a className="forgotPassword">رمز خود را فراموش کرده اید؟</a> */}
          <span className="loginButtom" onClick={send}>ورود</span>
        </div>
      </div>
    </section>
  );
};
export default Login;