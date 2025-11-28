import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import ArticleIcon from '@mui/icons-material/Article';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
// ServiceTitan-like feature icons
import DispatchIcon from '@mui/icons-material/LocalShipping';
import WorkIcon from '@mui/icons-material/Work';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

interface MenuGroup {
  title: string;
  items: { text: string; icon: React.ReactNode; path: string }[];
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Overview',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { text: 'Dispatch Board', icon: <DispatchIcon />, path: '/admin/dispatch' },
      { text: 'Jobs', icon: <WorkIcon />, path: '/admin/jobs' },
      { text: 'Service Requests', icon: <CalendarTodayIcon />, path: '/admin/service-requests' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { text: 'Estimates', icon: <RequestQuoteIcon />, path: '/admin/estimates' },
      { text: 'Invoices', icon: <ReceiptIcon />, path: '/admin/invoices' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { text: 'Customers', icon: <PeopleIcon />, path: '/admin/customers' },
      { text: 'Technicians', icon: <EngineeringIcon />, path: '/admin/technicians' },
      { text: 'Inventory', icon: <InventoryIcon />, path: '/admin/inventory' },
    ],
  },
  {
    title: 'Content',
    items: [
      { text: 'Services', icon: <BuildIcon />, path: '/admin/services' },
      { text: 'Blog Posts', icon: <ArticleIcon />, path: '/admin/blog' },
      { text: 'Testimonials', icon: <StarIcon />, path: '/admin/testimonials' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { text: 'Reports', icon: <BarChartIcon />, path: '/admin/reports' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
    ],
  },
];

const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Find current page title
  const getCurrentPageTitle = () => {
    for (const group of menuGroups) {
      const found = group.items.find(item => item.path === location.pathname);
      if (found) return found.text;
    }
    return 'Dashboard';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <AcUnitIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary" sx={{ lineHeight: 1.2 }}>
            HVAC Pro
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Field Service Management
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {menuGroups.map((group) => (
          <Box key={group.title}>
            <Typography
              variant="overline"
              sx={{
                px: 2,
                pt: 2,
                pb: 0.5,
                display: 'block',
                color: 'text.secondary',
                fontSize: '0.7rem',
                letterSpacing: 1,
              }}
            >
              {group.title}
            </Typography>
            <List dense disablePadding>
              {group.items.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    onClick={() => isMobile && setMobileOpen(false)}
                    sx={{
                      py: 0.75,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'white',
                        '& .MuiListItemIcon-root': { color: 'white' },
                        '&:hover': { bgcolor: 'primary.main' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
      <Divider />
      <List dense>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" target="_blank">
            <ListItemIcon sx={{ minWidth: 40 }}><AcUnitIcon /></ListItemIcon>
            <ListItemText 
              primary="View Website" 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getCurrentPageTitle()}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {user?.firstName} {user?.lastName}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.100',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
