import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 250,
  bgcolor: "#009688",
  height: 250,
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

export interface BasicModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function BasicModal({
  open,
  setOpen,
  children,
}: BasicModalProps) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          style={{
            textAlign: "center",
            fontSize: "15px",
            color: "black",
            fontWeight: "bolder",
          }}
        >
          {children}
        </Box>
      </Modal>
    </div>
  );
}
