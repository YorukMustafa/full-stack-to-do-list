import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilter,
    setSearchQuery,
    clearTaskError,
} from '../store/tasksSlice';
import { Navbar } from '../components/Navbar';
import { TaskModal } from '../components/TaskModal';
import { ConfirmModal } from '../components/ConfirmModal';
import type { Task, FilterType } from '../types';
import {
    Plus,
    Search,
    CheckCircle2,
    Circle,
    Edit,
    Trash2,
    ListTodo,
    CheckCheck,
    Clock,
    Inbox,
    AlertCircle,
} from 'lucide-react';

export const TodoList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading, error, activeFilter, searchQuery } = useAppSelector(
        (state) => state.tasks
    );

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleFilterChange = (filter: FilterType) => {
        dispatch(setFilter(filter));
    };

    const handleCreateTask = async (data: { header: string; description: string }) => {
        await dispatch(createTask(data));
        setIsAddModalOpen(false);
    };

    const handleUpdateTask = async (data: { header: string; description: string; isFinished?: boolean }) => {
        if (editingTask && editingTask.id !== undefined) {
            await dispatch(
                updateTask({
                    id: editingTask.id,
                    taskData: {
                        header: data.header,
                        description: data.description,
                        isFinished: data.isFinished ?? editingTask.isFinished,
                    },
                })
            );
            setEditingTask(null);
        }
    };

    const handleToggleFinished = async (task: Task) => {
        if (task.id !== undefined) {
            await dispatch(
                updateTask({
                    id: task.id,
                    taskData: {
                        header: task.header,
                        description: task.description,
                        isFinished: !task.isFinished,
                    },
                })
            );
        }
    };

    const handleDeleteConfirm = async () => {
        if (deletingTaskId !== null) {
            await dispatch(deleteTask(deletingTaskId));
            setDeletingTaskId(null);
        }
    };

    // Local search filter
    const filteredTasks = tasks.filter((t) => {
        const matchesSearch =
            (t.header || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'COMPLETED') return t.isFinished === true;
        if (activeFilter === 'UNCOMPLETED') return t.isFinished === false;
        return true;
    });

    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.isFinished).length;
    const activeCount = totalCount - completedCount;

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                <div className="content-container">
                    {/* Header section with stats */}
                    <div className="dashboard-header">
                        <div>
                            <h1 className="page-title">Görev Yönetimi</h1>
                            <p className="page-description">Günlük hedeflerinizi ve yapılacaklar listenizi kolayca takip edin.</p>
                        </div>
                        <button className="btn btn-primary btn-lg" onClick={() => setIsAddModalOpen(true)}>
                            <Plus size={20} />
                            <span>Yeni Görev</span>
                        </button>
                    </div>

                    {/* Metrics summary cards */}
                    <div className="stats-grid">
                        <div
                            className={`stat-card ${activeFilter === 'ALL' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('ALL')}
                        >
                            <div className="stat-icon icon-blue">
                                <ListTodo size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{totalCount}</span>
                                <span className="stat-label">Toplam Görev</span>
                            </div>
                        </div>

                        <div
                            className={`stat-card ${activeFilter === 'UNCOMPLETED' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('UNCOMPLETED')}
                        >
                            <div className="stat-icon icon-amber">
                                <Clock size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{activeCount}</span>
                                <span className="stat-label">Tamamlanmayanlar</span>
                            </div>
                        </div>

                        <div
                            className={`stat-card ${activeFilter === 'COMPLETED' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('COMPLETED')}
                        >
                            <div className="stat-icon icon-emerald">
                                <CheckCheck size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{completedCount}</span>
                                <span className="stat-label">Tamamlananlar</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls Bar: Filters and Search */}
                    <div className="controls-bar">
                        <div className="filter-tabs">
                            <button
                                className={`tab-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('ALL')}
                            >
                                Tümü ({totalCount})
                            </button>
                            <button
                                className={`tab-btn ${activeFilter === 'UNCOMPLETED' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('UNCOMPLETED')}
                            >
                                Tamamlanmayanlar ({activeCount})
                            </button>
                            <button
                                className={`tab-btn ${activeFilter === 'COMPLETED' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('COMPLETED')}
                            >
                                Tamamlananlar ({completedCount})
                            </button>
                        </div>

                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Görevlerde ara..."
                                value={searchQuery}
                                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                            <button className="btn-text" onClick={() => dispatch(clearTaskError())}>
                                Kapat
                            </button>
                        </div>
                    )}

                    {/* Task List Section */}
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Görevler yükleniyor...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <Inbox size={48} />
                            </div>
                            <h3>
                                {searchQuery
                                    ? 'Aramanıza uygun görev bulunamadı.'
                                    : activeFilter === 'COMPLETED'
                                        ? 'Henüz tamamlanmış görev yok.'
                                        : activeFilter === 'UNCOMPLETED'
                                            ? 'Harika! Tamamlanacak görev kalmadı.'
                                            : 'Henüz hiç görev eklenmedi.'}
                            </h3>
                            <p>
                                {searchQuery
                                    ? 'Farklı bir arama terimi deneyebilir veya aramayı temizleyebilirsiniz.'
                                    : 'Yeni bir görev eklemek için "Yeni Görev" butonuna tıklayın.'}
                            </p>
                            {!searchQuery && (
                                <button className="btn btn-primary mt-4" onClick={() => setIsAddModalOpen(true)}>
                                    <Plus size={18} />
                                    <span>İlk Görevi Ekle</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="tasks-grid">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`task-card ${task.isFinished ? 'task-completed' : ''}`}
                                >
                                    <div className="task-card-header">
                                        <button
                                            className="btn-toggle-status"
                                            onClick={() => handleToggleFinished(task)}
                                            title={task.isFinished ? 'Tamamlanmadı yap' : 'Tamamlandı yap'}
                                        >
                                            {task.isFinished ? (
                                                <CheckCircle2 className="icon-success" size={24} />
                                            ) : (
                                                <Circle className="icon-pending" size={24} />
                                            )}
                                        </button>

                                        <div className="task-title-group">
                                            <h3 className={`task-header ${task.isFinished ? 'line-through' : ''}`}>
                                                {task.header}
                                            </h3>
                                            <span className={`status-badge ${task.isFinished ? 'badge-completed' : 'badge-pending'}`}>
                        {task.isFinished ? 'Tamamlandı' : 'Devam Ediyor'}
                      </span>
                                        </div>
                                    </div>

                                    {task.description && (
                                        <div className="task-description">
                                            <p>{task.description}</p>
                                        </div>
                                    )}

                                    <div className="task-card-footer">
                                        <div className="task-actions">
                                            <button
                                                className="btn-action edit"
                                                onClick={() => setEditingTask(task)}
                                                title="Düzenle"
                                            >
                                                <Edit size={16} />
                                                <span>Düzenle</span>
                                            </button>
                                            <button
                                                className="btn-action delete"
                                                onClick={() => task.id !== undefined && setDeletingTaskId(task.id)}
                                                title="Sil"
                                            >
                                                <Trash2 size={16} />
                                                <span>Sil</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <TaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateTask}
            />

            <TaskModal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={handleUpdateTask}
                initialTask={editingTask}
            />

            <ConfirmModal
                isOpen={deletingTaskId !== null}
                title="Görevi Sil"
                message="Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeletingTaskId(null)}
            />
        </div>
    );
};
