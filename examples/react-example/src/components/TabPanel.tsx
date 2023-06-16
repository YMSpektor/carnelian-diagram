import { HTMLAttributes } from "react";

export interface TabPanelProps {
    index: number;
    value: number;
    children?: React.ReactNode;
}

const TabPanel = (props: TabPanelProps & HTMLAttributes<HTMLDivElement>) => {
    const { children, value, index, ...rest } = props;

  return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...rest}
            >
            {value === index && children}
        </div>
  );
}

export default TabPanel;