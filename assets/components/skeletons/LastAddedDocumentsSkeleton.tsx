import React from "react";
import {SkeletonElement} from "./SkeletonElement";

export function LastAddedDocumentsSkeleton() {
    return <div className="skeleton__lastAddedDocuments-wrapper">
        {[1, 2, 3, 4, 5, 6].map((index: number) =>
            <div key={index} className="skeleton__lastAddedDocuments-item">
                <SkeletonElement type="text"/>
                <SkeletonElement type="text"/>
                <SkeletonElement type="btn-normal"/>
                <SkeletonElement type="btn-normal"/>
            </div>
        )}
    </div>
}