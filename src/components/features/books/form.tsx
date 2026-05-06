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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { type FieldErrors, useForm } from "react-hook-form";
import { AutocompleteElement, TextFieldElement } from "react-hook-form-mui";
import { z } from "zod";

import { CardForm } from "@/components/common/form/card";

import { authorsApi, booksApi, publishersApi } from "@/lib/api";

import type { Book } from "@/types/entities";

const bookSchema = z.object({
  title: z.string().min(2, "Title is required"),
  isbn: z.string().min(5, "ISBN is required"),
  description: z.string().min(5, "Description is required"),
  genre: z.string().min(2, "Genre is required"),
  year: z.coerce.number().min(1000).max(9999),
  author_id: z.coerce.number().int().positive("Author is required"),
  publisher_id: z.coerce.number().int().positive("Publisher is required"),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BooksFormProps {
  initialData?: Book;
  pageMode?: boolean;
}

function BookFormFields({
  control,
  errors,
  authorsList,
  publishersList,
}: {
  control: ReturnType<typeof useForm<BookFormData>>["control"];
  errors: FieldErrors<BookFormData>;
  authorsList?: Awaited<ReturnType<typeof authorsApi.list>>;
  publishersList?: Awaited<ReturnType<typeof publishersApi.list>>;
}) {
  return (
    <Grid container rowSpacing={3} columnSpacing={2} padding={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextFieldElement
          control={control}
          name="title"
          label="Title"
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextFieldElement
          control={control}
          name="isbn"
          label="ISBN"
          fullWidth
          error={!!errors.isbn}
          helperText={errors.isbn?.message}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextFieldElement
          control={control}
          name="description"
          label="Description"
          multiline
          rows={3}
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextFieldElement
          control={control}
          name="genre"
          label="Genre"
          fullWidth
          error={!!errors.genre}
          helperText={errors.genre?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextFieldElement
          control={control}
          name="year"
          label="Year"
          type="number"
          fullWidth
          error={!!errors.year}
          helperText={errors.year?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AutocompleteElement
          control={control}
          name="author_id"
          label="Author"
          options={
            authorsList?.data?.map((a) => ({ id: a.id, label: a.name })) || []
          }
          matchId
          loading={!authorsList}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AutocompleteElement
          control={control}
          name="publisher_id"
          label="Publisher"
          options={
            publishersList?.data?.map((p) => ({ id: p.id, label: p.name })) ||
            []
          }
          matchId
          loading={!publishersList}
        />
      </Grid>
    </Grid>
  );
}

export function BooksForm({ initialData, pageMode }: BooksFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {
      title: "",
      isbn: "",
      description: "",
      genre: "",
      year: new Date().getFullYear(),
      author_id: 0,
      publisher_id: 0,
    },
  });

  // Fetch authors
  const { data: authorsList } = useQuery({
    queryKey: ["authors-all"],
    queryFn: () => authorsApi.list({ limit: 100 }),
    enabled: open,
  });

  // Fetch publishers
  const { data: publishersList } = useQuery({
    queryKey: ["publishers-all"],
    queryFn: () => publishersApi.list({ limit: 100 }),
    enabled: open,
  });

  const { data: pageAuthorsList } = useQuery({
    queryKey: ["authors-all-page"],
    queryFn: () => authorsApi.list({ limit: 100 }),
    enabled: pageMode,
  });

  const { data: pagePublishersList } = useQuery({
    queryKey: ["publishers-all-page"],
    queryFn: () => publishersApi.list({ limit: 100 }),
    enabled: pageMode,
  });

  const { mutate: saveBook, isPending: isSaving } = useMutation({
    mutationFn: async (data: BookFormData) => {
      if (initialData?.id) {
        return booksApi.update(initialData.id, data);
      } else {
        return booksApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      enqueueSnackbar(
        initialData?.id
          ? "Book updated successfully"
          : "Book created successfully",
        { variant: "success" },
      );
      if (pageMode) {
        router.push("/books");
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

  const onSubmit = (data: BookFormData) => {
    saveBook(data);
  };

  if (pageMode) {
    return (
      <CardForm
        onSubmit={handleSubmit(onSubmit)}
        headerText={initialData?.id ? "Edit" : "Create"}
        menu="Book"
        isEdit
        isLoading={isSaving}
        onBack={() => router.push("/books")}
      >
        <BookFormFields
          control={control}
          errors={errors}
          authorsList={pageAuthorsList}
          publishersList={pagePublishersList}
        />
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
          Add Book
        </Button>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {initialData?.id ? "Edit Book" : "Add New Book"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <BookFormFields
              control={control}
              errors={errors}
              authorsList={authorsList}
              publishersList={publishersList}
            />
          </form>
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
