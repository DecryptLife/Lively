import React from "react";
const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  let field = [];
  pageNumbers.map((number) => {
    field.push(
      <li key={number} className="page-item">
        <a onClick={() => paginate(number)} className="page-link">
          {number}
        </a>
      </li>
    );
  });


  return (
    <nav className="paginationField">
      <ul className="pagination">{field}</ul>
    </nav>
  );
};

export default Pagination;
