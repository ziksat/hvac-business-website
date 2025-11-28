import React from 'react';
import { Card, CardContent, Typography, Box, Rating } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <FormatQuoteIcon sx={{ fontSize: 40, color: 'primary.light', mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
          "{testimonial.content}"
        </Typography>
        <Box sx={{ mt: 'auto' }}>
          <Rating value={testimonial.rating} readOnly size="small" />
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
            {testimonial.customerName}
          </Typography>
          {testimonial.serviceType && (
            <Typography variant="body2" color="text.secondary">
              {testimonial.serviceType}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
