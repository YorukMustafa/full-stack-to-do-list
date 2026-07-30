import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { registerUser, clearAuthError, resetRegisterSuccess } from '../store/authSlice';
import { Lock, User, Mail, UserPlus, CheckCircle, CheckSquare, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState('');

    const dispatch = useAppDispatch();
    useNavigate();
    const { loading, error, registerSuccess } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearAuthError());
        dispatch(resetRegisterSuccess());
    }, [dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        if (passwordInput !== confirmPassword) {
            setValidationError('Şifreler eşleşmiyor!');
            return;
        }

        if (passwordInput.length < 4) {
            setValidationError('Şifre en az 4 karakter olmalıdır.');
            return;
        }

        dispatch(
            registerUser({
                username: usernameInput.trim(),
                email: emailInput.trim(),
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
                    <h2>Hesap Oluştur</h2>
                    <p>Hemen kayıt olun ve görevlerinizi organize edin</p>
                </div>

                {registerSuccess && (
                    <div className="alert alert-success">
                        <CheckCircle size={18} />
                        <span>Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</span>
                    </div>
                )}

                {(error || validationError) && (
                    <div className="alert alert-error">{validationError || error}</div>
                )}

                {!registerSuccess && (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username">Kullanıcı Adı *</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    id="username"
                                    type="text"
                                    className="input-field"
                                    placeholder="kullaniciadi"
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-posta Adresi *</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    className="input-field"
                                    placeholder="ornek@email.com"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Şifre *</label>
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Şifre Tekrarı *</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? (
                                'Kayıt yapılıyor...'
                            ) : (
                                <>
                                    <span>Kayıt Ol</span>
                                    <UserPlus size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <p>
                        Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
