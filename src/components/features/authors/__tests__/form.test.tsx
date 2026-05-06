import { render } from "@/__tests__/test-utils";

import { AuthorsForm } from "@/components/features/authors/form";

jest.mock("next/navigation");
jest.mock("notistack");
jest.mock("@tanstack/react-query");
jest.mock("@/hooks/zod/i18n-zod", () => ({
  useI18nZodErrors: jest.fn(),
}));

describe("AuthorsForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<AuthorsForm />);
    expect(container).toBeTruthy();
  });

  it("renders in page mode", () => {
    const { container } = render(<AuthorsForm pageMode />);
    expect(container).toBeTruthy();
  });

  it("renders with initial data", () => {
    const mockAuthor = {
      id: 1,
      name: "Jane Austen",
      bio: "English novelist",
      nationality: "British",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    const { container } = render(
      <AuthorsForm pageMode initialData={mockAuthor} />,
    );
    expect(container).toBeTruthy();
  });
});
