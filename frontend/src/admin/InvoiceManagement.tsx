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
import PaymentIcon from '@mui/icons-material/Payment';
import { adminService } from '../services/adminService';
import { Invoice, InvoiceItem, Customer, Payment } from '../types';

interface InvoiceFormData {
  customerId: number;
  dueDate: string;
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

interface PaymentFormData {
  amount: number;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'other';
  paymentDate: string;
  referenceNumber: string;
  notes: string;
}

const InvoiceManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', page + 1, rowsPerPage, statusFilter],
    queryFn: () => adminService.getInvoices(page + 1, rowsPerPage, statusFilter),
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers', 1, 100],
    queryFn: () => adminService.getCustomers(1, 100),
  });

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<InvoiceFormData>({
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

  const paymentForm = useForm<PaymentFormData>({
    defaultValues: {
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: 'credit_card',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Invoice>) => adminService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Invoice> }) =>
      adminService.updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id: number) => adminService.sendInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: ({ invoiceId, data }: { invoiceId: number; data: Partial<Payment> }) =>
      adminService.recordPayment(invoiceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setPaymentDialogOpen(false);
      paymentForm.reset();
    },
  });

  const handleOpenDialog = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      const customer = customersData?.customers.find(c => c.id === invoice.customerId);
      setSelectedCustomer(customer || null);
      reset({
        customerId: invoice.customerId,
        dueDate: invoice.dueDate ? format(new Date(invoice.dueDate), 'yyyy-MM-dd') : '',
        taxRate: invoice.taxRate,
        discount: invoice.discount,
        discountType: invoice.discountType,
        notes: invoice.notes || '',
        terms: invoice.terms || '',
        items: invoice.items?.map(item => ({
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })) || [{ itemType: 'service', description: '', quantity: 1, unitPrice: 0 }],
      });
    } else {
      setEditingInvoice(null);
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
    setEditingInvoice(null);
    setSelectedCustomer(null);
    reset({});
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    try {
      const fullInvoice = await adminService.getInvoiceById(invoice.id);
      setViewingInvoice(fullInvoice);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };

  const handleOpenPaymentDialog = () => {
    if (viewingInvoice) {
      paymentForm.reset({
        amount: viewingInvoice.balanceDue,
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: 'credit_card',
      });
      setPaymentDialogOpen(true);
    }
  };

  const onSubmit = (formData: InvoiceFormData) => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountAmount = formData.discountType === 'percentage' 
      ? subtotal * (formData.discount / 100)
      : formData.discount;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (formData.taxRate / 100);
    const total = taxableAmount + taxAmount;

    const invoiceData: Partial<Invoice> = {
      customerId: selectedCustomer?.id || formData.customerId,
      dueDate: formData.dueDate,
      taxRate: formData.taxRate,
      discount: formData.discount,
      discountType: formData.discountType,
      notes: formData.notes,
      terms: formData.terms,
      subtotal,
      taxAmount,
      total,
      balanceDue: total,
      items: formData.items.map((item, index) => ({
        ...item,
        total: item.quantity * item.unitPrice,
        sortOrder: index,
      })) as InvoiceItem[],
    };

    if (editingInvoice) {
      updateMutation.mutate({ id: editingInvoice.id, data: invoiceData });
    } else {
      createMutation.mutate(invoiceData);
    }
  };

  const onPaymentSubmit = (formData: PaymentFormData) => {
    if (viewingInvoice) {
      paymentMutation.mutate({
        invoiceId: viewingInvoice.id,
        data: formData,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSend = (id: number) => {
    if (window.confirm('Send this invoice to the customer?')) {
      sendMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'sent': return 'info';
      case 'viewed': return 'secondary';
      case 'partial': return 'warning';
      case 'paid': return 'success';
      case 'overdue': return 'error';
      case 'void': return 'default';
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
          Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Invoice
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
            <Tab value="partial" label="Partial" />
            <Tab value="paid" label="Paid" />
            <Tab value="overdue" label="Overdue" />
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
                      <TableCell>Invoice #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {invoice.invoiceNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{invoice.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {invoice.customerEmail}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {format(new Date(invoice.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {invoice.dueDate && format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${invoice.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            color={invoice.balanceDue > 0 ? 'error' : 'success.main'}
                          >
                            ${invoice.balanceDue.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.status}
                            color={getStatusColor(invoice.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleViewInvoice(invoice)}>
                            <VisibilityIcon />
                          </IconButton>
                          {invoice.status === 'draft' && (
                            <>
                              <IconButton size="small" onClick={() => handleOpenDialog(invoice)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton size="small" color="primary" onClick={() => handleSend(invoice.id)}>
                                <SendIcon />
                              </IconButton>
                            </>
                          )}
                          <IconButton size="small" color="error" onClick={() => handleDelete(invoice.id)}>
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

      {/* Create/Edit Invoice Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
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
                      error={!selectedCustomer && !editingInvoice}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('dueDate')}
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
              {editingInvoice ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Invoice {viewingInvoice?.invoiceNumber}
        </DialogTitle>
        <DialogContent>
          {viewingInvoice && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1">{viewingInvoice.customerName}</Typography>
                  <Typography variant="body2">{viewingInvoice.customerEmail}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={viewingInvoice.status}
                    color={getStatusColor(viewingInvoice.status)}
                    size="small"
                  />
                </Grid>
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
                    {viewingInvoice.items?.map((item, index) => (
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
                    <Typography>${viewingInvoice.subtotal.toFixed(2)}</Typography>
                  </Grid>
                  {viewingInvoice.discount > 0 && (
                    <>
                      <Grid item xs={6}>
                        <Typography>Discount:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography color="error">-${viewingInvoice.discount.toFixed(2)}</Typography>
                      </Grid>
                    </>
                  )}
                  {viewingInvoice.taxAmount > 0 && (
                    <>
                      <Grid item xs={6}>
                        <Typography>Tax ({viewingInvoice.taxRate}%):</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography>${viewingInvoice.taxAmount.toFixed(2)}</Typography>
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
                    <Typography fontWeight={700}>${viewingInvoice.total.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Amount Paid:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography color="success.main">${viewingInvoice.amountPaid.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontWeight={700}>Balance Due:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography fontWeight={700} color={viewingInvoice.balanceDue > 0 ? 'error' : 'success.main'}>
                      ${viewingInvoice.balanceDue.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Payment History */}
              {viewingInvoice.payments && viewingInvoice.payments.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    Payment History
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell>Reference</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {viewingInvoice.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{format(new Date(payment.paymentDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{payment.paymentMethod.replace('_', ' ')}</TableCell>
                            <TableCell>{payment.referenceNumber || '-'}</TableCell>
                            <TableCell align="right">${payment.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {viewingInvoice && viewingInvoice.balanceDue > 0 && (
            <Button
              variant="contained"
              startIcon={<PaymentIcon />}
              onClick={handleOpenPaymentDialog}
            >
              Record Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Invoice: {viewingInvoice?.invoiceNumber} | Balance Due: ${viewingInvoice?.balanceDue.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  {...paymentForm.register('amount', { required: true, valueAsNumber: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="paymentMethod"
                  control={paymentForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Payment Method</InputLabel>
                      <Select {...field} label="Payment Method">
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="check">Check</MenuItem>
                        <MenuItem value="credit_card">Credit Card</MenuItem>
                        <MenuItem value="debit_card">Debit Card</MenuItem>
                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Payment Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...paymentForm.register('paymentDate')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  {...paymentForm.register('referenceNumber')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  {...paymentForm.register('notes')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Record Payment
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default InvoiceManagement;
