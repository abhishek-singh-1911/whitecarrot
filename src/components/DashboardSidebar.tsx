'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Logout as LogoutIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onDrawerToggle?: () => void;
}

const drawerWidth = 240;

export default function DashboardSidebar({ mobileOpen = false, onDrawerToggle }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [companySlug, setCompanySlug] = useState('');

  useEffect(() => {
    const companyData = localStorage.getItem('company');
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        setCompanySlug(company.slug);
      } catch (e) {
        console.error('Failed to parse company data');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
    router.push('/login');
  };

  const menuItems = [
    { text: 'Editor', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Jobs', icon: <WorkIcon />, path: '/dashboard/jobs' },
  ];

  const drawerContent = (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="700" color="primary">
          Careers Builder
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ overflow: 'auto', flex: 1, py: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
              <Link href={item.path} passHref legacyBehavior>
                <ListItemButton
                  selected={pathname === item.path}
                  component="a"
                  onClick={onDrawerToggle} // Close drawer on mobile when clicking link
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: pathname === item.path ? 'white' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        {companySlug && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ViewIcon />}
            href={`/${companySlug}/careers`}
            target="_blank"
            sx={{ mb: 2 }}
          >
            View Live Page
          </Button>
        )}

        <Button
          fullWidth
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
