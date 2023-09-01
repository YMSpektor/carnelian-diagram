import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';

interface InputModalProps {
  header: string;
  message?: string;
  label: string;
  open: boolean;
  initialValue?: string;
  onClose: (result?: string) => void;
}

const InputModal: React.FC<InputModalProps> = (props: InputModalProps) => {
  const [inputResult, setInputResult] = useState(props.initialValue || '');

  useEffect(() => {
    if (props.open) {
      setInputResult(props.initialValue || '');
    }
  }, [props.open, props.initialValue]);

  return (
    <Dialog open={props.open} fullWidth={true}>
      <DialogTitle>{props.header}</DialogTitle>
      <DialogContent>
        {props.message && (
          <DialogContentText color="textPrimary">{props.message}</DialogContentText>
        )}
        <TextField
          autoFocus
          margin="dense"
          label={props.label}
          type="text"
          value={inputResult}
          fullWidth
          variant="standard"
          onChange={(e) => {
            setInputResult(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={!inputResult} onClick={() => props.onClose(inputResult)}>
          Ok
        </Button>
        <Button onClick={() => props.onClose()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputModal;
