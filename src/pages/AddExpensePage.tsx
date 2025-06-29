import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, MenuItem
} from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import api from '../services/api';

const categories = ['Travel', 'Meals', 'Office Supplies', 'Software'];

const AddExpensePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      userId: user.userId,
    };

    try {
      await api.post('/expenses', payload);
      alert('✅ Expense submitted successfully!');
      setForm({ amount: '', category: '', description: '', date: '' });
    } catch (error) {
      console.error('Error submitting expense:', error);
      alert('❌ Failed to submit expense.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" mt={4} mb={2}>
        Add New Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Amount"
          name="amount"
          fullWidth
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          label="Category"
          name="category"
          select
          fullWidth
          value={form.category}
          onChange={handleChange}
          required
          margin="normal"
        >
          {categories.map((cat) => (
            <MenuItem value={cat} key={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          name="description"
          fullWidth
          value={form.description}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Date"
          type="date"
          name="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Submit Expense
        </Button>
      </form>
    </Container>
  );
};

export default AddExpensePage;