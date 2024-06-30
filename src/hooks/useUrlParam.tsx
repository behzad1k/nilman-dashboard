import { useNavigate, useSearchParams } from 'react-router-dom';

const useUrlParam = () => {
  const navigate = useNavigate();
  const pathname = ''
  const [searchParam, setSearchParam] = useSearchParams();

  const setUrlParam = (key, value) => {

    const current = new URLSearchParams(searchParam.toString());
      if (key?.includes('[]')){
        current.append(key, value);
      }
      else{
        current.set(key, value);
      }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    navigate(`${pathname}${query}`);
  }

  const setUrlParams = (entries: any[]) => {

    const current = new URLSearchParams(searchParam.toString());

    entries.map((e: any) => {
      if (e.key?.includes('[]')){
        current.append(e.key, e.value);
      }
      else{
        current.set(e.key, e.value);
      }
    })

    const search = current.toString();
    const query = search ? `?${search}` : "";
    navigate(`${pathname}${query}`);
  }

  const removeUrlParam = (key, value = undefined) => {
    const current = new URLSearchParams(searchParam.toString());

    if (value){
      // @ts-ignore
      current.delete(key, value);
    } else {
      while(current.has(key)) {
        current.delete(key);
      }
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    navigate(`${pathname}${query}`);
  };

  const removeUrlParams = (entries: any[]) => {
    const current = new URLSearchParams(searchParam.toString());

    entries.map((e: any) => {
      if (e.value !== undefined){
        // @ts-ignore
        current.delete(e.key, e.value);
      } else {
        current.delete(e.key)
      }
    })


    const search = current.toString();
    const query = search ? `?${search}` : "";
    navigate(`${pathname}${query}`);
  };

  return {
    removeUrlParams,
    removeUrlParam,
    setUrlParams,
    setUrlParam
  }
}
export default useUrlParam;
