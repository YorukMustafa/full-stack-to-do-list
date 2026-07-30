import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, clearAuthError } from '../store/authSlice';
import { Lock, User, ArrowRight, CheckSquare, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/todos');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!usernameInput.trim() || !passwordInput.trim()) return;

        dispatch(
            loginUser({
                username: usernameInput.trim(),
                password: passwordInput.trim(),
            })
        );
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <CheckSquare size={32} />
                    </div>
                    <h2>Hoş Geldiniz</h2>
                    <p>Hesabınıza giriş yapın ve görevlerinizi yönetin</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Kullanıcı Adı</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                id="username"
                                type="text"
                                className="input-field"
                                placeholder="Kullanıcı adınızı girin"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Şifre</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="input-field"
                                placeholder="••••••••"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? (
                            'Giriş yapılıyor...'
                        ) : (
                            <>
                                <span>Giriş Yap</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
