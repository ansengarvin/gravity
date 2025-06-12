import React, { useCallback, useState } from "react";

export function useVirtualTable(totalRowCount: number, rowsToLoad: number, rowHeight: number, tableGap: number) {
    const [scrollTop, setScrollTop] = useState(0);
    const actualRowHeight = rowHeight + tableGap;

    const loadBefore = 10;
    const loadAfter = 10;

    const rowsSurpassed = Math.max(0, Math.floor(scrollTop / actualRowHeight));

    const start = Math.max(0, rowsSurpassed - loadBefore);

    const end = Math.min(start + rowsToLoad + loadBefore + loadAfter, totalRowCount);

    const topHeight = start * actualRowHeight; // Height of all rows before start index
    const bottomHeight = Math.max(0, (totalRowCount - end) * actualRowHeight); // Height of all rows after end index

    const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    return {
        visibleRange: { start: start, end: end },
        onScroll,
        topHeight,
        bottomHeight,
    };
}
