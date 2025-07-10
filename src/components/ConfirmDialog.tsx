import React from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onCancel}></div>
      <div className="modal-card">
        <header className="modal-card-head py-4">
          <p className="modal-card-title">{title}</p>
          <button className="delete" aria-label="close" onClick={onCancel}></button>
        </header>
        <section className="modal-card-body">
          <p>{message}</p>
        </section>
        <footer className="modal-card-foot py-4">
          <button className="button is-danger mx-2" onClick={onConfirm}>Yes</button>
          <button className="button mx-4" onClick={onCancel}>No</button>
        </footer>
      </div>
    </div>
);
};

export default ConfirmDialog;
