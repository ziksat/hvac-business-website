import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import { publicService } from '../services/publicService';
import { InventoryItem } from '../types';

const Parts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data, isLoading } = useQuery({
    queryKey: ['parts', page, categoryFilter, searchTerm],
    queryFn: () => publicService.getParts(page, itemsPerPage, categoryFilter, searchTerm),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['partCategories'],
    queryFn: () => publicService.getPartCategories(),
  });

  const parts = data?.items || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const categories = categoriesData || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategoryFilter(event.target.value as string);
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Parts & Supplies - HVAC Company</title>
        <meta
          name="description"
          content="Browse our selection of HVAC parts and supplies. Quality parts for air conditioners, heaters, filters, and more at competitive prices."
        />
      </Helmet>

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight={700} sx={{ mb: 2 }}>
            Parts & Supplies
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
            Quality HVAC parts and supplies at competitive prices. Browse our inventory of filters, components, tools, and more.
          </Typography>
        </Container>
      </Box>

      {/* Filters */}
      <Box sx={{ py: 4, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search parts by name or SKU..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'left', md: 'right' }}>
                {data?.pagination?.total || 0} items found
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Parts List */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : parts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <InventoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No parts found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {parts.map((part: InventoryItem) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={part.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: 4 }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Chip 
                            label={part.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          {part.quantityOnHand > 0 ? (
                            <Chip 
                              label="In Stock" 
                              size="small" 
                              color="success"
                            />
                          ) : (
                            <Chip 
                              label="Out of Stock" 
                              size="small" 
                              color="error"
                            />
                          )}
                        </Box>
                        <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
                          {part.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          SKU: {part.sku}
                        </Typography>
                        {part.brand && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Brand: {part.brand}
                          </Typography>
                        )}
                        {part.description && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {part.description}
                          </Typography>
                        )}
                        <Box sx={{ mt: 'auto' }}>
                          <Typography variant="h5" color="primary" fontWeight={700}>
                            ${part.sellingPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Contact CTA */}
      <Box sx={{ py: 6, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              Need Help Finding the Right Part?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              Our expert technicians can help you find the right parts for your HVAC system. 
              Contact us for assistance or to request a specific part.
            </Typography>
            <Typography variant="h5" color="primary" fontWeight={600}>
              Call us: (555) 123-4567
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Parts;
