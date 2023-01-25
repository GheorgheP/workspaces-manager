export type WidgetType = "screener" | "matrix" | "chart" | "news" | "info";

export function widgetTypeTitle(widgetType: WidgetType): string {
  switch (widgetType) {
    case "screener":
      return "Market Screener";
    case "matrix":
      return "Fx Matrix";
    case "chart":
      return "Chart";
    case "news":
      return "Latest News";
    case "info":
      return "Info Widget";
  }
}

export type WidgetConfig<T extends WidgetType> = {
  screener: ScreenerWidgetConfig;
  matrix: MatrixWidgetConfig;
  chart: ChartWidgetConfig;
  news: NewsWidgetConfig;
  info: InfoWidgetConfig;
}[T];

export interface ScreenerWidgetConfig {
  assetClass: string;
  assetClasses: string[];
}

export interface MatrixWidgetConfig {
  currencies: string[];
  broker: string;
}

export interface ChartWidgetConfig {
  type: string;
  tickers: string[];
  range: [number, number];
}

export interface NewsWidgetConfig {
  provider: string;
  limit: number;
}

export interface InfoWidgetConfig {
  ticker: string;
  origin: string;
}
