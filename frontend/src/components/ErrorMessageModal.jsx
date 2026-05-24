import React from 'react';
import styles from './ErrorMessageModal.module.css';

const ErrorMessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Erro!</h2>
        <p>{message}</p>
        <button onClick={onClose} className={styles.closeButton}>Fechar</button>
      </div>
    </div>
  );
};

export default ErrorMessageModal;
