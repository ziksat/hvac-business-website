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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { publicService } from '../services/publicService';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await publicService.submitContactForm(data);
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - HVAC Company</title>
        <meta
          name="description"
          content="Contact us for all your HVAC needs. Call for emergency service or fill out our form for a free estimate."
        />
      </Helmet>

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight={700} sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
            We're here to help with all your heating and cooling needs. Reach out today!
          </Typography>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                Send Us a Message
              </Typography>
              
              {submitStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! We'll get back to you soon.
                </Alert>
              )}
              
              {submitStatus === 'error' && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  There was an error sending your message. Please try again.
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      {...register('name', { required: 'Name is required' })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
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
                          message: 'Invalid email address'
                        }
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      {...register('phone')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Subject"
                      {...register('subject')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                      {...register('message', { required: 'Message is required' })}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                Get in Touch
              </Typography>
              
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="h6">(555) 123-4567</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="h6">info@hvaccompany.com</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <LocationOnIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="h6">
                        123 Main Street<br />
                        Your City, ST 12345
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <AccessTimeIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Business Hours
                      </Typography>
                      <Typography variant="body2">Monday - Friday: 8:00 AM - 6:00 PM</Typography>
                      <Typography variant="body2">Saturday: 9:00 AM - 2:00 PM</Typography>
                      <Typography variant="body2">Sunday: Closed</Typography>
                      <Typography variant="body2" color="secondary.main" fontWeight={600} sx={{ mt: 1 }}>
                        24/7 Emergency Service Available
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map Placeholder */}
      <Box sx={{ height: 400, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Map Integration - Add Google Maps API Key
        </Typography>
      </Box>
    </>
  );
};

export default Contact;
