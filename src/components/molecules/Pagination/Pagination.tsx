"use client";

import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PageButtonLink } from "@/src/components/atoms/PageButtonLink";
import styles from "./Pagination.module.css";

type PaginationProps = {
  getPageHref: (page: number) => string;
  page: number;
  pageCount: number;
};

export function Pagination({ getPageHref, page, pageCount }: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <ul
      className={styles.pagination}
      aria-label="ページネーション"
    >
      <li>
        <PageButtonLink
          ariaLabel="前のページ"
          href={getPageHref(Math.max(1, page - 1))}
          isArrow
          isDisabled={page <= 1}
        >
          <IoChevronBack aria-hidden="true" />
        </PageButtonLink>
      </li>

      {pages.map((pageNumber) => (
        <li key={pageNumber}>
          <PageButtonLink
            href={getPageHref(pageNumber)}
            isActive={pageNumber === page}
          >
            {pageNumber}
          </PageButtonLink>
        </li>
      ))}

      <li>
        <PageButtonLink
          ariaLabel="次のページ"
          href={getPageHref(Math.min(pageCount, page + 1))}
          isArrow
          isDisabled={page >= pageCount}
        >
          <IoChevronForward aria-hidden="true" />
        </PageButtonLink>
      </li>
    </ul>
  );
}
