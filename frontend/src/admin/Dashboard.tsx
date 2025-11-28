import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import { adminService } from '../services/adminService';

const Dashboard: React.FC = () => {
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => adminService.getCustomers(1, 1),
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => adminService.getServices(),
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: () => adminService.getServiceRequests(1, 1, 'pending'),
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => adminService.getTestimonials(1, 1),
  });

  const stats = [
    {
      title: 'Total Customers',
      value: customers?.pagination.total || 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      loading: customersLoading,
    },
    {
      title: 'Active Services',
      value: services?.length || 0,
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      loading: servicesLoading,
    },
    {
      title: 'Pending Requests',
      value: requests?.pagination.total || 0,
      icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      loading: requestsLoading,
    },
    {
      title: 'Testimonials',
      value: testimonials?.pagination.total || 0,
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      loading: testimonialsLoading,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.title}
                    </Typography>
                    {stat.loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Typography variant="h4" fontWeight={700}>
                        {stat.value}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Typography color="text.secondary">
                Activity feed coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Typography color="text.secondary">
                Quick action buttons coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
