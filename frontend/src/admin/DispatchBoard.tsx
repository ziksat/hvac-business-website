import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Avatar,
  Paper,
  Divider,
  Tooltip,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { adminService } from '../services/adminService';
import { DispatchSchedule, Technician, Job } from '../types';

const DispatchBoard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<number | ''>('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const queryClient = useQueryClient();

  const { data: scheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ['dispatch', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => adminService.getDispatchSchedule(format(selectedDate, 'yyyy-MM-dd')),
  });

  const { data: techniciansData } = useQuery({
    queryKey: ['technicians', 'active'],
    queryFn: () => adminService.getTechnicians(1, 100, 'active'),
  });

  const { data: jobsData } = useQuery({
    queryKey: ['jobs', 'scheduled'],
    queryFn: () => adminService.getJobs(1, 100, 'scheduled'),
  });

  const dispatchMutation = useMutation({
    mutationFn: (data: { jobId: number; technicianId: number; scheduledDate: string; startTime: string; endTime: string }) =>
      adminService.dispatchJob(data.jobId, data.technicianId, data.scheduledDate, data.startTime, data.endTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      handleCloseDialog();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminService.updateDispatchStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch'] });
    },
  });

  const handlePrevious = () => {
    if (viewMode === 'day') {
      setSelectedDate(subDays(selectedDate, 1));
    } else {
      setSelectedDate(subWeeks(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      setSelectedDate(addDays(selectedDate, 1));
    } else {
      setSelectedDate(addWeeks(selectedDate, 1));
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleOpenDispatchDialog = (job: Job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedJob(null);
    setSelectedTechnician('');
    setStartTime('09:00');
    setEndTime('10:00');
  };

  const handleDispatch = () => {
    if (selectedJob && selectedTechnician) {
      dispatchMutation.mutate({
        jobId: selectedJob.id,
        technicianId: selectedTechnician as number,
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
        startTime,
        endTime,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#1976d2';
      case 'en_route': return '#9c27b0';
      case 'on_site': return '#ed6c02';
      case 'completed': return '#2e7d32';
      case 'cancelled': return '#d32f2f';
      default: return '#757575';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'en_route': return 'En Route';
      case 'on_site': return 'On Site';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const technicians = techniciansData?.technicians || [];
  const unassignedJobs = jobsData?.jobs?.filter(job => job.status === 'scheduled') || [];
  const schedules = scheduleData?.schedules || [];

  // Group schedules by technician
  const schedulesByTechnician: Record<number, DispatchSchedule[]> = {};
  technicians.forEach(tech => {
    schedulesByTechnician[tech.id] = schedules.filter(s => s.technicianId === tech.id);
  });

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Dispatch Board
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant={viewMode === 'day' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
          <Button
            variant={viewMode === 'week' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
        </Box>
      </Box>

      {/* Date Navigation */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handlePrevious}>
              <ChevronLeftIcon />
            </IconButton>
            <Button startIcon={<TodayIcon />} onClick={handleToday}>
              Today
            </Button>
            <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
              {viewMode === 'day' 
                ? format(selectedDate, 'EEEE, MMMM d, yyyy')
                : `Week of ${format(startOfWeek(selectedDate), 'MMM d, yyyy')}`
              }
            </Typography>
            <IconButton onClick={handleNext}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Unassigned Jobs Panel */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Unassigned Jobs
                </Typography>
                <Chip label={unassignedJobs.length} size="small" color="warning" />
              </Box>
              <Divider sx={{ mb: 2 }} />
              {unassignedJobs.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No unassigned jobs
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {unassignedJobs.map((job) => (
                    <Paper
                      key={job.id}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => handleOpenDispatchDialog(job)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {job.jobNumber}
                        </Typography>
                        <Chip
                          label={job.priority}
                          size="small"
                          color={job.priority === 'emergency' ? 'error' : job.priority === 'high' ? 'warning' : 'default'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {job.serviceType}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="caption">{job.customerName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="caption" noWrap>
                          {job.address}, {job.city}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Technician Schedule Grid */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              {scheduleLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : technicians.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No technicians available. Add technicians first.
                </Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 800 }}>
                    {/* Header with time slots */}
                    <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 2 }}>
                      <Box sx={{ width: 150, flexShrink: 0 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Technician
                        </Typography>
                      </Box>
                      {timeSlots.map((time) => (
                        <Box key={time} sx={{ width: 80, flexShrink: 0, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {time}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Technician rows */}
                    {technicians.map((technician) => (
                      <Box 
                        key={technician.id} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          py: 1,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          minHeight: 60,
                        }}
                      >
                        <Box sx={{ width: 150, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: technician.color || 'primary.main',
                              fontSize: '0.875rem'
                            }}
                          >
                            {technician.firstName[0]}{technician.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {technician.firstName} {technician.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {schedulesByTechnician[technician.id]?.length || 0} jobs
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', position: 'relative', flexGrow: 1 }}>
                          {schedulesByTechnician[technician.id]?.map((schedule) => {
                            const startHour = parseInt(schedule.startTime.split(':')[0]);
                            const endHour = parseInt(schedule.endTime.split(':')[0]);
                            const duration = endHour - startHour;
                            const offsetSlots = startHour - 7; // 7:00 is first slot

                            return (
                              <Tooltip 
                                key={schedule.id}
                                title={
                                  <Box>
                                    <Typography variant="body2">{schedule.jobNumber}</Typography>
                                    <Typography variant="caption">{schedule.customerName}</Typography>
                                    <Typography variant="caption" display="block">{schedule.startTime} - {schedule.endTime}</Typography>
                                  </Box>
                                }
                              >
                                <Paper
                                  sx={{
                                    position: 'absolute',
                                    left: offsetSlots * 80,
                                    width: duration * 80 - 4,
                                    height: 40,
                                    bgcolor: getStatusColor(schedule.status),
                                    color: 'white',
                                    p: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    '&:hover': { opacity: 0.9 },
                                  }}
                                  onClick={() => {
                                    const statusMap: Record<string, string> = {
                                      scheduled: 'en_route',
                                      en_route: 'on_site',
                                      on_site: 'completed',
                                    };
                                    const nextStatus = statusMap[schedule.status];
                                    if (nextStatus) {
                                      updateStatusMutation.mutate({ id: schedule.id, status: nextStatus });
                                    }
                                  }}
                                >
                                  <Typography variant="caption" noWrap sx={{ fontWeight: 500 }}>
                                    {schedule.jobNumber || schedule.serviceType}
                                  </Typography>
                                </Paper>
                              </Tooltip>
                            );
                          })}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Legend */}
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            {['scheduled', 'en_route', 'on_site', 'completed', 'cancelled'].map((status) => (
              <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: getStatusColor(status) }} />
                <Typography variant="caption">{getStatusLabel(status)}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Dispatch Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Dispatch Job</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Job: {selectedJob.jobNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {selectedJob.serviceType}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {selectedJob.customerName} - {selectedJob.address}, {selectedJob.city}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Assign Technician</InputLabel>
                    <Select
                      value={selectedTechnician}
                      label="Assign Technician"
                      onChange={(e) => setSelectedTechnician(e.target.value as number)}
                    >
                      {technicians.map((tech) => (
                        <MenuItem key={tech.id} value={tech.id}>
                          {tech.firstName} {tech.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDispatch}
            disabled={!selectedTechnician || dispatchMutation.isPending}
          >
            {dispatchMutation.isPending ? 'Dispatching...' : 'Dispatch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DispatchBoard;
