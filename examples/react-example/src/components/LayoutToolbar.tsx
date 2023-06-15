import { AppBar, Toolbar } from "@mui/material";
import ToolbarButton from "./ToolbarButton";
import MenuIcon from '@mui/icons-material/Menu';

export interface LayoutToolbarProps {
    onToggleSidebar: () => void;
    children?: React.ReactNode;
}

const LayoutToolbar = (props: LayoutToolbarProps) => {
    return (
        <AppBar position="static">
            <Toolbar>
            <ToolbarButton
                color="inherit"
                edge="start"
                onClick={props.onToggleSidebar}
                sx={{ mr: 2, display: { sm: 'none' } }}
            >
                <MenuIcon />
            </ToolbarButton>
                { props.children }
            </Toolbar>
        </AppBar>
    );
}

export default LayoutToolbar;