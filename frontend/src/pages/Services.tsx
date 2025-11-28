import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { publicService } from '../services/publicService';
import ServiceCard from '../components/ServiceCard';

const Services: React.FC = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => publicService.getServices(),
  });

  return (
    <>
      <Helmet>
        <title>Our Services - HVAC Company</title>
        <meta
          name="description"
          content="Professional HVAC services including AC repair, heating installation, maintenance, duct cleaning, and 24/7 emergency services."
        />
      </Helmet>

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight={700} sx={{ mb: 2 }}>
            Our Services
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
            We offer a complete range of HVAC services to keep your home comfortable year-round. From emergency repairs to new installations, we've got you covered.
          </Typography>
        </Container>
      </Box>

      {/* Services List */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {services?.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <ServiceCard service={service} detailed />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" fontWeight={700} sx={{ mb: 6 }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                  20+
                </Typography>
                <Typography variant="h6">Years Experience</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                  10,000+
                </Typography>
                <Typography variant="h6">Happy Customers</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                  24/7
                </Typography>
                <Typography variant="h6">Emergency Service</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Services;
