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
  InputAdornment,
  Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { adminService } from '../services/adminService';
import { InventoryItem } from '../types';

interface InventoryFormData {
  sku: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  unitCost: number;
  sellingPrice: number;
  quantityOnHand: number;
  reorderPoint: number;
  reorderQuantity: number;
  location: string;
  supplier: string;
  supplierPartNumber: string;
  isActive: boolean;
}

const InventoryManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [stockItem, setStockItem] = useState<InventoryItem | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<{ quantity: number; type: 'add' | 'subtract' }>({ quantity: 0, type: 'add' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['inventory', page + 1, rowsPerPage, categoryFilter, searchTerm],
    queryFn: () => adminService.getInventory(page + 1, rowsPerPage, categoryFilter, searchTerm),
  });

  const { data: lowStockData } = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: () => adminService.getLowStockItems(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['inventory', 'categories'],
    queryFn: () => adminService.getInventoryCategories(),
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<InventoryFormData>();

  const createMutation = useMutation({
    mutationFn: (data: Partial<InventoryItem>) => adminService.createInventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InventoryItem> }) =>
      adminService.updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const stockMutation = useMutation({
    mutationFn: ({ id, quantity, type }: { id: number; quantity: number; type: 'add' | 'subtract' }) =>
      adminService.updateInventoryStock(id, quantity, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setStockDialogOpen(false);
      setStockItem(null);
    },
  });

  const handleOpenDialog = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      reset({
        sku: item.sku,
        name: item.name,
        description: item.description || '',
        category: item.category,
        brand: item.brand || '',
        unitCost: item.unitCost,
        sellingPrice: item.sellingPrice,
        quantityOnHand: item.quantityOnHand,
        reorderPoint: item.reorderPoint,
        reorderQuantity: item.reorderQuantity,
        location: item.location || '',
        supplier: item.supplier || '',
        supplierPartNumber: item.supplierPartNumber || '',
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      reset({
        isActive: true,
        quantityOnHand: 0,
        reorderPoint: 5,
        reorderQuantity: 10,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    reset({});
  };

  const handleOpenStockDialog = (item: InventoryItem) => {
    setStockItem(item);
    setStockAdjustment({ quantity: 0, type: 'add' });
    setStockDialogOpen(true);
  };

  const onSubmit = (formData: InventoryFormData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStockAdjustment = () => {
    if (stockItem && stockAdjustment.quantity > 0) {
      stockMutation.mutate({
        id: stockItem.id,
        quantity: stockAdjustment.quantity,
        type: stockAdjustment.type,
      });
    }
  };

  const categories = categoriesData || ['Parts', 'Filters', 'Tools', 'Supplies', 'Equipment'];
  const lowStockItems = lowStockData || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Item
        </Button>
      </Box>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <Typography variant="body2">
            <strong>{lowStockItems.length} items</strong> are at or below reorder point.{' '}
            {lowStockItems.slice(0, 3).map(item => item.name).join(', ')}
            {lowStockItems.length > 3 && ` and ${lowStockItems.length - 3} more...`}
          </Typography>
        </Alert>
      )}

      <Card>
        <CardContent>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

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
                      <TableCell>SKU</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">In Stock</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {item.sku}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{item.name}</Typography>
                          {item.brand && (
                            <Typography variant="caption" color="text.secondary">
                              {item.brand}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip label={item.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">${item.unitCost.toFixed(2)}</TableCell>
                        <TableCell align="right">${item.sellingPrice.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={item.quantityOnHand <= item.reorderPoint ? 'error' : 'text.primary'}
                            >
                              {item.quantityOnHand}
                            </Typography>
                            <Box>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleOpenStockDialog(item)}
                              >
                                <AddCircleIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {item.quantityOnHand <= item.reorderPoint ? (
                            <Chip label="Low Stock" color="error" size="small" />
                          ) : item.isActive ? (
                            <Chip label="Active" color="success" size="small" />
                          ) : (
                            <Chip label="Inactive" size="small" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
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

      {/* Create/Edit Item Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SKU *"
                  {...register('sku', { required: 'SKU is required' })}
                  error={!!errors.sku}
                  helperText={errors.sku?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name *"
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel>Category *</InputLabel>
                      <Select {...field} label="Category *">
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                        <MenuItem value="Parts">Parts</MenuItem>
                        <MenuItem value="Filters">Filters</MenuItem>
                        <MenuItem value="Tools">Tools</MenuItem>
                        <MenuItem value="Supplies">Supplies</MenuItem>
                        <MenuItem value="Equipment">Equipment</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  {...register('brand')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Unit Cost *"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  {...register('unitCost', { required: true, valueAsNumber: true })}
                  error={!!errors.unitCost}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Selling Price *"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  {...register('sellingPrice', { required: true, valueAsNumber: true })}
                  error={!!errors.sellingPrice}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Quantity On Hand"
                  type="number"
                  {...register('quantityOnHand', { valueAsNumber: true })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Reorder Point"
                  type="number"
                  {...register('reorderPoint', { valueAsNumber: true })}
                  helperText="Alert when stock falls below"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Reorder Quantity"
                  type="number"
                  {...register('reorderQuantity', { valueAsNumber: true })}
                  helperText="Suggested order quantity"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="e.g., Warehouse A, Bin 12"
                  {...register('location')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Supplier"
                  {...register('supplier')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Supplier Part Number"
                  {...register('supplierPartNumber')}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="isActive"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={field.value ? 'active' : 'inactive'}
                        onChange={(e) => field.onChange(e.target.value === 'active')}
                        label="Status"
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Stock Adjustment Dialog */}
      <Dialog open={stockDialogOpen} onClose={() => setStockDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adjust Stock</DialogTitle>
        <DialogContent>
          {stockItem && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {stockItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                SKU: {stockItem.sku} | Current Stock: {stockItem.quantityOnHand}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Adjustment Type</InputLabel>
                    <Select
                      value={stockAdjustment.type}
                      label="Adjustment Type"
                      onChange={(e) => setStockAdjustment({ ...stockAdjustment, type: e.target.value as 'add' | 'subtract' })}
                    >
                      <MenuItem value="add">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AddCircleIcon color="success" /> Add Stock
                        </Box>
                      </MenuItem>
                      <MenuItem value="subtract">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <RemoveCircleIcon color="error" /> Remove Stock
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={stockAdjustment.quantity}
                    onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: parseInt(e.target.value) || 0 })}
                  />
                </Grid>
              </Grid>

              <Typography variant="body2" sx={{ mt: 2 }}>
                New Stock Level:{' '}
                <strong>
                  {stockAdjustment.type === 'add'
                    ? stockItem.quantityOnHand + stockAdjustment.quantity
                    : stockItem.quantityOnHand - stockAdjustment.quantity}
                </strong>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleStockAdjustment}
            disabled={stockAdjustment.quantity <= 0}
          >
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;
