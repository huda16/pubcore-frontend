import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { BooksForm } from "@/components/features/books";

export default function BooksCreatePage() {
  return (
    <>
      <Breadcrumbs customLastPath="Create Book" />
      <BooksForm pageMode />
    </>
  );
}
