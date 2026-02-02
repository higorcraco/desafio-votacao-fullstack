import React from "react";
import { Pagination } from "react-bootstrap";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers: (number | string)[] = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(0, endPage - maxPagesToShow + 1);
  }

  if (startPage > 0) {
    pageNumbers.push(0);
    if (startPage > 1) {
      pageNumbers.push("...");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) {
      pageNumbers.push("...");
    }
    pageNumbers.push(totalPages - 1);
  }

  return (
    <div className="d-flex justify-content-center mt-4 mb-4">
      <Pagination>
        <Pagination.First
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0 || disabled}
        />
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || disabled}
        />

        {pageNumbers.map((number, index) => {
          if (number === "...") {
            return <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />;
          }

          const pageNum = number as number;
          return (
            <Pagination.Item
              key={pageNum}
              active={pageNum === currentPage}
              onClick={() => onPageChange(pageNum)}
              disabled={disabled}
            >
              {pageNum + 1}
            </Pagination.Item>
          );
        })}

        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || disabled}
        />
        <Pagination.Last
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1 || disabled}
        />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
