/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, BoxProps, Divider, Drawer, IconButton, Toolbar } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

export interface LayoutSidebarProps {
    width: number;
    mobileOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const LayoutSidebar = (props: LayoutSidebarProps & BoxProps) => {
    const { width, mobileOpen, onClose, children, ...rest } = props;
    return (
        <Box
            component="nav"
            sx={{ width: { sm: props.width }, flexShrink: { sm: 0 } }}
            {...rest}
        >
            <Drawer
                variant="temporary"
                open={props.mobileOpen}
                onClose={props.onClose}
                ModalProps={{
                    hideBackdrop: true,
                    keepMounted: true
                }}
                sx={{
                    display: { xs: 'block', sm: 'none', pointerEvents: "none" },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.width, pointerEvents: "auto" },
                }}
            >
                <Toolbar>
                    <IconButton onClick={props.onClose}>
                        <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                { props.children }
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { position: 'static', boxSizing: 'border-box', width: props.width },
                }}
                open
            >
                { props.children }
            </Drawer>
        </Box>
    );
}

export default LayoutSidebar;