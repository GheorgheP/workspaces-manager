import { WidgetConfig, WidgetType } from "../../store/types/WidgetType";
import { Chart } from "./Chart";
import { Info } from "./Info";
import { Matrix } from "./Matrix";
import { Screener } from "./Screener";
import { News } from "./News";
import { ReactElement } from "react";

export interface WidgetComponentProps<T extends WidgetType> {
  type: T;
  config: WidgetConfig<T>;
  onChange: (config: WidgetConfig<T>) => void;
}

export function WidgetComponent(
  props: WidgetComponentProps<WidgetType>
): ReactElement {
  switch (props.type) {
    case "chart":
      return <Chart {...(props as WidgetComponentProps<"chart">)} />;
    case "info":
      return <Info {...(props as WidgetComponentProps<"info">)} />;
    case "news":
      return <News {...(props as WidgetComponentProps<"news">)} />;
    case "matrix":
      return <Matrix {...(props as WidgetComponentProps<"matrix">)} />;
    case "screener":
      return <Screener {...(props as WidgetComponentProps<"screener">)} />;
  }
}
