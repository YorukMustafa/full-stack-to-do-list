import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              isOpen,
                                                              title,
                                                              message,
                                                              onConfirm,
                                                              onCancel,
                                                              confirmText = 'Sil',
                                                              cancelText = 'İptal',
                                                          }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-box">
                        <AlertTriangle size={22} className="icon-danger" />
                        <h3>{title}</h3>
                    </div>
                    <button className="btn-icon" onClick={onCancel}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p>{message}</p>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
