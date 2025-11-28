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
  Divider,
  Paper,
  Autocomplete,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import { adminService } from '../services/adminService';
import { Estimate, EstimateItem, Customer } from '../types';

interface EstimateFormData {
  customerId: number;
  title: string;
  description: string;
  validUntil: string;
  taxRate: number;
  discount: number;
  discountType: 'fixed' | 'percentage';
  notes: string;
  terms: string;
  items: {
    itemType: 'service' | 'part' | 'labor' | 'discount';
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

const EstimateManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [viewingEstimate, setViewingEstimate] = useState<Estimate | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['estimates', page + 1, rowsPerPage, statusFilter],
    queryFn: () => adminService.getEstimates(page + 1, rowsPerPage, statusFilter),
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers', 1, 100],
    queryFn: () => adminService.getCustomers(1, 100),
  });

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<EstimateFormData>({
    defaultValues: {
      items: [{ itemType: 'service', description: '', quantity: 1, unitPrice: 0 }],
      taxRate: 0,
      discount: 0,
      discountType: 'fixed',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Estimate>) => adminService.createEstimate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Estimate> }) =>
      adminService.updateEstimate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteEstimate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id: number) => adminService.sendEstimate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
  });

  const convertToJobMutation = useMutation({
    mutationFn: (id: number) => adminService.convertEstimateToJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setViewDialogOpen(false);
    },
  });

  const handleOpenDialog = (estimate?: Estimate) => {
    if (estimate) {
      setEditingEstimate(estimate);
      const customer = customersData?.customers.find(c => c.id === estimate.customerId);
      setSelectedCustomer(customer || null);
      reset({
        customerId: estimate.customerId,
        title: estimate.title,
        description: estimate.description || '',
        validUntil: estimate.validUntil ? format(new Date(estimate.validUntil), 'yyyy-MM-dd') : '',
        taxRate: estimate.taxRate,
        discount: estimate.discount,
        discountType: estimate.discountType,
        notes: estimate.notes || '',
        terms: estimate.terms || '',
        items: estimate.items?.map(item => ({
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })) || [{ itemType: 'service', description: '', quantity: 1, unitPrice: 0 }],
      });
    } else {
      setEditingEstimate(null);
      setSelectedCustomer(null);
      reset({
        items: [{ itemType: 'service', description: '', quantity: 1, unitPrice: 0 }],
        taxRate: 0,
        discount: 0,
        discountType: 'fixed',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEstimate(null);
    setSelectedCustomer(null);
    reset({});
  };

  const handleViewEstimate = async (estimate: Estimate) => {
    try {
      const fullEstimate = await adminService.getEstimateById(estimate.id);
      setViewingEstimate(fullEstimate);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching estimate details:', error);
    }
  };

  const onSubmit = (formData: EstimateFormData) => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountAmount = formData.discountType === 'percentage' 
      ? subtotal * (formData.discount / 100)
      : formData.discount;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (formData.taxRate / 100);
    const total = taxableAmount + taxAmount;

    const estimateData: Partial<Estimate> = {
      customerId: selectedCustomer?.id || formData.customerId,
      title: formData.title,
      description: formData.description,
      validUntil: formData.validUntil,
      taxRate: formData.taxRate,
      discount: formData.discount,
      discountType: formData.discountType,
      notes: formData.notes,
      terms: formData.terms,
      subtotal,
      taxAmount,
      total,
      items: formData.items.map((item, index) => ({
        ...item,
        total: item.quantity * item.unitPrice,
        sortOrder: index,
      })) as EstimateItem[],
    };

    if (editingEstimate) {
      updateMutation.mutate({ id: editingEstimate.id, data: estimateData });
    } else {
      createMutation.mutate(estimateData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this estimate?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSend = (id: number) => {
    if (window.confirm('Send this estimate to the customer?')) {
      sendMutation.mutate(id);
    }
  };

  const handleConvertToJob = () => {
    if (viewingEstimate && window.confirm('Convert this estimate to a job?')) {
      convertToJobMutation.mutate(viewingEstimate.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'sent': return 'info';
      case 'viewed': return 'secondary';
      case 'approved': return 'success';
      case 'declined': return 'error';
      case 'expired': return 'warning';
      default: return 'default';
    }
  };

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate') || 0;
  const watchedDiscount = watch('discount') || 0;
  const watchedDiscountType = watch('discountType') || 'fixed';

  const calculateTotals = () => {
    const subtotal = watchedItems?.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0) || 0;
    const discountAmount = watchedDiscountType === 'percentage' 
      ? subtotal * (watchedDiscount / 100)
      : watchedDiscount;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (watchedTaxRate / 100);
    const total = taxableAmount + taxAmount;
    return { subtotal, discountAmount, taxAmount, total };
  };

  const totals = calculateTotals();
  const customers = customersData?.customers || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Estimates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Estimate
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
            <Tab value="draft" label="Draft" />
            <Tab value="sent" label="Sent" />
            <Tab value="approved" label="Approved" />
            <Tab value="declined" label="Declined" />
            <Tab value="expired" label="Expired" />
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
                      <TableCell>Estimate #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Valid Until</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.estimates.map((estimate) => (
                      <TableRow key={estimate.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {estimate.estimateNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{estimate.customerName}</Typography>
                        </TableCell>
                        <TableCell>{estimate.title}</TableCell>
                        <TableCell>
                          {format(new Date(estimate.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {estimate.validUntil && format(new Date(estimate.validUntil), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${estimate.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={estimate.status}
                            color={getStatusColor(estimate.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleViewEstimate(estimate)}>
                            <VisibilityIcon />
                          </IconButton>
                          {estimate.status === 'draft' && (
                            <>
                              <IconButton size="small" onClick={() => handleOpenDialog(estimate)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton size="small" color="primary" onClick={() => handleSend(estimate.id)}>
                                <SendIcon />
                              </IconButton>
                            </>
                          )}
                          <IconButton size="small" color="error" onClick={() => handleDelete(estimate.id)}>
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

      {/* Create/Edit Estimate Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingEstimate ? 'Edit Estimate' : 'Create New Estimate'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.email}`}
                  value={selectedCustomer}
                  onChange={(_, value) => setSelectedCustomer(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer *"
                      error={!selectedCustomer && !editingEstimate}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valid Until"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('validUntil')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title *"
                  {...register('title', { required: 'Title is required' })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  {...register('description')}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Line Items
                </Typography>
                {fields.map((field, index) => (
                  <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Controller
                          name={`items.${index}.itemType`}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth size="small">
                              <InputLabel>Type</InputLabel>
                              <Select {...field} label="Type">
                                <MenuItem value="service">Service</MenuItem>
                                <MenuItem value="part">Part</MenuItem>
                                <MenuItem value="labor">Labor</MenuItem>
                                <MenuItem value="discount">Discount</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Description"
                          {...register(`items.${index}.description`)}
                        />
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Qty"
                          type="number"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Price"
                          type="number"
                          inputProps={{ step: 0.01 }}
                          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight={600}>
                            ${((watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.unitPrice || 0)).toFixed(2)}
                          </Typography>
                          {fields.length > 1 && (
                            <IconButton size="small" color="error" onClick={() => remove(index)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => append({ itemType: 'service', description: '', quantity: 1, unitPrice: 0 })}
                >
                  Add Item
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  {...register('taxRate', { valueAsNumber: true })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  {...register('discount', { valueAsNumber: true })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Discount Type</InputLabel>
                      <Select {...field} label="Discount Type">
                        <MenuItem value="fixed">Fixed ($)</MenuItem>
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Totals */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Subtotal:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">${totals.subtotal.toFixed(2)}</Typography>
                    </Grid>
                    {totals.discountAmount > 0 && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2">Discount:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color="error">-${totals.discountAmount.toFixed(2)}</Typography>
                        </Grid>
                      </>
                    )}
                    {totals.taxAmount > 0 && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2">Tax ({watchedTaxRate}%):</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          <Typography variant="body2">${totals.taxAmount.toFixed(2)}</Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" fontWeight={700}>Total:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1" fontWeight={700}>${totals.total.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  {...register('notes')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Terms & Conditions"
                  multiline
                  rows={2}
                  {...register('terms')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingEstimate ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Estimate Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Estimate {viewingEstimate?.estimateNumber}
        </DialogTitle>
        <DialogContent>
          {viewingEstimate && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1">{viewingEstimate.customerName}</Typography>
                  <Typography variant="body2">{viewingEstimate.customerEmail}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={viewingEstimate.status}
                    color={getStatusColor(viewingEstimate.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                  <Typography variant="body1">{viewingEstimate.title}</Typography>
                </Grid>
                {viewingEstimate.description && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{viewingEstimate.description}</Typography>
                  </Grid>
                )}
              </Grid>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewingEstimate.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">{item.description}</Typography>
                          <Chip label={item.itemType} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography>Subtotal:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography>${viewingEstimate.subtotal.toFixed(2)}</Typography>
                  </Grid>
                  {viewingEstimate.discount > 0 && (
                    <>
                      <Grid item xs={6}>
                        <Typography>Discount:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography color="error">-${viewingEstimate.discount.toFixed(2)}</Typography>
                      </Grid>
                    </>
                  )}
                  {viewingEstimate.taxAmount > 0 && (
                    <>
                      <Grid item xs={6}>
                        <Typography>Tax ({viewingEstimate.taxRate}%):</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography>${viewingEstimate.taxAmount.toFixed(2)}</Typography>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontWeight={700}>Total:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography fontWeight={700}>${viewingEstimate.total.toFixed(2)}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {viewingEstimate && viewingEstimate.status === 'approved' && (
            <Button
              variant="contained"
              startIcon={<WorkIcon />}
              onClick={handleConvertToJob}
            >
              Convert to Job
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstimateManagement;
