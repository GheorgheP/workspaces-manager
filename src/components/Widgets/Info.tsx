import { InfoWidgetConfig } from "../../store/types/WidgetType";

export interface InfoProps {
  config: InfoWidgetConfig;
  onChange: (config: InfoWidgetConfig) => void;
}

export function Info({}: InfoProps) {
  return (
    <div className={"flex justify-center items-center w-[100%]"}>Info</div>
  );
}
