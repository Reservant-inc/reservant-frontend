import React from "react";
import { Modal, Box } from "@mui/material";

interface MyModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const MyModal: React.FC<MyModalProps> = ({ open, onClose, children }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'transparent',
                boxShadow: 'none',
                p: 4,
            }}>
                {children}
            </Box>
        </Modal>
    );
};

export default MyModal;
