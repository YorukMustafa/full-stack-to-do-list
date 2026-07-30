import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2 } from 'lucide-react';
import type { Task } from '../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { header: string; description: string; isFinished?: boolean }) => void;
    initialTask?: Task | null;
    loading?: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
                                                        isOpen,
                                                        onClose,
                                                        onSubmit,
                                                        initialTask,
                                                        loading = false,
                                                    }) => {
    const [header, setHeader] = useState('');
    const [description, setDescription] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialTask) {
            setHeader(initialTask.header || '');
            setDescription(initialTask.description || '');
            setIsFinished(initialTask.isFinished || false);
        } else {
            setHeader('');
            setDescription('');
            setIsFinished(false);
        }
        setError('');
    }, [initialTask, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!header.trim()) {
            setError('Görev başlığı zorunludur.');
            return;
        }
        onSubmit({
            header: header.trim(),
            description: description.trim(),
            isFinished,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-box">
                        {initialTask ? <Edit2 size={20} className="icon-gradient" /> : <Plus size={20} className="icon-gradient" />}
                        <h3>{initialTask ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</h3>
                    </div>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="header">Görev Başlığı *</label>
                        <input
                            id="header"
                            type="text"
                            placeholder="Örn: Proje dokümantasyonunu hazırla"
                            value={header}
                            onChange={(e) => {
                                setHeader(e.target.value);
                                if (error) setError('');
                            }}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Açıklama</label>
                        <textarea
                            id="description"
                            rows={3}
                            placeholder="Görevle ilgili detaylı açıklama ekleyin..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {initialTask && (
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isFinished}
                                    onChange={(e) => setIsFinished(e.target.checked)}
                                />
                                <span>Tamamlandı olarak işaretle</span>
                            </label>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            İptal
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Kaydediliyor...' : initialTask ? 'Güncelle' : 'Oluştur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
