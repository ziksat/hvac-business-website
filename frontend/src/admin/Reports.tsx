import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { adminService } from '../services/adminService';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'custom'>('month');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  const handleDateRangeChange = (range: 'week' | 'month' | 'quarter' | 'custom') => {
    setDateRange(range);
    const now = new Date();
    switch (range) {
      case 'week':
        setStartDate(format(subDays(now, 7), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        setGroupBy('day');
        break;
      case 'month':
        setStartDate(format(startOfMonth(now), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(now), 'yyyy-MM-dd'));
        setGroupBy('day');
        break;
      case 'quarter':
        setStartDate(format(subMonths(now, 3), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        setGroupBy('week');
        break;
      default:
        break;
    }
  };

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => adminService.getDashboardStats(),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['reports', 'revenue', startDate, endDate, groupBy],
    queryFn: () => adminService.getRevenueReport(startDate, endDate, groupBy),
    enabled: activeTab === 0,
  });

  const { data: technicianData, isLoading: technicianLoading } = useQuery({
    queryKey: ['reports', 'technician', startDate, endDate],
    queryFn: () => adminService.getTechnicianPerformance(startDate, endDate),
    enabled: activeTab === 1,
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['reports', 'jobs', startDate, endDate],
    queryFn: () => adminService.getJobsReport(startDate, endDate),
    enabled: activeTab === 2,
  });

  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ['reports', 'services', startDate, endDate],
    queryFn: () => adminService.getServiceReport(startDate, endDate),
    enabled: activeTab === 3,
  });

  const StatCard = ({ title, value, icon, color, subValue, trend }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            {subValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend === 'up' && <TrendingUpIcon color="success" fontSize="small" />}
                {trend === 'down' && <TrendingDownIcon color="error" fontSize="small" />}
                <Typography variant="caption" color={trend === 'up' ? 'success.main' : trend === 'down' ? 'error' : 'text.secondary'}>
                  {subValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ p: 1, bgcolor: `${color}15`, borderRadius: 2 }}>
            <Box sx={{ color }}>{icon}</Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Reports & Analytics
      </Typography>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue This Month"
            value={`$${(dashboardStats?.revenue?.month || 0).toLocaleString()}`}
            icon={<AttachMoneyIcon />}
            color="#2e7d32"
            subValue="+12.5% from last month"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Jobs Completed"
            value={dashboardStats?.jobStats?.completedWeek || 0}
            icon={<BuildIcon />}
            color="#1976d2"
            subValue="This week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Technicians"
            value={dashboardStats?.technicianStats?.active || 0}
            icon={<PeopleIcon />}
            color="#ed6c02"
            subValue={`${dashboardStats?.technicianStats?.onJob || 0} on job`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unpaid Invoices"
            value={`$${(dashboardStats?.invoiceStats?.unpaid || 0).toLocaleString()}`}
            icon={<ReceiptIcon />}
            color="#d32f2f"
            subValue={`${dashboardStats?.invoiceStats?.overdue || 0} overdue`}
            trend="down"
          />
        </Grid>
      </Grid>

      {/* Date Range Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="subtitle2">Date Range:</Typography>
            </Grid>
            <Grid item>
              <Button
                variant={dateRange === 'week' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleDateRangeChange('week')}
              >
                Last 7 Days
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={dateRange === 'month' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleDateRangeChange('month')}
              >
                This Month
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={dateRange === 'quarter' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleDateRangeChange('quarter')}
              >
                Last 3 Months
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={dateRange === 'custom' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setDateRange('custom')}
              >
                Custom
              </Button>
            </Grid>
            {dateRange === 'custom' && (
              <>
                <Grid item>
                  <TextField
                    size="small"
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Group By</InputLabel>
                <Select
                  value={groupBy}
                  label="Group By"
                  onChange={(e) => setGroupBy(e.target.value as 'day' | 'week' | 'month')}
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Card>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Revenue" />
          <Tab label="Technician Performance" />
          <Tab label="Jobs" />
          <Tab label="Services" />
        </Tabs>
        <CardContent>
          {/* Revenue Report */}
          {activeTab === 0 && (
            <Box>
              {revenueLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {/* Revenue Summary */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light' }}>
                        <Typography variant="h4" fontWeight={700} color="success.dark">
                          ${revenueData?.data?.reduce((sum, d) => sum + d.revenue, 0).toLocaleString() || 0}
                        </Typography>
                        <Typography variant="body2" color="success.dark">Total Revenue</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light' }}>
                        <Typography variant="h4" fontWeight={700} color="warning.dark">
                          ${revenueData?.data?.reduce((sum, d) => sum + d.cost, 0).toLocaleString() || 0}
                        </Typography>
                        <Typography variant="body2" color="warning.dark">Total Costs</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.light' }}>
                        <Typography variant="h4" fontWeight={700} color="info.dark">
                          ${revenueData?.data?.reduce((sum, d) => sum + d.profit, 0).toLocaleString() || 0}
                        </Typography>
                        <Typography variant="body2" color="info.dark">Total Profit</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Revenue Table */}
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">Cost</TableCell>
                          <TableCell align="right">Profit</TableCell>
                          <TableCell align="right">Margin</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {revenueData?.data?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell align="right">${row.revenue.toLocaleString()}</TableCell>
                            <TableCell align="right">${row.cost.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ color: row.profit >= 0 ? 'success.main' : 'error.main' }}>
                              ${row.profit.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              {row.revenue > 0 ? ((row.profit / row.revenue) * 100).toFixed(1) : 0}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Box>
          )}

          {/* Technician Performance Report */}
          {activeTab === 1 && (
            <Box>
              {technicianLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Technician</TableCell>
                        <TableCell align="center">Jobs Completed</TableCell>
                        <TableCell align="right">Revenue Generated</TableCell>
                        <TableCell align="center">Avg Rating</TableCell>
                        <TableCell align="right">Hours Worked</TableCell>
                        <TableCell align="right">Revenue/Hour</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {technicianData?.data?.map((tech) => (
                        <TableRow key={tech.technicianId}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {tech.technicianName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{tech.jobsCompleted}</TableCell>
                          <TableCell align="right">${tech.revenue.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {tech.avgRating.toFixed(1)} ⭐
                            </Box>
                          </TableCell>
                          <TableCell align="right">{tech.hoursWorked.toFixed(1)}</TableCell>
                          <TableCell align="right">
                            ${tech.hoursWorked > 0 ? (tech.revenue / tech.hoursWorked).toFixed(2) : 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Jobs Report */}
          {activeTab === 2 && (
            <Box>
              {jobsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {jobsData?.data?.map((item) => (
                    <Grid item xs={6} sm={4} md={2} key={item.status}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight={700}>
                          {item.count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {item.status.replace('_', ' ')}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Services Report */}
          {activeTab === 3 && (
            <Box>
              {serviceLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service Type</TableCell>
                        <TableCell align="center">Jobs</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Avg Revenue/Job</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {serviceData?.data?.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {service.serviceType}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{service.count}</TableCell>
                          <TableCell align="right">${service.revenue.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            ${service.count > 0 ? (service.revenue / service.count).toFixed(2) : 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
