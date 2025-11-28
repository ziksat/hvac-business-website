import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  CircularProgress,
  Chip,
  Rating,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { adminService } from '../services/adminService';

const TestimonialManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminTestimonials', page + 1, rowsPerPage],
    queryFn: () => adminService.getTestimonials(page + 1, rowsPerPage),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: number; isApproved: boolean }) =>
      adminService.approveTestimonial(id, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
    },
  });

  const handleApprove = (id: number, isApproved: boolean) => {
    approveMutation.mutate({ id, isApproved });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Testimonials
      </Typography>

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell>{testimonial.customerName}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" noWrap>
                            {testimonial.content}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Rating value={testimonial.rating} readOnly size="small" />
                        </TableCell>
                        <TableCell>{testimonial.serviceType || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={testimonial.isApproved ? 'Approved' : 'Pending'}
                            color={testimonial.isApproved ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {format(new Date(testimonial.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell align="right">
                          {!testimonial.isApproved && (
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApprove(testimonial.id, true)}
                            >
                              <CheckIcon />
                            </IconButton>
                          )}
                          {testimonial.isApproved && (
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleApprove(testimonial.id, false)}
                            >
                              <CloseIcon />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(testimonial.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={data?.pagination.total || 0}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestimonialManagement;
