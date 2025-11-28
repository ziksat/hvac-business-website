import React, { useState, useMemo } from 'react';
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

// Mock HVAC parts data for demo when backend is unavailable
const mockParts: Omit<InventoryItem, 'createdAt' | 'updatedAt'>[] = [
  { id: 1, sku: 'FLT-16251-MERV8', name: '16x25x1 MERV 8 Air Filter', description: 'Standard pleated air filter for residential HVAC systems. MERV 8 rating captures dust, pollen, and pet dander.', category: 'Air Filters', brand: 'FilterBuy', unitCost: 4.50, sellingPrice: 12.99, quantityOnHand: 100, reorderPoint: 25, reorderQuantity: 50, isActive: true },
  { id: 2, sku: 'FLT-16251-MERV11', name: '16x25x1 MERV 11 Air Filter', description: 'High-efficiency pleated filter. Captures finer particles including mold spores and dust mite debris.', category: 'Air Filters', brand: 'FilterBuy', unitCost: 6.00, sellingPrice: 16.99, quantityOnHand: 75, reorderPoint: 20, reorderQuantity: 40, isActive: true },
  { id: 3, sku: 'FLT-16251-MERV13', name: '16x25x1 MERV 13 Air Filter', description: 'Hospital-grade filtration. Captures bacteria, smoke, and virus carriers.', category: 'Air Filters', brand: 'FilterBuy', unitCost: 9.00, sellingPrice: 24.99, quantityOnHand: 50, reorderPoint: 15, reorderQuantity: 30, isActive: true },
  { id: 4, sku: 'CAP-35-440', name: '35/5 MFD 440V Dual Run Capacitor', description: 'Dual run capacitor for AC compressor and fan motor. Universal replacement.', category: 'Capacitors', brand: 'Titan Pro', unitCost: 8.50, sellingPrice: 24.99, quantityOnHand: 40, reorderPoint: 10, reorderQuantity: 20, isActive: true },
  { id: 5, sku: 'CAP-45-440', name: '45/5 MFD 440V Dual Run Capacitor', description: 'Common replacement capacitor for 2-3 ton AC units.', category: 'Capacitors', brand: 'Titan Pro', unitCost: 9.00, sellingPrice: 27.99, quantityOnHand: 35, reorderPoint: 10, reorderQuantity: 20, isActive: true },
  { id: 6, sku: 'CON-2P-40A', name: '2-Pole 40 Amp Contactor 24V Coil', description: 'Standard AC contactor for residential systems.', category: 'Contactors & Relays', brand: 'Packard', unitCost: 15.00, sellingPrice: 42.99, quantityOnHand: 30, reorderPoint: 10, reorderQuantity: 20, isActive: true },
  { id: 7, sku: 'MTR-COND-1/4', name: '1/4 HP Condenser Fan Motor', description: 'Universal condenser fan motor. 1075 RPM, 208-230V.', category: 'Motors & Blowers', brand: 'US Motors', unitCost: 65.00, sellingPrice: 149.99, quantityOnHand: 15, reorderPoint: 5, reorderQuantity: 10, isActive: true },
  { id: 8, sku: 'MTR-COND-1/3', name: '1/3 HP Condenser Fan Motor', description: 'Standard replacement condenser motor for 2-3 ton units.', category: 'Motors & Blowers', brand: 'US Motors', unitCost: 75.00, sellingPrice: 169.99, quantityOnHand: 12, reorderPoint: 4, reorderQuantity: 8, isActive: true },
  { id: 9, sku: 'TSTAT-WIFI-BASIC', name: 'WiFi Smart Thermostat', description: 'Basic WiFi thermostat with app control. Works with Alexa.', category: 'Thermostats', brand: 'Emerson', unitCost: 85.00, sellingPrice: 179.99, quantityOnHand: 12, reorderPoint: 4, reorderQuantity: 8, isActive: true },
  { id: 10, sku: 'TSTAT-NEST-E', name: 'Nest Thermostat E', description: 'Smart learning thermostat. Energy saving features.', category: 'Thermostats', brand: 'Google Nest', unitCost: 120.00, sellingPrice: 249.99, quantityOnHand: 8, reorderPoint: 3, reorderQuantity: 6, isActive: true },
  { id: 11, sku: 'REF-R410A-25', name: 'R-410A Refrigerant 25 lb Cylinder', description: 'Factory sealed R-410A refrigerant. For modern AC systems.', category: 'Refrigerants & Chemicals', brand: 'Chemours', unitCost: 175.00, sellingPrice: 349.99, quantityOnHand: 20, reorderPoint: 5, reorderQuantity: 10, isActive: true },
  { id: 12, sku: 'IGN-HSI-UNIV', name: 'Universal Hot Surface Ignitor', description: 'Replacement HSI for most furnace brands. 80-120V.', category: 'Furnace Parts', brand: 'White-Rodgers', unitCost: 18.00, sellingPrice: 44.99, quantityOnHand: 30, reorderPoint: 10, reorderQuantity: 20, isActive: true },
  { id: 13, sku: 'SENSOR-FLAME', name: 'Flame Sensor Rod', description: 'Universal flame sensor for gas furnaces.', category: 'Furnace Parts', brand: 'Honeywell', unitCost: 8.00, sellingPrice: 19.99, quantityOnHand: 40, reorderPoint: 15, reorderQuantity: 30, isActive: true },
  { id: 14, sku: 'COMP-SCROLL-3T', name: '3 Ton Scroll Compressor R-410A', description: 'Mid-size residential scroll compressor.', category: 'Compressors', brand: 'Copeland', unitCost: 650.00, sellingPrice: 1199.99, quantityOnHand: 3, reorderPoint: 1, reorderQuantity: 2, isActive: true },
  { id: 15, sku: 'DUCT-FLEX-6X25', name: '6" x 25ft Insulated Flex Duct', description: 'R-8 insulated flexible duct. UL listed.', category: 'Ductwork & Accessories', brand: 'Dundas Jafine', unitCost: 35.00, sellingPrice: 79.99, quantityOnHand: 20, reorderPoint: 5, reorderQuantity: 10, isActive: true },
  { id: 16, sku: 'BOARD-FURNACE-UNIV', name: 'Universal Furnace Control Board', description: 'Replacement integrated furnace control. Most brands.', category: 'Control Boards', brand: 'ICM Controls', unitCost: 85.00, sellingPrice: 189.99, quantityOnHand: 8, reorderPoint: 3, reorderQuantity: 5, isActive: true },
  { id: 17, sku: 'MINI-12K-115V', name: '12,000 BTU Mini Split System', description: 'Single zone ductless system. WiFi ready.', category: 'Mini Split Systems', brand: 'MrCool', unitCost: 750.00, sellingPrice: 1399.99, quantityOnHand: 5, reorderPoint: 2, reorderQuantity: 3, isActive: true },
  { id: 18, sku: 'GAUGE-MANIFOLD', name: 'Digital Manifold Gauge Set', description: 'R-410A digital manifold with hoses. Bluetooth enabled.', category: 'Tools & Safety', brand: 'Yellow Jacket', unitCost: 280.00, sellingPrice: 549.99, quantityOnHand: 4, reorderPoint: 2, reorderQuantity: 3, isActive: true },
  { id: 19, sku: 'COIL-CLEANER-GAL', name: 'Evaporator Coil Cleaner 1 Gallon', description: 'No-rinse foaming coil cleaner. Biodegradable.', category: 'Refrigerants & Chemicals', brand: 'Nu-Calgon', unitCost: 18.00, sellingPrice: 42.99, quantityOnHand: 30, reorderPoint: 10, reorderQuantity: 20, isActive: true },
  { id: 20, sku: 'LINESET-3/8-3/4-25', name: '3/8 x 3/4 x 25ft Mini Split Line Set', description: 'Pre-charged line set with flare fittings. Insulated.', category: 'Line Sets & Copper', brand: 'Kooline', unitCost: 85.00, sellingPrice: 179.99, quantityOnHand: 10, reorderPoint: 3, reorderQuantity: 6, isActive: true },
];

const mockCategories = [
  'Air Filters',
  'Capacitors',
  'Compressors',
  'Contactors & Relays',
  'Control Boards',
  'Ductwork & Accessories',
  'Furnace Parts',
  'Line Sets & Copper',
  'Mini Split Systems',
  'Motors & Blowers',
  'Refrigerants & Chemicals',
  'Thermostats',
  'Tools & Safety',
];

const Parts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['parts', page, categoryFilter, searchTerm],
    queryFn: () => publicService.getParts(page, itemsPerPage, categoryFilter, searchTerm),
    retry: 1,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['partCategories'],
    queryFn: () => publicService.getPartCategories(),
    retry: 1,
  });

  // Use mock data when backend is unavailable
  const filteredMockParts = useMemo(() => {
    let filtered = mockParts;
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.sku.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }
    return filtered;
  }, [categoryFilter, searchTerm]);

  // Determine if we should use mock data (when backend fails, is loading, or returns no data)
  const useMockData = isLoading || isError || !data || !data.items || data.items.length === 0;
  
  const parts = useMockData ? filteredMockParts : data.items;
  const totalPages = useMockData ? Math.ceil(filteredMockParts.length / itemsPerPage) : (data?.pagination?.totalPages || 1);
  const categories = categoriesData?.length ? categoriesData : mockCategories;
  const displayParts = useMockData ? filteredMockParts.slice((page - 1) * itemsPerPage, page * itemsPerPage) : parts;
  
  // For demo mode: always show parts immediately without loading spinner
  const showLoading = false; // Disable loading spinner for better demo experience

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
                {useMockData ? filteredMockParts.length : (data?.pagination?.total || 0)} items found
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Parts List */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          {showLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : displayParts.length === 0 ? (
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
                {displayParts.map((part) => (
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
