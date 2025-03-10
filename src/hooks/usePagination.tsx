import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const usePagination = (data) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const endOffset = (itemOffset || 0) + itemsPerPage;
  const [pageCount, setPageCount] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
      setItemOffset(((Number(searchParams.get('page') || 1) - 1) * itemsPerPage) % (data?.count))
      setPageCount(data?.count / itemsPerPage)
  }, [data, searchParams.get('page'), searchParams.get('tab')]);

  return {
    itemOffset,
    itemsPerPage,
    endOffset,
    pageCount,
    setPageCount,
    setItemOffset,
    setItemsPerPage
  }
}

export default usePagination;
