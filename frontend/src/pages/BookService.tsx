import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { publicService } from '../services/publicService';

interface BookingFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  isEmergency: boolean;
}

const BookService: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => publicService.getServices(),
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<BookingFormData>({
    defaultValues: {
      isEmergency: false,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await publicService.submitServiceRequest(data);
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
  ];

  return (
    <>
      <Helmet>
        <title>Book Service - HVAC Company</title>
        <meta
          name="description"
          content="Schedule your HVAC service online. Easy booking for AC repair, heating service, maintenance, and more."
        />
      </Helmet>

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight={700} sx={{ mb: 2 }}>
            Book a Service
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
            Schedule your HVAC service online. Fill out the form below and we'll contact you to confirm your appointment.
          </Typography>
        </Container>
      </Box>

      {/* Booking Form */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Card>
            <CardContent sx={{ p: 4 }}>
              {submitStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Your service request has been submitted! We'll contact you shortly to confirm your appointment.
                </Alert>
              )}

              {submitStatus === 'error' && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  There was an error submitting your request. Please try again or call us directly.
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                  Contact Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      {...register('customerName', { required: 'Name is required' })}
                      error={!!errors.customerName}
                      helperText={errors.customerName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      {...register('phone', { required: 'Phone is required' })}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                  Service Address
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      {...register('address')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      {...register('city')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="State"
                      {...register('state')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      {...register('zipCode')}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                  Service Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="serviceType"
                      control={control}
                      rules={{ required: 'Please select a service' }}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.serviceType}>
                          <InputLabel>Service Type</InputLabel>
                          <Select {...field} label="Service Type">
                            {services?.map((service) => (
                              <MenuItem key={service.id} value={service.name}>
                                {service.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Preferred Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      {...register('preferredDate', { required: 'Please select a date' })}
                      error={!!errors.preferredDate}
                      helperText={errors.preferredDate?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="preferredTime"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Preferred Time</InputLabel>
                          <Select {...field} label="Preferred Time">
                            {timeSlots.map((slot) => (
                              <MenuItem key={slot} value={slot}>
                                {slot}
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
                      label="Additional Details"
                      multiline
                      rows={4}
                      placeholder="Please describe the issue or any additional information..."
                      {...register('message')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="isEmergency"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value} />}
                          label="This is an emergency (additional fees may apply)"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : 'Submit Service Request'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Need immediate assistance? Call us at{' '}
              <Typography component="span" color="primary" fontWeight={600}>
                (555) 123-4567
              </Typography>
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BookService;
