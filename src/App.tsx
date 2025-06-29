// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes/AppRoutes';
import store from './redux/store';
import Header from './components/Header';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Header />
                <AppRoutes />
            </BrowserRouter>
        </Provider>
    );
};

export default App;