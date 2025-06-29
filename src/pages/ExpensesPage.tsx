import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip
} from '@mui/material';
import api from '../services/api';
import { useAppSelector } from '../redux/hooks';

const ExpensesPage = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [expenses, setExpenses] = useState<any[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!user) return;

            try {
                const res = await api.get('/expenses', {
                    params: {
                        role: user.role,
                        userId: user.userId
                    }
                });
                setExpenses(res.data);
            } catch (err) {
                console.error('Failed to fetch expenses', err);
            }
        };

        fetchExpenses();
    }, [user]);

    const isAdmin = user?.role === 'admin';

    const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await api.patch(`/expenses/${id}`, { status });

            // Refresh the list after updating
            setExpenses((prev) =>
                prev.map((expense) =>
                    expense._id === id ? { ...expense, status } : expense
                )
            );
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    return (
        <Container>
            <Typography variant="h4" mt={4} mb={2}>
                {isAdmin ? 'Team Expenses' : 'My Expenses'}
            </Typography>

            <Grid container spacing={2}>
                {expenses.length === 0 ? (
                    <Typography>No expenses found.</Typography>
                ) : (
                    expenses.map((expense) => (
                        <Grid item xs={12} sm={6} md={4} key={expense._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{expense.category}</Typography>
                                    <Typography>Amount: ${expense.amount}</Typography>
                                    <Typography>Description: {expense.description}</Typography>
                                    <Typography>Date: {expense.date}</Typography>
                                </CardContent>
                                <CardActions>
                                    {/* Show status CHIPS to everyone */}
                                    <Chip
                                        label={
                                            expense.status === 'approved'
                                                ? 'Approved'
                                                : expense.status === 'rejected'
                                                    ? 'Rejected'
                                                    : 'In Review' // for pending or missing
                                        }
                                        color={
                                            expense.status === 'approved'
                                                ? 'success'
                                                : expense.status === 'rejected'
                                                    ? 'error'
                                                    : 'warning'
                                        }
                                        variant="outlined"
                                        sx={{ mr: 2 }}
                                    />

                                    {/* Show action buttons to ADMIN only if pending */}
                                    {isAdmin && (expense.status === 'pending' || !expense.status) && (
                                        <>
                                            <Button
                                                size="small"
                                                color="success"
                                                onClick={() => handleStatusChange(expense._id, 'approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleStatusChange(expense._id, 'rejected')}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default ExpensesPage;