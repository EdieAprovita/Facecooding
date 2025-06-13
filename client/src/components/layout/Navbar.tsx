'use client';
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useState } from 'react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const authLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        color="inherit"
        component={Link}
        href="/profiles"
        startIcon={<PeopleIcon />}
      >
        Ironhackers
      </Button>
      <Button
        color="inherit"
        component={Link}
        href="/posts"
        startIcon={<ArticleIcon />}
      >
        Posts
      </Button>
      <Button
        color="inherit"
        component={Link}
        href="/dashboard"
        startIcon={<DashboardIcon />}
      >
        Dashboard
      </Button>
      
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {user?.avatar ? (
          <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
        ) : (
          <AccountIcon />
        )}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );

  const guestLinks = (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        color="inherit"
        component={Link}
        href="/profiles"
        startIcon={<PeopleIcon />}
      >
        Ironhackers
      </Button>
      <Button color="inherit" component={Link} href="/register">
        Register
      </Button>
      <Button color="inherit" component={Link} href="/login">
        Login
      </Button>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          🚀 Facecooding
        </Typography>
        {!loading && (isAuthenticated ? authLinks : guestLinks)}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
