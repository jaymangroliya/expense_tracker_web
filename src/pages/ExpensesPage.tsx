import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import api from '../services/api';
import { useAppSelector } from '../redux/hooks';

const categories = ['All', 'Travel', 'Meals', 'Office Supplies', 'Software'];

const ExpensesPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;

      const res = await api.get('/expenses', {
        params: {
          role: user.role,
          userId: user.userId,
        }
      });

      setExpenses(res.data);
    };

    fetchExpenses();
  }, [user, selectedCategory, selectedDate]);

  const isAdmin = user?.role === 'admin';

  const filteredExpenses = expenses.filter((expense) => {
    const categoryMatch = selectedCategory === 'All' || expense.category === selectedCategory;
    const dateMatch = !selectedDate || expense.date === selectedDate;
    const roleMatch = isAdmin || expense.userId === user?.userId;

    return categoryMatch && dateMatch && roleMatch;
  });

  const handleStatusChange = async (expenseId: string, status: 'approved' | 'rejected') => {
    await api.patch(`/expenses/${expenseId}`, { status });
    alert(`Expense ${status}`);
  };

  return (
    <Container>
      <Typography variant="h4" mt={4} mb={2}>
        {isAdmin ? 'Team Expenses' : 'My Expenses'}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Filter by Category"
            fullWidth
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Filter by Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filteredExpenses.length === 0 ? (
          <Typography variant="body2" mt={2}>
            No expenses found for selected filters.
          </Typography>
        ) : (
          filteredExpenses.map((expense) => (
            <Grid item xs={12} sm={6} md={4} key={expense._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{expense.category}</Typography>
                  <Typography>Amount: ${expense.amount}</Typography>
                  <Typography>Description: {expense.description}</Typography>
                  <Typography>Date: {expense.date}</Typography>
                  <Typography>Status: {expense.status}</Typography>
                </CardContent>
                {isAdmin && (
                  <CardActions>
                    <Button color="success" size="small" onClick={() => handleStatusChange(expense._id, 'approved')}>
                      Approve
                    </Button>
                    <Button color="error" size="small" onClick={() => handleStatusChange(expense._id, 'rejected')}>
                      Reject
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default ExpensesPage;