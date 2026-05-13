"use client";

import { createContext, useContext, type ReactNode } from "react";

type PaginationContextValue = {
  page: number;
  pageCount: number;
  getPageQuery: (page: number) => string;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

type PaginationProviderProps = {
  children: ReactNode;
  page: number;
  pageCount: number;
};

export function PaginationProvider({ children, page, pageCount }: PaginationProviderProps) {
  const value: PaginationContextValue = {
    page,
    pageCount,
    getPageQuery: (targetPage) => `?page=${targetPage}`,
  };

  return <PaginationContext value={value}>{children}</PaginationContext>;
}

export function usePagination() {
  const pagination = useContext(PaginationContext);

  if (!pagination) {
    throw new Error("usePagination must be used within PaginationProvider");
  }

  return pagination;
}
