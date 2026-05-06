"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AutoStories as AutoStoriesIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/hooks/useNotification";

import { authApi } from "@/lib/api";

import { MaterialUiProvider } from "@/providers/material-ui-provider";

import { useAuthStore } from "@/stores/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const notify = useNotification();

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(data);
      login(response.user, response.token);
      notify("Login successful!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Left branding panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "45%",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          p: 6,
          gap: 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.08)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.06)",
          },
        }}
      >
        <Box
          sx={{
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.15)",
              display: "flex",
            }}
          >
            <AutoStoriesIcon sx={{ fontSize: "3rem !important" }} />
          </Box>
          <Typography variant="h3" fontWeight={800} letterSpacing={-0.5}>
            PubCore
          </Typography>
          <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.85 }}>
            Publishing Platform
          </Typography>
          <Typography
            variant="body2"
            sx={{ opacity: 0.7, maxWidth: 280, mt: 1, lineHeight: 1.8 }}
          >
            Manage your books, authors, and publishers in one unified platform.
          </Typography>

          {/* Feature bullets */}
          <Stack
            spacing={1.5}
            mt={3}
            alignItems="flex-start"
            width="100%"
            maxWidth={260}
          >
            {[
              "Full CRUD for Authors & Publishers",
              "Book catalog with rich metadata",
              "Secure JWT authentication",
              "Paginated & searchable tables",
            ].map((feature) => (
              <Stack
                key={feature}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.7)",
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {feature}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          {/* Mobile logo */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ display: { xs: "flex", md: "none" }, mb: 4 }}
          >
            <AutoStoriesIcon
              color="primary"
              sx={{ fontSize: "1.75rem !important" }}
            />
            <Typography variant="h5" fontWeight={700} color="primary">
              PubCore
            </Typography>
          </Stack>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your account to continue
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email address"
                    type="email"
                    fullWidth
                    size="medium"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    size="medium"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{ py: 1.5, mt: 0.5, fontWeight: 600, letterSpacing: 0.5 }}
              >
                {isLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 4 }}
            color="text.secondary"
          >
            Don&apos;t have an account?{" "}
            <MuiLink
              component={Link}
              href="/register"
              underline="hover"
              fontWeight={600}
            >
              Create one
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <MaterialUiProvider>
      <LoginPageContent />
    </MaterialUiProvider>
  );
}
