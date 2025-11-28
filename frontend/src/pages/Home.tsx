import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { publicService } from '../services/publicService';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';

const features = [
  {
    icon: <AccessTimeIcon sx={{ fontSize: 48 }} />,
    title: '24/7 Emergency Service',
    description: 'We are available around the clock for your HVAC emergencies.',
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 48 }} />,
    title: 'Licensed & Insured',
    description: 'Fully licensed, bonded, and insured for your peace of mind.',
  },
  {
    icon: <ThumbUpIcon sx={{ fontSize: 48 }} />,
    title: 'Satisfaction Guaranteed',
    description: 'We stand behind our work with a 100% satisfaction guarantee.',
  },
];

const Home: React.FC = () => {
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => publicService.getServices(),
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => publicService.getTestimonials(1, 3),
  });

  return (
    <>
      <Helmet>
        <title>Your HVAC Company - Professional Heating & Cooling Services</title>
        <meta
          name="description"
          content="Expert HVAC services including AC repair, heating installation, and maintenance. Serving your area with 24/7 emergency services."
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                Your Comfort Is Our Priority
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Professional HVAC services you can trust. From repairs to installations, we keep your home comfortable year-round.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={Link}
                  to="/book-service"
                >
                  Schedule Service
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PhoneIcon />}
                  sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                  href="tel:5551234567"
                >
                  (555) 123-4567
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  Need Emergency Service?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  We are available 24/7 for heating and cooling emergencies.
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  (555) 123-4567
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ textAlign: 'center', height: '100%' }}>
                  <CardContent sx={{ py: 4 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Our Services
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            We offer a complete range of HVAC services to keep your home comfortable in every season.
          </Typography>
          <Grid container spacing={3}>
            {services?.slice(0, 6).map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <ServiceCard service={service} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/services"
            >
              View All Services
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            What Our Customers Say
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Don't just take our word for it - hear from our satisfied customers.
          </Typography>
          <Grid container spacing={3}>
            {testimonialsData?.testimonials.map((testimonial) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'secondary.main', color: 'white' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Schedule your service today and experience the difference.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/book-service"
            sx={{ bgcolor: 'white', color: 'secondary.main', '&:hover': { bgcolor: 'grey.100' } }}
          >
            Book Your Service Now
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Home;
