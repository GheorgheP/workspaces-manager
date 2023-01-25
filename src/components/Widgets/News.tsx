import { NewsWidgetConfig } from "../../store/types/WidgetType";

export interface NewsProps {
  config: NewsWidgetConfig;
  onChange: (config: NewsWidgetConfig) => void;
}

export function News({}: NewsProps) {
  return (
    <div className={"flex justify-center items-center w-[100%]"}>News</div>
  );
}
