import { useNavigate } from 'react-router-dom';
import globalEnum from '../enums/globalEnum';
import { useAppSelector } from '../services/store';
import roles = globalEnum.roles;

const Root = () => {
  const user = useAppSelector(state => state.userReducer.profile)
  const navigate = useNavigate()

  if (user.role == roles.SUPER_ADMIN){
    navigate('/dashboard')
  } else if (user.role == roles.OPERATOR){
    navigate('/order')
  } else {
    navigate('/login')
  }

  return <></>
}

export default Root;