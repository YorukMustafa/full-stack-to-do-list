import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { username } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <div className="brand-icon">
                        <CheckSquare size={24} />
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">TaskMaster</span>
                        <span className="brand-subtitle">MVP Todo</span>
                    </div>
                </div>

                {username && (
                    <div className="navbar-user">
                        <div className="user-badge">
                            <UserIcon size={16} />
                            <span>{username}</span>
                        </div>
                        <button onClick={handleLogout} className="btn-logout" title="Çıkış Yap">
                            <LogOut size={18} />
                            <span>Çıkış</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
