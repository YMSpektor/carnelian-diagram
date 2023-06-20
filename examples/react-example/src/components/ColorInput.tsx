import { useEffect, useState } from "react";
import { IconButton, InputAdornment, Popover, TextField, TextFieldProps } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ColorPicker from "./ColorPicker";

export interface ColorInputProps {
    value: string;
    onChange: (color: string) => void;
}

const ColorInput = (props: ColorInputProps & Omit<TextFieldProps, "InputProps" | "value" | "onChange">) => {
    const {value, onChange, ...rest} = props;

    const [textValue, setTextValue] = useState(props.value);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        setTextValue(value);
    }, [value]);

    function isColor(value: string): boolean {
        const s = new Option().style;
        s.color = value;
        return s.color !== '';
      }

    function updateTextValue(value: string) {
        setTextValue(value);
        if (isColor(value)) {
            onChange(value);
        }
    }

    return (
        <>
            <TextField 
                {...rest}
                value={textValue}
                onChange={(e) => updateTextValue(e.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position="end" sx={{mr: -1}}>
                        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <MoreHorizIcon />
                        </IconButton>
                    </InputAdornment>  
                }}
                sx={{backgroundColor: "background.default"}}
            />
            <Popover
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <ColorPicker color={value} onChange={(color) => updateTextValue(color.hex)} />
            </Popover>
        </>
    );
}

export default ColorInput;