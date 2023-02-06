import { WidgetConfig, WidgetType } from "./types/WidgetType";
import { last } from "lodash";

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
