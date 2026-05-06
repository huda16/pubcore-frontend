"use client";

import BusinessIcon from "@mui/icons-material/Business";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { authorsApi, booksApi, publishersApi } from "@/lib/api";

interface StatCardProps {
  title: string;
  count: number | undefined;
  isLoading: boolean;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, count, isLoading, icon, color }: StatCardProps) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {isLoading ? (
              <Skeleton variant="text" width={60} height={40} />
            ) : (
              <Typography variant="h4" fontWeight={700}>
                {count ?? 0}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const { data: authorsData, isLoading: loadingAuthors } = useQuery({
    queryKey: ["authors-count"],
    queryFn: () => authorsApi.list({ page: 1, limit: 1 }),
  });

  const { data: publishersData, isLoading: loadingPublishers } = useQuery({
    queryKey: ["publishers-count"],
    queryFn: () => publishersApi.list({ page: 1, limit: 1 }),
  });

  const { data: booksData, isLoading: loadingBooks } = useQuery({
    queryKey: ["books-count"],
    queryFn: () => booksApi.list({ page: 1, limit: 1 }),
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Platform Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Summary of your publishing platform catalog
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Authors"
            count={authorsData?.meta?.total}
            isLoading={loadingAuthors}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Publishers"
            count={publishersData?.meta?.total}
            isLoading={loadingPublishers}
            icon={<BusinessIcon />}
            color="#388e3c"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Books"
            count={booksData?.meta?.total}
            isLoading={loadingBooks}
            icon={<MenuBookIcon />}
            color="#f57c00"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
