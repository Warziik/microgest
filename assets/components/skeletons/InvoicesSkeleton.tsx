import React from "react";
import { SkeletonElement } from "./SkeletonElement";

export function InvoicesSkeleton() {
  return (
    <div className="skeleton-wrapper skeleton__invoices-wrapper">
      <div className="skeleton__invoices-tabs">
        <SkeletonElement type="title" />
        <SkeletonElement type="title" />
        <SkeletonElement type="title" />
      </div>
      <div className="skeleton__invoices-ctas">
        <SkeletonElement type="title" />
        <SkeletonElement type="title" />
      </div>
      {[1, 2].map((index: number) => (
        <div key={index} className="skeleton__invoices-table">
          {[1, 2, 3, 4, 5, 6].map((index: number) => (
            <div key={index} className="skeleton__invoices-table-row">
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
