import { IconButton } from "@mui/material";
import { IconButtonProps } from "@mui/material/IconButton/IconButton";

export interface ToolbarButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    children?: React.ReactNode;
}

const ToolbarButton = (props: ToolbarButtonProps & IconButtonProps) => {
    const { children, onClick, ...rest } = props;
    return (
        <IconButton color="inherit" onClick={props.onClick} {...rest}>
            { props.children }
        </IconButton>
    );
}

export default ToolbarButton;