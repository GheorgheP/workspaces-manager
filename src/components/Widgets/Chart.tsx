import { ChartWidgetConfig } from "../../store/types/WidgetType";

export interface ChartProps {
  config: ChartWidgetConfig;
  onChange: (config: ChartWidgetConfig) => void;
}

export function Chart({}: ChartProps) {
  return (
    <div className={"flex justify-center items-center w-[100%]"}>Chart</div>
  );
}
