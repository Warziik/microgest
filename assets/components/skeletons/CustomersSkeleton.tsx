import React from "react";
import { SkeletonElement } from "./SkeletonElement";

export function CustoemrsSkeleton() {
  return (
    <div className="skeleton-wrapper skeleton__customers-wrapper">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((index: number) => (
        <div key={index} className="skeleton__customers">
          <div className="skeleton__customers-header">
            <SkeletonElement type="avatar" />
            <SkeletonElement type="title" />
            <SkeletonElement type="text" />
          </div>
          <div className="skeleton__customers-details">
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
          </div>
          <div className="skeleton__customers-ctas">
            <SkeletonElement type="btn-small" />
            <SkeletonElement type="btn-small" />
          </div>
        </div>
      ))}
    </div>
  );
}
