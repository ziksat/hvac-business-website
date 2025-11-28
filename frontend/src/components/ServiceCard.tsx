import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import * as Icons from '@mui/icons-material';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  detailed?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, detailed = false }) => {
  // Dynamically get the icon component
  const IconComponent = (Icons as Record<string, React.ComponentType<{ sx?: object }>>)[
    service.icon ? service.icon.charAt(0).toUpperCase() + service.icon.slice(1) : 'Build'
  ] || Icons.Build;

  const features = typeof service.features === 'string' 
    ? JSON.parse(service.features) 
    : service.features || [];

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <IconComponent sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {service.name}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {detailed ? service.description : service.shortDescription || service.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip
            icon={<AttachMoneyIcon />}
            label={`From $${service.price}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={`${service.duration} min`}
            size="small"
            variant="outlined"
          />
        </Box>

        {detailed && features.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {features.map((feature: string, index: number) => (
                <Chip key={index} label={feature} size="small" sx={{ mb: 0.5 }} />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          component={Link}
          to="/book-service"
          fullWidth
        >
          Book Now
        </Button>
      </Box>
    </Card>
  );
};

export default ServiceCard;
