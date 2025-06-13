"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Code as CodeIcon,
  People as PeopleIcon,
  Share as ShareIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { loadUser } from "../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    dispatch(loadUser()).finally(() => {
      setIsInitialLoad(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialLoad && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isInitialLoad, router]);

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Share Your Code",
      description: "Showcase your projects and coding skills to the community",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Connect with Developers",
      description: "Network with developers from around the world",
    },
    {
      icon: <ShareIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Build Your Portfolio",
      description: "Create a professional profile to highlight your experience",
    },
  ];

  if (isInitialLoad || (!isInitialLoad && isAuthenticated)) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
          }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                color: "white",
                fontWeight: "bold",
                mb: 3,
              }}>
              Connecting Developers
              <br />
              <Box component="span" sx={{ color: "#FFD700" }}>
                Globally
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                lineHeight: 1.6,
              }}>
              Create your personal profile • Share your portfolio • Help other
              developers
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/register"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#FFD700",
                  color: "#333",
                  "&:hover": {
                    bgcolor: "#FFC107",
                  },
                }}>
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/login"
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "#FFD700",
                    backgroundColor: "rgba(255,215,0,0.1)",
                  },
                }}>
                Login
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["React", "Node.js", "Python", "TypeScript", "Next.js"].map(
                (tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                )
              )}
            </Box>
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}>
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", p: 3 }}>
                    <Box sx={{ mr: 3 }}>{feature.icon}</Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
