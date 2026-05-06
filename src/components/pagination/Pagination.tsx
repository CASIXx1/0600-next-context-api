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
        <button
          className={styles.pageButton}
          type="button"
          aria-label="前のページ"
          disabled={page <= 1}
        >
          <IoChevronBack aria-hidden="true" />
        </button>
      </li>

      {pages.map((pageNumber) => (
        <li key={pageNumber}>
          <button
            className={`${styles.pageButton} ${pageNumber === page ? styles.activePage : ""}`}
            type="button"
            aria-current={pageNumber === page ? "page" : undefined}
          >
            {pageNumber}
          </button>
        </li>
      ))}

      <li>
        <button
          className={styles.pageButton}
          type="button"
          aria-label="次のページ"
          disabled={page >= pageCount}
        >
          <IoChevronForward aria-hidden="true" />
        </button>
      </li>
    </ul>
  );
}
