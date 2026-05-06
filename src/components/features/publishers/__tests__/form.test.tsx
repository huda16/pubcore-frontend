import { render } from "@/__tests__/test-utils";

import { PublishersForm } from "@/components/features/publishers/form";

jest.mock("next/navigation");
jest.mock("notistack");
jest.mock("@tanstack/react-query");
jest.mock("@/hooks/zod/i18n-zod", () => ({
  useI18nZodErrors: jest.fn(),
}));

describe("PublishersForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<PublishersForm />);
    expect(container).toBeTruthy();
  });

  it("renders in page mode", () => {
    const { container } = render(<PublishersForm pageMode />);
    expect(container).toBeTruthy();
  });

  it("renders with initial data", () => {
    const mockPublisher = {
      id: 1,
      name: "Penguin Books",
      email: "contact@penguin.com",
      phone: "+1234567890",
      address: "London, UK",
      website: "https://penguin.co.uk",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    const { container } = render(
      <PublishersForm pageMode initialData={mockPublisher} />,
    );
    expect(container).toBeTruthy();
  });
});
