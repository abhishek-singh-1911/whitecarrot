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

const drawerWidth = 280;

export default function DashboardSidebar() {
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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        },
      }}
    >
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
            href={`/api/company/${companySlug}`} // Temporary link to API for now, will be public page later
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
    </Drawer>
  );
}
