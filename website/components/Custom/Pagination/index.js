
  import React from 'react';
import { usePagination, DOTS } from '../../Hooks/usePagination';

const Pagination = ({pagination, props, setProp}) => {

  const siblingCount = 1
  

  const currentPage = parseInt(pagination.page);
  const totalCount = parseInt(pagination.pageCount - 1);
  const pageSize = parseInt(pagination.pageSize);

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage < 0 || paginationRange.length < 2) {
    return null;
  }


  const onPageChange= (pageNumber) => {
    pagination.setPage(pageNumber);
  }

  const onNext = () => {
    pagination.setPage(currentPage + 1);
  };

  const onPrevious = () => {
    pagination.setPage(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className='pagination-container'
    >
       {/* Left navigation arrow */}
      <li
        className={`${currentPage !== 0  ? 'pagination-item' : ''}`}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map(pageNumber => {
         
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return <li className="pagination-item dots">&#8230;</li>;
        }
		
        // Render our Page Pills
        return (
          <li
            className={`${pageNumber === currentPage ? 'pagination-item': ''}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber+1}
          </li>
        );
      })}
      {/*  Right Navigation arrow */}
      <li
        className={`${currentPage !== lastPage ? 'pagination-item' : ''}`}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  );
};

export default Pagination;