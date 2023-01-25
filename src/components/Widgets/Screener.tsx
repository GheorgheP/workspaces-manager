import { ScreenerWidgetConfig } from "../../store/types/WidgetType";

export interface ScreenerProps {
  config: ScreenerWidgetConfig;
  onChange: (config: ScreenerWidgetConfig) => void;
}

export function Screener({}: ScreenerProps) {
  return (
    <div className={"flex justify-center items-center w-[100%]"}>Screener</div>
  );
}
