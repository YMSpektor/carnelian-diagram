import { useEffect, useState } from "react";
import { Box, IconButton, InputAdornment, Popover, TextField, TextFieldProps } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ColorPicker from "./ColorPicker";

export interface ColorInputProps {
    value?: string;
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
                    endAdornment: 
                        <InputAdornment position="end" sx={{mr: -1}}>
                            <IconButton size="small" disabled={props.disabled} onClick={(e) => setAnchorEl(e.currentTarget)}>
                                <ArrowDropDownIcon />
                            </IconButton>
                        </InputAdornment>,
                    startAdornment: 
                        <InputAdornment position="start">
                            <Box sx={{width: "10px", height: "10px", border: "1px solid black", backgroundColor: textValue}} />
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