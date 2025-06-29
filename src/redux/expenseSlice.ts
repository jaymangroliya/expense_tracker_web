import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Expense {
    id: string;
    userId: string;
    amount: number;
    category: string;
    description: string;
    date: string;
}

const initialState: { expenses: Expense[] } = {
    expenses: [],
};

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        addExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
            const newExpense: Expense = { id: Date.now().toString(), ...action.payload };
            state.expenses.push(newExpense);
        },
    },
});

export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;