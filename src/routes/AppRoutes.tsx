import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import ExpensesPage from '../pages/ExpensesPage';
import AddExpensePage from '../pages/AddExpensePage';
import { useAppSelector } from '../redux/hooks';

const AppRoutes = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/add-expense" element={<AddExpensePage />} />
          <Route path="*" element={<Navigate to="/expenses" />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;