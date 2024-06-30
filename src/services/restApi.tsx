import Cookies from 'js-cookie';

const apiRequest = async (url: string, useToken = true, useOrderToken = false, method: string, body: any, headers: any) => {
  if (useToken) {
    const token = Cookies.get('adminToken');
    if (token){
      headers.Authorization = `Bearer ${token || ''}`;
    }
  }

  if (headers['content-type'] === 'application/json' && body) {
    body = JSON.stringify(body);
  }
  if (headers['content-type'] == 'image/jpeg'){
    return await fetch(url, {
      method: method,
      headers: headers,
    })
    .then(async (response: any) => {
      return await response.blob();
    })
    .catch(error => {
      console.log(error);
      return {};
    });
  }
  return await fetch(url, {
    method: method,
    headers: headers,
    body: (body !== '{}') ? body : undefined
  })
    .then(async (response: any) => {
      response.code = response.status
      return await response.json();
    })
    .catch(error => {
      console.log(error);
      return {};
    });
};

const restApi = (url: string, useAccessToken = true, useOrderToken = false) => {
  const get = (query: any = {}, headers = {}) => {
    if (!headers['content-type']) {
      headers['content-type'] = 'application/json';
    }
    if (query !== '{}') {
      Object.entries(query).map(([key, value], index) => {
        url += (index == 0 ? '?' : '&') + key + '=' + value;
      });
    }
    return apiRequest(url, useAccessToken, useOrderToken, 'get', {}, headers);
  }

  const post = (body: any, headers = {}) => {
    headers['content-type'] = 'application/json';
    return apiRequest(url, useAccessToken, useOrderToken, 'post', body, headers);
  }

  const put = (body: any, headers = {}) => {
    headers['content-type'] = 'application/json';
    return apiRequest(url, useAccessToken, useOrderToken, 'put', body, headers);
  }

  const del = (body: any, headers = {}) => {
    headers['content-type'] = 'application/json';
    return apiRequest(url, useAccessToken, useOrderToken, 'delete', body, headers);
  }

  const upload = async (body: {} = {}, headers = {}, method = 'post') => {

    return apiRequest(url, useAccessToken, useOrderToken, method, body, headers);
  }

  return {
    upload,
    get,
    post,
    put,
    delete: del,
  }
}

export default restApi;