import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import styles from "./Pagination.module.css";

type PaginationProps = {
  page: number;
  pageCount: number;
};

export function Pagination({ page, pageCount }: PaginationProps) {
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
          href={`/projects?page=${Math.max(1, page - 1)}`}
        >
          <IoChevronBack aria-hidden="true" />
        </Link>
      </li>

      {pages.map((pageNumber) => (
        <li key={pageNumber}>
          <Link
            className={`${styles.pageButton} ${pageNumber === page ? styles.activePage : ""}`}
            aria-current={pageNumber === page ? "page" : undefined}
            href={`/projects?page=${pageNumber}`}
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
          href={`/projects?page=${Math.min(pageCount, page + 1)}`}
        >
          <IoChevronForward aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );
}
