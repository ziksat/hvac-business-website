import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import { adminService } from '../services/adminService';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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
    queryFn: () => adminService.getServiceRequests(1, 5, 'pending'),
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'today'],
    queryFn: () => adminService.getJobs(1, 5, '', undefined, undefined, format(new Date(), 'yyyy-MM-dd')),
  });

  const { data: technicians, isLoading: techniciansLoading } = useQuery({
    queryKey: ['technicians', 'active'],
    queryFn: () => adminService.getTechnicians(1, 10, 'active'),
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices', 'unpaid'],
    queryFn: () => adminService.getInvoices(1, 5, 'sent'),
  });

  const { data: lowStockItems } = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: () => adminService.getLowStockItems(),
  });

  const stats = [
    {
      title: 'Total Customers',
      value: customers?.pagination.total || 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      loading: customersLoading,
      link: '/admin/customers',
    },
    {
      title: 'Active Technicians',
      value: technicians?.pagination.total || 0,
      icon: <EngineeringIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      loading: techniciansLoading,
      link: '/admin/technicians',
    },
    {
      title: 'Pending Requests',
      value: requests?.pagination.total || 0,
      icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      loading: requestsLoading,
      link: '/admin/service-requests',
    },
    {
      title: "Today's Jobs",
      value: jobs?.pagination.total || 0,
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      loading: jobsLoading,
      link: '/admin/jobs',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'scheduled': return 'info';
      case 'in_progress': return 'secondary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/jobs')}
          >
            New Job
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
              onClick={() => navigate(stat.link)}
            >
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
        {/* Recent Service Requests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Pending Service Requests
                </Typography>
                <Button size="small" onClick={() => navigate('/admin/service-requests')}>
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {requestsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : requests?.requests.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No pending requests
                </Typography>
              ) : (
                <List disablePadding>
                  {requests?.requests.slice(0, 5).map((request) => (
                    <ListItem key={request.id} divider sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.light' }}>
                          <CalendarTodayIcon color="warning" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.customerName}
                        secondary={`${request.serviceType} - ${format(new Date(request.preferredDate), 'MMM d, yyyy')}`}
                      />
                      <Chip
                        label={request.isEmergency ? 'Emergency' : 'Normal'}
                        color={request.isEmergency ? 'error' : 'default'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Jobs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Today's Jobs
                </Typography>
                <Button size="small" onClick={() => navigate('/admin/dispatch')}>
                  Dispatch Board
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {jobsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : jobs?.jobs.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No jobs scheduled for today
                </Typography>
              ) : (
                <List disablePadding>
                  {jobs?.jobs.slice(0, 5).map((job) => (
                    <ListItem key={job.id} divider sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <WorkIcon color="primary" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={job.jobNumber}
                        secondary={`${job.customerName} - ${job.serviceType}`}
                      />
                      <Chip
                        label={job.status.replace('_', ' ')}
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<WorkIcon />}
                    onClick={() => navigate('/admin/jobs')}
                    sx={{ py: 2 }}
                  >
                    Create Job
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ReceiptIcon />}
                    onClick={() => navigate('/admin/invoices')}
                    sx={{ py: 2 }}
                  >
                    New Invoice
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/admin/customers')}
                    sx={{ py: 2 }}
                  >
                    Add Customer
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TrendingUpIcon />}
                    onClick={() => navigate('/admin/reports')}
                    sx={{ py: 2 }}
                  >
                    View Reports
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts & Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Alerts
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                {(lowStockItems?.length || 0) > 0 && (
                  <ListItem divider sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'error.light' }}>
                        <WarningIcon color="error" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Low Stock Alert"
                      secondary={`${lowStockItems?.length} items at or below reorder point`}
                    />
                    <Button size="small" onClick={() => navigate('/admin/inventory')}>
                      View
                    </Button>
                  </ListItem>
                )}
                {(invoices?.pagination.total || 0) > 0 && (
                  <ListItem divider sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.light' }}>
                        <ReceiptIcon color="warning" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Unpaid Invoices"
                      secondary={`${invoices?.pagination.total} invoices awaiting payment`}
                    />
                    <Button size="small" onClick={() => navigate('/admin/invoices')}>
                      View
                    </Button>
                  </ListItem>
                )}
                {(requests?.pagination.total || 0) > 0 && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.light' }}>
                        <CalendarTodayIcon color="info" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Pending Requests"
                      secondary={`${requests?.pagination.total} service requests need attention`}
                    />
                    <Button size="small" onClick={() => navigate('/admin/service-requests')}>
                      View
                    </Button>
                  </ListItem>
                )}
                {(lowStockItems?.length || 0) === 0 && 
                 (invoices?.pagination.total || 0) === 0 && 
                 (requests?.pagination.total || 0) === 0 && (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No alerts at this time
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
