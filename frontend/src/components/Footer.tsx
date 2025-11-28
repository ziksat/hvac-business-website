import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AcUnitIcon sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h6" fontWeight={700}>
                HVAC Company
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Professional heating and cooling services you can trust. 
              Serving our community with quality HVAC solutions since 2004.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" aria-label="Facebook" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" size="small">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography component={Link} to="/" variant="body2" sx={{ color: 'inherit', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Home
              </Typography>
              <Typography component={Link} to="/services" variant="body2" sx={{ color: 'inherit', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Services
              </Typography>
              <Typography component={Link} to="/about" variant="body2" sx={{ color: 'inherit', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                About Us
              </Typography>
              <Typography component={Link} to="/blog" variant="body2" sx={{ color: 'inherit', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Blog
              </Typography>
              <Typography component={Link} to="/contact" variant="body2" sx={{ color: 'inherit', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Contact
              </Typography>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Our Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>AC Repair & Installation</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Heating Services</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>HVAC Maintenance</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Duct Cleaning</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Emergency Services</Typography>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">(555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">info@hvaccompany.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  123 Main Street<br />
                  Your City, ST 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Bar */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} HVAC Company. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              License #HVAC-12345
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Fully Insured
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
