import { render } from "@/__tests__/test-utils";

import { BooksForm } from "@/components/features/books/form";

jest.mock("next/navigation");
jest.mock("notistack");
jest.mock("@tanstack/react-query");
jest.mock("@/hooks/zod/i18n-zod", () => ({
  useI18nZodErrors: jest.fn(),
}));

describe("BooksForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<BooksForm />);
    expect(container).toBeTruthy();
  });

  it("renders in page mode", () => {
    const { container } = render(<BooksForm pageMode />);
    expect(container).toBeTruthy();
  });

  it("renders with initial data", () => {
    const mockBook = {
      id: 1,
      title: "Pride and Prejudice",
      isbn: "978-0141439518",
      published: "2014-01-01",
      description: "A romantic novel by Jane Austen",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    const { container } = render(
      <BooksForm pageMode initialData={mockBook} />,
    );
    expect(container).toBeTruthy();
  });
});
