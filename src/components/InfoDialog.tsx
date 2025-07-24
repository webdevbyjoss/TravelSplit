import React from 'react';

interface InfoDialogProps {
  title: string;
  message: string;
  onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ title, message, onClose }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <p>{message}</p>
        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <button className="button is-info" onClick={onClose}>OK</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InfoDialog; 