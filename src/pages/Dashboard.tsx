import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Container, Typography } from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) return;

      try {
        const res = await api.get('/expenses/analytics', {
          params: {
            role: user.role,
            userId: user.userId
          }
        });

        const formatted = res.data.map((item: any) => ({
          name: item._id,
          value: item.total
        }));

        setChartData(formatted);

      } catch (err: any) {
        console.error('Failed to fetch analytics:', err.response?.data?.message || err.message);
        alert('Only admins can access analytics.');
      }
    };

    fetchChartData();
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" mt={4} mb={2}>
        Dashboard
      </Typography>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Container>
  );
};

export default Dashboard;