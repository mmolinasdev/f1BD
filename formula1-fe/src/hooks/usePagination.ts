import { useState } from 'react';

export function usePagination(initialPage = 0, initialSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  const goToPage = (p: number) => setPage(p);
  const changeSize = (s: number) => { setSize(s); setPage(0); };
  const reset = () => { setPage(0); };

  return { page, size, nextPage, prevPage, goToPage, changeSize, reset };
}
