import { HomePage } from "@/features/home/HomePage";

type PageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Array.isArray(params.page) ? params.page[0] : params.page;
  const currentProductPage = Number(page ?? 1);

  return <HomePage currentProductPage={currentProductPage} />;
}
