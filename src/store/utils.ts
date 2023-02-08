import { WidgetConfig, WidgetType } from "./types/WidgetType";
import { inRange, last } from "lodash";
import { Frame } from "./types/Frame";
import { Direction } from "./types/Direction";

interface Size {
  minWidth: number;
  minHeight: number;
}

export const getWidgetSize = (type: WidgetType): Size => {
  switch (type) {
    case "news":
      return { minWidth: 20, minHeight: 40 };
    case "chart":
      return { minWidth: 20, minHeight: 20 };
    case "matrix":
      return { minWidth: 30, minHeight: 20 };
    case "screener":
      return { minWidth: 40, minHeight: 20 };
    case "info":
      return { minWidth: 40, minHeight: 20 };
  }
};

export function getWidgetDefaultConfig<T extends WidgetType>(
  type: T
): WidgetConfig<T> {
  const t = type as WidgetType;
  switch (t) {
    case "screener": {
      return {
        assetClasses: ["FX"],
        assetClass: "FX",
      } as WidgetConfig<T>;
    }
    case "matrix":
      return {
        currencies: ["MDL", "USD"],
        broker: "USD",
      } as WidgetConfig<T>;
    case "news":
      return {
        provider: "twitter",
        limit: 50,
      } as WidgetConfig<T>;
    case "chart":
      return {
        type: "line",
        tickers: ["TSLA.US"],
        range: [0, 1],
      } as WidgetConfig<T>;
    case "info":
      return {
        ticker: "AMZN.US",
        origin: "US",
      } as WidgetConfig<T>;
  }
}

export function getPrevItem<T extends { id: any; order: number }>(
  items: T[],
  id: T["id"]
): T | undefined {
  const sortedWidgets = items.sort((a, b) => a.order - b.order);
  const index = sortedWidgets.findIndex((w) => w?.id === id);

  return sortedWidgets[index - 1];
}

export function getNextItem<T extends { id: any; order: number }>(
  items: T[],
  id: T["id"]
): T | undefined {
  const sorted = items.sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((w) => w?.id === id);

  return sorted[index + 1];
}

export function getFirstItem<T extends { id: any; order: number }>(
  items: T[]
): T | undefined {
  return items.sort((a, b) => a.order - b.order)[0];
}

export function getLastItem<T extends { id: any; order: number }>(
  items: T[]
): T | undefined {
  return last(items.sort((a, b) => a.order - b.order));
}

function hasIntersection(a: [number, number], b: [number, number]) {
  return (
    inRange(a[0], b[0], b[1]) ||
    inRange(a[1], b[0], b[1]) ||
    inRange(b[0], a[0], a[1]) ||
    inRange(b[1], a[0], a[1])
  );
}

export function snapFramePosition(
  obj: Frame["config"],
  refs: Array<Frame["config"]>,
  offset: number,
  axis: "h" | "v" | "both"
): {
  x: number;
  y: number;
} {
  const r = snapValues(convertTo(obj), refs.map(convertTo), offset, axis);

  return { x: r.h, y: r.v };

  function convertTo(v: Frame["config"]): SnapObject {
    return {
      h: v.x,
      v: v.y,
      hl: v.width,
      vl: v.height,
    };
  }
}

export interface SnapObject {
  h: number;
  v: number;
  hl: number;
  vl: number;
}

export function snapValues(
  obj: SnapObject,
  refs: Array<SnapObject>,
  offset: number,
  axis: "h" | "v" | "both"
): { h: number; v: number } {
  const h0 = obj.h;
  const v0 = obj.v;
  const hl0 = h0 + obj.hl;
  const vl0 = v0 + obj.vl;
  const onH = axis === "h" || axis === "both";
  const onV = axis === "v" || axis === "both";

  const response: { h?: number; v?: number } = {};

  for (let i = 0; i < refs.length; i++) {
    if ((!onH || "h" in response) && (!onV || "v" in response)) break;

    const ref = refs[i];
    const h1 = ref.h;
    const hl1 = ref.h + ref.hl;
    const v1 = ref.v;
    const vl1 = ref.v + ref.vl;

    if (onH && hasIntersection([v0, vl0], [v1 - offset, vl1 + offset])) {
      if (Math.abs(hl0 - h1) < offset) {
        response.h = h1 - obj.hl;
      }

      if (Math.abs(h0 - hl1) < offset) {
        response.h = hl1;
      }

      if (Math.abs(h0 - h1) < offset) {
        response.h = h1;
      }

      if (Math.abs(hl0 - hl1) < offset) {
        response.h = hl1 - obj.hl;
      }
    }

    if (onV && hasIntersection([h0, hl0], [h1 - offset, hl1 + offset])) {
      if (Math.abs(vl0 - v1) < offset) {
        response.v = v1 - obj.vl;
      }

      if (Math.abs(v0 - vl1) < offset) {
        response.v = vl1;
      }

      if (Math.abs(v0 - v1) < offset) {
        response.v = v1;
      }

      if (Math.abs(vl0 - vl1) < offset) {
        response.v = vl1 - obj.vl;
      }
    }
  }

  return {
    h: response.h ?? h0,
    v: response.v ?? v0,
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface Edge extends Point {
  length: number;
}

export interface Rect extends Point {
  w: number;
  h: number;
}

type SnapAxis = "x" | "y" | "xy";

export function snapPoint(
  p: Point,
  rs: Rect[],
  offset: number,
  axis: SnapAxis
): Point {
  const response: Partial<Point> = {};
  const snapOnX = axis === "x" || axis === "xy";
  const snapOnY = axis === "y" || axis === "xy";

  for (let i = 0; i < rs.length; i++) {
    if ((!snapOnX || "x" in response) && (!snapOnY || "y" in response)) break;

    const r = rs[i];
    const rx1 = r.x;
    const rx2 = r.x + r.w;
    const ry1 = r.y;
    const ry2 = r.y + r.h;

    if (snapOnX && inRange(p.y, ry1 - offset, ry2 + offset)) {
      if (Math.abs(p.x - rx1) < offset) {
        response.x = rx1;
      }

      if (Math.abs(p.x - rx2) < offset) {
        response.x = rx2;
      }
    }

    if (snapOnY && inRange(p.x, rx1 - offset, rx2 + offset)) {
      if (Math.abs(p.y - ry1) < offset) {
        response.y = ry1;
      }

      if (Math.abs(p.y - ry2) < offset) {
        response.y = ry2;
      }
    }
  }

  return {
    x: response.x ?? p.x,
    y: response.y ?? p.y,
  };
}

export function snapEdge(
  e: Edge,
  rs: Rect[],
  offset: number,
  axis: "x" | "y"
): Point {
  const response: Partial<Point> = {};
  const snapOnX = axis === "x";
  const snapOnY = axis === "y";

  for (let i = 0; i < rs.length; i++) {
    if ((!snapOnX || "x" in response) && (!snapOnY || "y" in response)) break;

    const r = rs[i];
    const rx1 = r.x;
    const rx2 = r.x + r.w;
    const ry1 = r.y;
    const ry2 = r.y + r.h;

    if (
      snapOnX &&
      hasIntersection([e.y, e.y + e.length], [ry1 - offset, ry2 + offset])
    ) {
      if (Math.abs(e.x - rx1) < offset) {
        response.x = rx1;
      }

      if (Math.abs(e.x - rx2) < offset) {
        response.x = rx2;
      }
    }

    if (
      snapOnY &&
      hasIntersection([e.x, e.x + e.length], [rx1 - offset, rx2 + offset])
    ) {
      if (Math.abs(e.y - ry1) < offset) {
        response.y = ry1;
      }

      if (Math.abs(e.y - ry2) < offset) {
        response.y = ry2;
      }
    }
  }

  return {
    x: response.x ?? e.x,
    y: response.y ?? e.y,
  };
}

export function resizeFrame(
  current: Frame["config"],
  refs: Frame["config"][],
  dW: number,
  dH: number,
  d: Direction,
  snapOffset: number
): Frame["config"] {
  if (dW === 0 && dH === 0) {
    return current;
  }

  const rects: Rect[] = refs.map((r) => ({
    x: r.x,
    y: r.y,
    w: r.width,
    h: r.height,
  }));

  switch (d) {
    case "nw": {
      const point: Point = {
        x: current.x + dW,
        y: current.y + dH,
      };
      const rPoint = snapPoint(point, rects, snapOffset, "xy");
      const _dW = rPoint.x - current.x;
      const _dH = rPoint.y - current.y;

      return {
        ...current,
        width: Math.min(100, Math.max(0, current.width - _dW)),
        height: Math.min(100, Math.max(0, current.height - _dH)),
        x: Math.min(100, Math.max(0, rPoint.x)),
        y: Math.min(100, Math.max(0, rPoint.y)),
      };
    }
    case "n": {
      const edge: Edge = {
        y: current.y + dH,
        x: current.x,
        length: current.width,
      };
      const rPoint = snapEdge(edge, rects, snapOffset, "y");
      const _dH = rPoint.y - current.y;

      return {
        ...current,
        height: Math.min(100, Math.max(0, current.height - _dH)),
        y: Math.min(100, Math.max(0, rPoint.y)),
      };
    }
    case "ne": {
      const point: Point = {
        x: current.x + current.width + dW,
        y: current.y + dH,
      };
      const rPoint = snapPoint(point, rects, snapOffset, "xy");
      const _dW = rPoint.x - (current.x + current.width);
      const _dH = rPoint.y - current.y;

      return {
        ...current,
        width: Math.min(100, Math.max(0, current.width + _dW)),
        height: Math.min(100, Math.max(0, current.height - _dH)),
        y: Math.min(100, Math.max(0, rPoint.y)),
      };
    }
    case "e": {
      const edge: Edge = {
        x: current.x + current.width + dW,
        y: current.y,
        length: current.height,
      };
      const rPoint = snapEdge(edge, rects, snapOffset, "x");
      const _dW = rPoint.x - (current.x + current.width);

      return {
        ...current,
        width: Math.min(100, Math.max(0, current.width + _dW)),
      };
    }
    case "se": {
      const point: Point = {
        x: current.x + current.width + dW,
        y: current.y + current.height + dH,
      };
      const rPoint = snapPoint(point, rects, snapOffset, "xy");
      const _dW = current.x + current.width - rPoint.x;
      const _dH = current.y + current.height - rPoint.y;

      return {
        ...current,
        width: Math.min(100, Math.max(0, current.width - _dW)),
        height: Math.min(100, Math.max(0, current.height - _dH)),
      };
    }
    case "s": {
      const edge: Edge = {
        y: current.y + current.height + dH,
        x: current.x,
        length: current.width,
      };
      const rPoint = snapEdge(edge, rects, snapOffset, "y");
      const _dH = rPoint.y - (current.y + current.height);

      return {
        ...current,
        height: Math.min(100, Math.max(0, current.height + _dH)),
      };
    }
    case "sw": {
      const point: Point = {
        x: current.x + dW,
        y: current.y + current.height + dH,
      };
      const rPoint = snapPoint(point, rects, snapOffset, "xy");
      const _dW = rPoint.x - current.x;
      const _dH = current.y + current.height - rPoint.y;

      return {
        ...current,
        width: Math.min(100, Math.max(0, current.width - _dW)),
        height: Math.min(100, Math.max(0, current.height - _dH)),
        x: Math.min(100, Math.max(0, rPoint.x)),
      };
    }
    case "w": {
      const edge: Edge = {
        x: current.x + dW,
        y: current.y,
        length: current.height,
      };
      const rPoint = snapEdge(edge, rects, snapOffset, "x");
      const _dW = rPoint.x - current.x;

      return {
        ...current,
        width: Math.min(100, Math.max(0, current.width - _dW)),
        x: Math.min(100, Math.max(0, rPoint.x)),
      };
    }
  }
}
