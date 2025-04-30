import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business'; // Example for Company Info

const Sidebar = ({ drawerWidth }) => {
  const menuItems = [
    { text: 'Nadzorna plošča', icon: <DashboardIcon />, path: '/' },
    { text: 'Letna poročila', icon: <DescriptionIcon />, path: '/annual-reports' },
    // Add more menu items as needed
    // { text: 'Podjetje', icon: <BusinessIcon />, path: '/company' }, 
    // { text: 'Nastavitve', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar /> {/* Ensures content is below the Header */}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* Optional: Add a divider and other sections like settings */}
        {/* <Divider />
        <List>
          <ListItem key="Nastavitve" disablePadding>
            <ListItemButton component={RouterLink} to="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Nastavitve" />
            </ListItemButton>
          </ListItem>
        </List> */}
      </Box>
    </Drawer>
  );
};

export default Sidebar;

