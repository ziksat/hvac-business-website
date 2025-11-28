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
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { adminService } from '../services/adminService';
import { Technician } from '../types';

// Configuration constants
const DEFAULT_HOURLY_RATE = 25;
const DEFAULT_COLOR = '#1976d2';

interface TechnicianFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  hourlyRate: number;
  status: 'active' | 'inactive' | 'on_leave';
  color: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
  certifications: string;
  skills: string;
}

const TechnicianManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['technicians', page + 1, rowsPerPage, statusFilter],
    queryFn: () => adminService.getTechnicians(page + 1, rowsPerPage, statusFilter),
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TechnicianFormData>();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Technician>) => adminService.createTechnician(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Technician> }) =>
      adminService.updateTechnician(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteTechnician(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
  });

  const handleOpenDialog = (technician?: Technician) => {
    if (technician) {
      setEditingTechnician(technician);
      reset({
        firstName: technician.firstName,
        lastName: technician.lastName,
        email: technician.email,
        phone: technician.phone,
        hireDate: technician.hireDate ? format(new Date(technician.hireDate), 'yyyy-MM-dd') : '',
        hourlyRate: technician.hourlyRate || 0,
        status: technician.status,
        color: technician.color || '#1976d2',
        address: technician.address || '',
        city: technician.city || '',
        state: technician.state || '',
        zipCode: technician.zipCode || '',
        emergencyContact: technician.emergencyContact || '',
        emergencyPhone: technician.emergencyPhone || '',
        notes: technician.notes || '',
        certifications: technician.certifications?.join(', ') || '',
        skills: technician.skills?.join(', ') || '',
      });
    } else {
      setEditingTechnician(null);
      reset({
        status: 'active',
        color: DEFAULT_COLOR,
        hourlyRate: DEFAULT_HOURLY_RATE,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTechnician(null);
    reset({});
  };

  const onSubmit = (formData: TechnicianFormData) => {
    const technicianData: Partial<Technician> = {
      ...formData,
      certifications: formData.certifications ? formData.certifications.split(',').map(c => c.trim()) : [],
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
    };

    if (editingTechnician) {
      updateMutation.mutate({ id: editingTechnician.id, data: technicianData });
    } else {
      createMutation.mutate(technicianData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on_leave': return 'warning';
      default: return 'default';
    }
  };

  const colorOptions = [
    { value: '#1976d2', label: 'Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#ed6c02', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' },
    { value: '#d32f2f', label: 'Red' },
    { value: '#0288d1', label: 'Light Blue' },
    { value: '#388e3c', label: 'Light Green' },
    { value: '#f57c00', label: 'Amber' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Technicians
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Technician
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
            <Tab value="active" label="Active" />
            <Tab value="inactive" label="Inactive" />
            <Tab value="on_leave" label="On Leave" />
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
                      <TableCell>Technician</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Hire Date</TableCell>
                      <TableCell>Skills</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.technicians.map((technician) => (
                      <TableRow key={technician.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: technician.color || 'primary.main' }}>
                              {technician.firstName[0]}{technician.lastName[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {technician.firstName} {technician.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ${technician.hourlyRate}/hr
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{technician.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{technician.phone}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {technician.hireDate && format(new Date(technician.hireDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {technician.skills?.slice(0, 3).map((skill, index) => (
                              <Chip key={index} label={skill} size="small" variant="outlined" />
                            ))}
                            {technician.skills && technician.skills.length > 3 && (
                              <Chip label={`+${technician.skills.length - 3}`} size="small" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={technician.status.replace('_', ' ')}
                            color={getStatusColor(technician.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleOpenDialog(technician)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(technician.id)}>
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

      {/* Create/Edit Technician Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingTechnician ? 'Edit Technician' : 'Add New Technician'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  {...register('firstName', { required: 'First name is required' })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  {...register('lastName', { required: 'Last name is required' })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone *"
                  {...register('phone', { required: 'Phone is required' })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hire Date *"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('hireDate', { required: 'Hire date is required' })}
                  error={!!errors.hireDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hourly Rate ($)"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  {...register('hourlyRate', { valueAsNumber: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="active"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="on_leave">On Leave</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="color"
                  control={control}
                  defaultValue="#1976d2"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Calendar Color</InputLabel>
                      <Select {...field} label="Calendar Color">
                        {colorOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 20, height: 20, borderRadius: 1, bgcolor: option.value }} />
                              {option.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Skills"
                  placeholder="HVAC, Plumbing, Electrical (comma separated)"
                  {...register('skills')}
                  helperText="Enter skills separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Certifications"
                  placeholder="EPA 608, NATE, etc. (comma separated)"
                  {...register('certifications')}
                  helperText="Enter certifications separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  {...register('address')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  {...register('city')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  {...register('state')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  {...register('zipCode')}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Emergency Contact
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  {...register('emergencyContact')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Phone"
                  {...register('emergencyPhone')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  {...register('notes')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTechnician ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TechnicianManagement;
