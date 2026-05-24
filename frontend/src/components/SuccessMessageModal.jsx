import React from "react";
import styles from "./SuccessMessageModal.module.css";

const SuccessMessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Sucesso!</h2>
        <p>{message}</p>
        <button onClick={onClose} className={styles.closeButton}>Fechar</button>
      </div>
    </div>
  );
};

export default SuccessMessageModal;
