const format = (endpoint, admin = true) => {
  return `${process.env.REACT_APP_BASE_URL}${admin ? '/admin': ''}/${endpoint}/`
};
const endpoints = {
  login: format('login'),
  service: {
    index: format('service'),
    single: format('service/single'),
    basic: format('service/basic'),
    medias: format('service/medias'),
    client: format('service', false)
  },
  order:{
    index: format('order'),
    single: format('order/single'),
    assign: format('order/assign'),
  },
  user:{
    index: format('user'),
    single: format('order/single'),
  }
}

export default endpoints;
