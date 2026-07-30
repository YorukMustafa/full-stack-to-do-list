import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';

interface Props {
    children: React.ReactElement;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
