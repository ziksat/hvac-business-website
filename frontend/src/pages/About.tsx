import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HandshakeIcon from '@mui/icons-material/Handshake';

const teamMembers = [
  { name: 'John Smith', role: 'Founder & CEO', initials: 'JS' },
  { name: 'Sarah Johnson', role: 'Operations Manager', initials: 'SJ' },
  { name: 'Mike Williams', role: 'Lead Technician', initials: 'MW' },
  { name: 'Emily Davis', role: 'Customer Service Manager', initials: 'ED' },
];

const values = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 48 }} />,
    title: 'Integrity',
    description: 'We believe in honest, transparent service. No hidden fees, no unnecessary upsells.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 48 }} />,
    title: 'Expertise',
    description: 'Our certified technicians undergo continuous training to stay current with the latest technology.',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
    title: 'Excellence',
    description: 'We are committed to delivering the highest quality workmanship on every job.',
  },
  {
    icon: <HandshakeIcon sx={{ fontSize: 48 }} />,
    title: 'Customer Focus',
    description: 'Your satisfaction is our top priority. We go above and beyond to exceed expectations.',
  },
];

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us - HVAC Company</title>
        <meta
          name="description"
          content="Learn about our HVAC company's history, our experienced team, and our commitment to quality heating and cooling services."
        />
      </Helmet>

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight={700} sx={{ mb: 2 }}>
            About Us
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
            With over 20 years of experience, we've been keeping homes comfortable and families happy.
          </Typography>
        </Container>
      </Box>

      {/* Story Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>
                Our Story
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Founded in 2004, our HVAC company started with a simple mission: provide honest, reliable heating and cooling services to our community. What began as a one-man operation has grown into a team of dedicated professionals serving thousands of satisfied customers.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Over the years, we've built our reputation on quality workmanship, fair pricing, and exceptional customer service. We treat every home like our own and every customer like family.
              </Typography>
              <Typography variant="body1">
                Today, we continue to grow while staying true to our founding principles. Whether it's a simple repair or a complete system installation, we approach every job with the same commitment to excellence.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: 'grey.200',
                  borderRadius: 4,
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Company Image
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight={700} sx={{ mb: 6 }}>
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ textAlign: 'center', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{value.icon}</Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight={700} sx={{ mb: 2 }}>
            Meet Our Team
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Our experienced professionals are dedicated to your comfort.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'primary.main',
                        fontSize: 32,
                      }}
                    >
                      {member.initials}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Certifications */}
      <Box sx={{ py: 8, bgcolor: 'primary.dark', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight={700} sx={{ mb: 4 }}>
            Our Certifications
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">EPA Certified</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">NATE Certified</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">BBB A+ Rated</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Licensed & Insured</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default About;
