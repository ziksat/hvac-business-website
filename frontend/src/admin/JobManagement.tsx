import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Autocomplete,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { adminService } from '../services/adminService';
import { Job, Customer } from '../types';

interface JobFormData {
  customerId: number;
  serviceType: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'emergency';
  scheduledStartDate: string;
  scheduledEndDate: string;
  estimatedDuration: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  accessNotes: string;
  customerNotes: string;
}

const JobManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', page + 1, rowsPerPage, statusFilter],
    queryFn: () => adminService.getJobs(page + 1, rowsPerPage, statusFilter),
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers', 1, 100],
    queryFn: () => adminService.getCustomers(1, 100),
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => adminService.getServices(),
  });

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<JobFormData>();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Job>) => adminService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Job> }) =>
      adminService.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminService.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const handleOpenDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      const customer = customersData?.customers.find(c => c.id === job.customerId);
      setSelectedCustomer(customer || null);
      reset({
        customerId: job.customerId,
        serviceType: job.serviceType,
        description: job.description || '',
        priority: job.priority,
        scheduledStartDate: job.scheduledStartDate ? format(new Date(job.scheduledStartDate), "yyyy-MM-dd'T'HH:mm") : '',
        scheduledEndDate: job.scheduledEndDate ? format(new Date(job.scheduledEndDate), "yyyy-MM-dd'T'HH:mm") : '',
        estimatedDuration: job.estimatedDuration || 60,
        address: job.address,
        city: job.city,
        state: job.state,
        zipCode: job.zipCode,
        accessNotes: job.accessNotes || '',
        customerNotes: job.customerNotes || '',
      });
    } else {
      setEditingJob(null);
      setSelectedCustomer(null);
      reset({
        priority: 'normal',
        estimatedDuration: 60,
        state: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingJob(null);
    setSelectedCustomer(null);
    reset({});
  };

  const handleViewJob = async (job: Job) => {
    try {
      const fullJob = await adminService.getJobById(job.id);
      setViewingJob(fullJob);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const onSubmit = (formData: JobFormData) => {
    const jobData = {
      ...formData,
      customerId: selectedCustomer?.id || formData.customerId,
    };

    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data: jobData });
    } else {
      createMutation.mutate(jobData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCustomerChange = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setValue('address', customer.address);
      setValue('city', customer.city);
      setValue('state', customer.state);
      setValue('zipCode', customer.zipCode);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'dispatched': return 'secondary';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'on_hold': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'error';
      case 'high': return 'warning';
      case 'normal': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const customers = customersData?.customers || [];
  const services = servicesData || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Jobs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Job
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Tabs
            value={statusFilter}
            onChange={(_, value) => { setStatusFilter(value); setPage(0); }}
            sx={{ mb: 2 }}
          >
            <Tab value="" label="All" />
            <Tab value="scheduled" label="Scheduled" />
            <Tab value="dispatched" label="Dispatched" />
            <Tab value="in_progress" label="In Progress" />
            <Tab value="completed" label="Completed" />
            <Tab value="cancelled" label="Cancelled" />
          </Tabs>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Scheduled</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {job.jobNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{job.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {job.city}, {job.state}
                          </Typography>
                        </TableCell>
                        <TableCell>{job.serviceType}</TableCell>
                        <TableCell>
                          {job.scheduledStartDate && format(new Date(job.scheduledStartDate), 'MMM d, yyyy')}
                          <Typography variant="caption" display="block" color="text.secondary">
                            {job.scheduledStartDate && format(new Date(job.scheduledStartDate), 'h:mm a')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={job.priority}
                            color={getPriorityColor(job.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={job.status.replace('_', ' ')}
                            color={getStatusColor(job.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleViewJob(job)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleOpenDialog(job)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(job.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={data?.pagination.total || 0}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Job Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingJob ? 'Edit Job' : 'Create New Job'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.email}`}
                  value={selectedCustomer}
                  onChange={(_, value) => handleCustomerChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer *"
                      error={!selectedCustomer && !editingJob}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="serviceType"
                  control={control}
                  rules={{ required: 'Service type is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.serviceType}>
                      <InputLabel>Service Type *</InputLabel>
                      <Select {...field} label="Service Type *">
                        {services.map((service) => (
                          <MenuItem key={service.id} value={service.name}>
                            {service.name}
                          </MenuItem>
                        ))}
                        <MenuItem value="AC Repair">AC Repair</MenuItem>
                        <MenuItem value="AC Installation">AC Installation</MenuItem>
                        <MenuItem value="Heating Repair">Heating Repair</MenuItem>
                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                        <MenuItem value="Emergency Service">Emergency Service</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="priority"
                  control={control}
                  defaultValue="normal"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select {...field} label="Priority">
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="emergency">Emergency</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  {...register('description')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scheduled Start *"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  {...register('scheduledStartDate', { required: 'Start date is required' })}
                  error={!!errors.scheduledStartDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scheduled End"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  {...register('scheduledEndDate')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estimated Duration (minutes)"
                  type="number"
                  {...register('estimatedDuration', { valueAsNumber: true })}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Job Location
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address *"
                  {...register('address', { required: 'Address is required' })}
                  error={!!errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City *"
                  {...register('city', { required: 'City is required' })}
                  error={!!errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State *"
                  {...register('state', { required: 'State is required' })}
                  error={!!errors.state}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Zip Code *"
                  {...register('zipCode', { required: 'Zip code is required' })}
                  error={!!errors.zipCode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Access Notes"
                  placeholder="Gate code, parking instructions, etc."
                  multiline
                  rows={2}
                  {...register('accessNotes')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Notes"
                  multiline
                  rows={2}
                  {...register('customerNotes')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingJob ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Job Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Job Details - {viewingJob?.jobNumber}
        </DialogTitle>
        <DialogContent>
          {viewingJob && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                <Typography variant="body1">{viewingJob.customerName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip
                  label={viewingJob.status.replace('_', ' ')}
                  color={getStatusColor(viewingJob.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Service Type</Typography>
                <Typography variant="body1">{viewingJob.serviceType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                <Chip
                  label={viewingJob.priority}
                  color={getPriorityColor(viewingJob.priority)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1">{viewingJob.description || 'No description'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Scheduled Start</Typography>
                <Typography variant="body1">
                  {viewingJob.scheduledStartDate && format(new Date(viewingJob.scheduledStartDate), 'MMM d, yyyy h:mm a')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Estimated Duration</Typography>
                <Typography variant="body1">{viewingJob.estimatedDuration || 'N/A'} minutes</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography variant="body1">
                  {viewingJob.address}, {viewingJob.city}, {viewingJob.state} {viewingJob.zipCode}
                </Typography>
              </Grid>
              {viewingJob.accessNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Access Notes</Typography>
                  <Typography variant="body1">{viewingJob.accessNotes}</Typography>
                </Grid>
              )}
              {viewingJob.technicians && viewingJob.technicians.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Assigned Technicians</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {viewingJob.technicians.map((tech) => (
                      <Chip
                        key={tech.id}
                        label={`${tech.firstName} ${tech.lastName}`}
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Status Update Buttons */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Update Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['scheduled', 'dispatched', 'in_progress', 'completed', 'on_hold', 'cancelled'].map((status) => (
                    <Button
                      key={status}
                      size="small"
                      variant={viewingJob.status === status ? 'contained' : 'outlined'}
                      onClick={() => {
                        updateStatusMutation.mutate({ id: viewingJob.id, status });
                        setViewingJob({ ...viewingJob, status: status as Job['status'] });
                      }}
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => {
            setViewDialogOpen(false);
            if (viewingJob) handleOpenDialog(viewingJob);
          }}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobManagement;
