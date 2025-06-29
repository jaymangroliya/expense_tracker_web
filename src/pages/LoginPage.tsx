import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, Alert
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, error } = useAppSelector(state => state.auth);

  const [form, setForm] = useState({
    name: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (user) {
      navigate('/expenses');
    }
  }, [user]);

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Expense Tracker Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={form.password}
            onChange={handleChange}
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Log In
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;