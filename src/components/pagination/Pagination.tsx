"use client";

import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { usePagination } from "@/src/contexts/pagination";
import styles from "./Pagination.module.css";

export function Pagination() {
  const { page, pageCount, getPageQuery } = usePagination();
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <ul
      className={styles.pagination}
      aria-label="ページネーション"
    >
      <li>
        <Link
          className={`${styles.pageButton} ${styles.arrowButton}`}
          aria-label="前のページ"
          aria-disabled={page <= 1}
          href={getPageQuery(Math.max(1, page - 1))}
        >
          <IoChevronBack aria-hidden="true" />
        </Link>
      </li>

      {pages.map((pageNumber) => (
        <li key={pageNumber}>
          <Link
            className={`${styles.pageButton} ${pageNumber === page ? styles.activePage : ""}`}
            aria-current={pageNumber === page ? "page" : undefined}
            href={getPageQuery(pageNumber)}
          >
            {pageNumber}
          </Link>
        </li>
      ))}

      <li>
        <Link
          className={`${styles.pageButton} ${styles.arrowButton}`}
          aria-label="次のページ"
          aria-disabled={page >= pageCount}
          href={getPageQuery(Math.min(pageCount, page + 1))}
        >
          <IoChevronForward aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );
}
