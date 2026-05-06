import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { AuthorsForm } from "@/components/features/authors";

export default function AuthorsCreatePage() {
  return (
    <>
      <Breadcrumbs customLastPath="Create Author" />
      <AuthorsForm pageMode isCreating />
    </>
  );
}
