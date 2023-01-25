import { MatrixWidgetConfig } from "../../store/types/WidgetType";

export interface ScreenerProps {
  config: MatrixWidgetConfig;
  onChange: (config: MatrixWidgetConfig) => void;
}

export function Matrix({}: ScreenerProps) {
  return (
    <div className={"flex justify-center items-center w-[100%]"}>Matrix</div>
  );
}
