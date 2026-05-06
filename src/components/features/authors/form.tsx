"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { type FieldErrors, useForm } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";
import { z } from "zod";

import { CardForm } from "@/components/common/form/card";

import { authorsApi } from "@/lib/api";

import type { Author } from "@/types/entities";

const authorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().min(3, "Bio is required"),
  nationality: z.string().min(2, "Nationality is required"),
});

type AuthorFormData = z.infer<typeof authorSchema>;

interface AuthorsFormProps {
  initialData?: Author;
  isCreating?: boolean;
  pageMode?: boolean;
}

function AuthorFormFields({
  control,
  errors,
}: {
  control: ReturnType<typeof useForm<AuthorFormData>>["control"];
  errors: FieldErrors<AuthorFormData>;
}) {
  return (
    <Grid container rowSpacing={3} columnSpacing={2} padding={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextFieldElement
          control={control}
          name="name"
          label="Name"
          fullWidth
          required
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextFieldElement
          control={control}
          name="nationality"
          label="Nationality"
          fullWidth
          required
          error={!!errors.nationality}
          helperText={errors.nationality?.message}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextFieldElement
          control={control}
          name="bio"
          label="Bio"
          multiline
          rows={4}
          fullWidth
          required
          error={!!errors.bio}
          helperText={errors.bio?.message}
        />
      </Grid>
    </Grid>
  );
}

export function AuthorsForm({
  initialData,
  isCreating,
  pageMode,
}: AuthorsFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(Boolean(isCreating));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: initialData || {
      name: "",
      bio: "",
      nationality: "",
    },
  });

  const { mutate: saveAuthor, isPending: isSaving } = useMutation({
    mutationFn: async (data: AuthorFormData) => {
      if (initialData?.id) {
        return authorsApi.update(initialData.id, data);
      } else {
        return authorsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      enqueueSnackbar(
        initialData?.id
          ? "Author updated successfully"
          : "Author created successfully",
        { variant: "success" },
      );
      if (pageMode) {
        router.push("/authors");
        return;
      }
      setOpen(false);
      reset();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Operation failed";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const onSubmit = (data: AuthorFormData) => {
    saveAuthor(data);
  };

  const renderFields = () => (
    <AuthorFormFields control={control} errors={errors} />
  );

  if (pageMode) {
    return (
      <CardForm
        onSubmit={handleSubmit(onSubmit)}
        headerText={initialData?.id ? "Edit" : "Create"}
        menu="Author"
        isEdit
        isLoading={isSaving}
        onBack={() => router.push("/authors")}
      >
        {renderFields()}
      </CardForm>
    );
  }

  return (
    <>
      {initialData ? (
        <IconButton size="small" color="primary" onClick={() => setOpen(true)}>
          <EditIcon fontSize="small" />
        </IconButton>
      ) : !isCreating ? (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Author
        </Button>
      ) : null}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {initialData?.id ? "Edit Author" : "Add New Author"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>{renderFields()}</form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
