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

import { publishersApi } from "@/lib/api";

import type { Publisher } from "@/types/entities";

const publisherSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  website: z.string().url("Must be a valid URL").or(z.literal("")),
});

type PublisherFormData = z.infer<typeof publisherSchema>;

interface PublishersFormProps {
  initialData?: Publisher;
  pageMode?: boolean;
}

function PublisherFormFields({
  control,
  errors,
}: {
  control: ReturnType<typeof useForm<PublisherFormData>>["control"];
  errors: FieldErrors<PublisherFormData>;
}) {
  return (
    <Grid container rowSpacing={3} columnSpacing={2} padding={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextFieldElement
          control={control}
          name="name"
          label="Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextFieldElement
          control={control}
          name="website"
          label="Website (Optional)"
          fullWidth
          error={!!errors.website}
          helperText={errors.website?.message}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextFieldElement
          control={control}
          name="address"
          label="Address"
          multiline
          rows={3}
          fullWidth
          error={!!errors.address}
          helperText={errors.address?.message}
        />
      </Grid>
    </Grid>
  );
}

export function PublishersForm({ initialData, pageMode }: PublishersFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublisherFormData>({
    resolver: zodResolver(publisherSchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      website: "",
    },
  });

  const renderFields = () => (
    <PublisherFormFields control={control} errors={errors} />
  );

  const { mutate: savePublisher, isPending: isSaving } = useMutation({
    mutationFn: async (data: PublisherFormData) => {
      if (initialData?.id) {
        return publishersApi.update(initialData.id, data);
      } else {
        return publishersApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers"] });
      enqueueSnackbar(
        initialData?.id
          ? "Publisher updated successfully"
          : "Publisher created successfully",
        { variant: "success" },
      );
      if (pageMode) {
        router.push("/publishers");
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

  const onSubmit = (data: PublisherFormData) => {
    savePublisher(data);
  };

  if (pageMode) {
    return (
      <CardForm
        onSubmit={handleSubmit(onSubmit)}
        headerText={initialData?.id ? "Edit" : "Create"}
        menu="Publisher"
        isEdit
        isLoading={isSaving}
        onBack={() => router.push("/publishers")}
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
      ) : (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Publisher
        </Button>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {initialData?.id ? "Edit Publisher" : "Add New Publisher"}
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
