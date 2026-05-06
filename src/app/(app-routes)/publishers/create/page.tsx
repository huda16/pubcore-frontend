import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { PublishersForm } from "@/components/features/publishers";

export default function PublishersCreatePage() {
  return (
    <>
      <Breadcrumbs customLastPath="Create Publisher" />
      <PublishersForm pageMode />
    </>
  );
}
