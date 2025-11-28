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
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { adminService } from '../services/adminService';
import { ServiceRequest } from '../types';

const ServiceRequestManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['serviceRequests', page + 1, rowsPerPage, statusFilter],
    queryFn: () => adminService.getServiceRequests(page + 1, rowsPerPage, statusFilter),
  });

  const { register, handleSubmit, control, reset } = useForm<ServiceRequest>();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ServiceRequest> }) =>
      adminService.updateServiceRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteServiceRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  const handleOpenDialog = (request: ServiceRequest) => {
    setEditingRequest(request);
    reset(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRequest(null);
    reset({});
  };

  const onSubmit = (data: ServiceRequest) => {
    if (editingRequest) {
      updateMutation.mutate({ id: editingRequest.id, data });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Service Requests
      </Typography>

      <Card>
        <CardContent>
          <Tabs
            value={statusFilter}
            onChange={(_, value) => { setStatusFilter(value); setPage(0); }}
            sx={{ mb: 2 }}
          >
            <Tab value="" label="All" />
            <Tab value="pending" label="Pending" />
            <Tab value="confirmed" label="Confirmed" />
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
                      <TableCell>Customer</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Emergency</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {request.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>{request.serviceType}</TableCell>
                        <TableCell>
                          {format(new Date(request.preferredDate), 'MMM d, yyyy')}
                          {request.preferredTime && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {request.preferredTime}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={getStatusColor(request.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {request.isEmergency && (
                            <Chip label="Yes" color="error" size="small" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleOpenDialog(request)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(request.id)}>
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Update Service Request</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Customer</Typography>
                <Typography>{editingRequest?.customerName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Service</Typography>
                <Typography>{editingRequest?.serviceType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Contact</Typography>
                <Typography>{editingRequest?.email}</Typography>
                <Typography>{editingRequest?.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Preferred Date</Typography>
                <Typography>
                  {editingRequest?.preferredDate && format(new Date(editingRequest.preferredDate), 'MMMM d, yyyy')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Message</Typography>
                <Typography>{editingRequest?.message || 'No message'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assigned Technician"
                  {...register('assignedTechnician')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scheduled Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('scheduledDate')}
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
            <Button type="submit" variant="contained">Update</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ServiceRequestManagement;
