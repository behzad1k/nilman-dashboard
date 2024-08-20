const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0
}

const formatPrice = (price: number = 1, min = 0, max = 8) => {
  if (!price) return 0;
  return price.toLocaleString('en-US', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
};

const findAncestors = (arr: any[], value: any, key: string = 'id') => {
  let obj = arr.find(e => e[key] == value);
  let ancestors = [obj];

  if (!obj?.parent){
    return ancestors;
  }

  while (obj?.parent){
    obj = arr.find(e => e[key] == obj?.parent?.id);
    ancestors.push(obj)
  }
  return ancestors;
}

const selectFormatter = (array: any[], value: string, label: string, firstOption: string = '') => {
  const newArray = [];

  if (firstOption){
    newArray.push({
      value: '',
      label: firstOption
    })
  }

  array?.length && Array.isArray(array) && array?.map(e => newArray.push({
    value: e[value],
    label: e[label]
  }))

  return newArray
};

const extractChildren = (node: any, array: any[], index: number = 0, depth = 0) => {
  ++depth;

  let newTitle = ''
  for (let i = 1; i < depth; i++) {
    newTitle += '-'
  }

  const j = { ...node, title: node.title + newTitle }

  array.push(j)

  if (j.attributes) {
    j.attributes.map(e => {
      return extractChildren(e, array, ++index, depth)
    })
  }
  return array;
}
const omit = (keys, obj) => {
  if (!keys.length) return obj
  const { [keys.pop()]: omitted, ...rest } = obj;
  return omit(keys, rest);
}

const extractor = (object: any ,params: readonly string[]) => {
  const data = {};

  params.map(e => {
    if (object) {
      data[e] = object[e]
    }
  });

  return data;
};


export default {
  isEmpty,
  omit,
  extractChildren,
  selectFormatter,
  extractor,
  formatPrice,
  findAncestors,
};