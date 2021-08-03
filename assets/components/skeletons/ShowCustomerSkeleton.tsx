import React from "react";
import { SkeletonElement } from "./SkeletonElement";

export function ShowCustomerSkeleton() {
  return (
    <div className="skeleton-wrapper skeleton__showCustomer">
      <div className="skeleton__showInvoice-breadcrumb">
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
      </div>
      <div className="skeleton__showCustomer-header">
        <div className="skeleton__showCustomer-header-infos">
          <SkeletonElement type="avatar" />
          <SkeletonElement type="title" />
          <SkeletonElement type="text" />
        </div>
        <div className="skeleton__showCustomer-header-ctas">
          <SkeletonElement type="btn-normal" />
          <SkeletonElement type="btn-normal" />
        </div>
      </div>
      <div className="skeleton__showCustomer-details">
        {[1, 2, 3].map((index: number) => (
          <div key={index} className="skeleton__showCustomer-details-item">
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
          </div>
        ))}
      </div>
      <div className="skeleton__showCustomer-taskBar">
        <SkeletonElement type="text" />
        <SkeletonElement type="btn-normal" />
      </div>
      <div className="skeleton__showCustomer-tableData">
        <div className="skeleton__invoices-tabs">
          <SkeletonElement type="title" />
          <SkeletonElement type="title" />
          <SkeletonElement type="title" />
        </div>
        <div className="skeleton__invoices-ctas">
          <SkeletonElement type="title" />
          <SkeletonElement type="title" />
        </div>
        <div className="skeleton__invoices-table">
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
      </div>
    </div>
  );
}
