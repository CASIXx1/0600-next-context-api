import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import styles from "./TasksPagination.module.css";

const INITIAL_PAGE_LIMIT = 20;

type TasksPaginationProps = {
  limit: number;
  page: number;
  pageCount: number;
};

export function TasksPagination({ limit, page, pageCount }: TasksPaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <ul className={styles.pagination}>
      <li>
        <Link
          className={styles.pageButton}
          href={createTasksPageHref(Math.max(1, page - 1), limit)}
          aria-label="前のページ"
          aria-disabled={page <= 1}
        >
          <IoChevronBack aria-hidden="true" />
        </Link>
      </li>

      {pages.map((pageNumber) => (
        <li key={pageNumber}>
          <Link
            className={`${styles.pageButton} ${pageNumber === page ? styles.activePage : ""}`}
            href={createTasksPageHref(pageNumber, limit)}
            aria-current={pageNumber === page ? "page" : undefined}
          >
            {pageNumber}
          </Link>
        </li>
      ))}

      <li>
        <Link
          className={styles.pageButton}
          href={createTasksPageHref(Math.min(pageCount, page + 1), limit)}
          aria-label="次のページ"
          aria-disabled={page >= pageCount}
        >
          <IoChevronForward aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );
}

function createTasksPageHref(page: number, limit: number) {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (limit !== INITIAL_PAGE_LIMIT) {
    params.set("limit", String(limit));
  }

  return `/tasks?${params.toString()}`;
}
