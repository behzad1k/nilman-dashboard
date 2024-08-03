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
  feedbackFactors: {
    index: format('feedbackFactor'),
    single: format('feedbackFactor/single'),
    basic: format('feedbackFactor/basic'),
    medias: format('feedbackFactor/medias'),
  },
  order:{
    index: format('order'),
    single: format('order/single'),
    relatedWorkers: format('order/relatedWorkers'),
    assign: format('order/assign'),
  },
  user:{
    index: format('user'),
    single: format('user/single'),
    basic: format('user/basic'),
    medias: format('user/medias'),
    active: format('user/status'),
    workerOff: format('user/workerOff'),
  },
  address:{
    index: format('address'),
    single: format('address/single'),
    basic: format('address/basic'),
  },
  color:{
    index: format('color'),
    single: format('color/single'),
    basic: format('color/basic'),
  },
  discount:{
    index: format('discount'),
    single: format('discount/single'),
    basic: format('discount/basic'),
  },
  district:{
    index: format('district'),
    single: format('district/single'),
    basic: format('district/basic'),
  }
}

export default endpoints;
