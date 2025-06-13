'use client';
import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { getCurrentProfile } from '../../store/slices/profileSlice';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, loading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Welcome {user?.name}
        </Typography>

        {profile ? (
          <Box sx={{ mt: 4 }}>
            {/* Profile Summary Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={user?.avatar} 
                    sx={{ width: 80, height: 80, mr: 3 }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" gutterBottom>
                      {user?.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {profile.status} {profile.company && `at ${profile.company}`}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {profile.location}
                    </Typography>
                  </Box>
                </Box>

                {profile.bio && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {profile.bio}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {profile.skills?.map((skill: string, index: number) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    component={Link}
                    href="/edit-profile"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    component={Link}
                    href="/add-experience"
                  >
                    Add Experience
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    component={Link}
                    href="/add-education"
                  >
                    Add Education
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Experience Section */}
              <Box sx={{ flex: 1 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Experience
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {profile.experience?.length > 0 ? (
                      profile.experience.map((exp) => (
                        <Box key={exp._id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {exp.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.company} • {exp.from} - {exp.current ? 'Present' : exp.to}
                          </Typography>
                          {exp.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {exp.description}
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No experience added yet
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* Education Section */}
              <Box sx={{ flex: 1 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Education
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {profile.education?.length > 0 ? (
                      profile.education.map((edu) => (
                        <Box key={edu._id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {edu.degree}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.school} • {edu.from} - {edu.current ? 'Present' : edu.to}
                          </Typography>
                          {edu.fieldofstudy && (
                            <Typography variant="body2">
                              Field of Study: {edu.fieldofstudy}
                            </Typography>
                          )}
                          {edu.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {edu.description}
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No education added yet
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Danger Zone */}
            <Card sx={{ mt: 3, border: '1px solid', borderColor: 'error.main' }}>
              <CardContent>
                <Typography variant="h6" color="error" gutterBottom>
                  Danger Zone
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Once you delete your account, there is no going back. Please be certain.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    // TODO: Implement delete account functionality
                    console.log('Delete account');
                  }}
                >
                  Delete My Account
                </Button>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              You have not yet set up a profile. Please add some information to get started.
            </Alert>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              component={Link}
              href="/create-profile"
            >
              Create Profile
            </Button>
          </Box>
        )}
      </Container>
    </ProtectedRoute>
  );
}
