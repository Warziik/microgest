import React from "react";
import { SkeletonElement } from "./SkeletonElement";

export function ShowInvoiceSkeleton() {
  return (
    <div className="skeleton-wrapper skeleton__showInvoice">
      <div className="skeleton__showInvoice-breadcrumb">
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
      </div>
      <div className="skeleton__showInvoice-header">
        <div className="skeleton__showInvoice-header-infos">
          <SkeletonElement type="title" />
          <SkeletonElement type="text" />
        </div>
        <div className="skeleton__showInvoice-header-status">
          <SkeletonElement type="title" />
        </div>
        <div className="skeleton__showInvoice-header-ctas">
          <SkeletonElement type="btn-normal" />
          <SkeletonElement type="btn-normal" />
          <SkeletonElement type="btn-normal" />
        </div>
      </div>
      <div className="skeleton__showInvoice-main">
        <div className="skeleton__showInvoice-main-details">
          <div className="skeleton__showInvoice-main-details-customer">
            <SkeletonElement type="text" />
            <SkeletonElement type="btn-small" />
          </div>
          <div className="skeleton__showInvoice-main-details-data">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index: number) => (
              <div
                key={index}
                className="skeleton__showInvoice-main-details-data-item"
              >
                <SkeletonElement type="text" />
                <SkeletonElement type="text" />
              </div>
            ))}
          </div>
        </div>
        <div className="skeleton__showInvoice-main-display">
          <SkeletonElement type="block" />
        </div>
        <div className="skeleton__showInvoice-main-other">
          <SkeletonElement type="block" />
          <SkeletonElement type="block" />
        </div>
      </div>
    </div>
  );
}
