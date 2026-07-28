import { notFound } from "next/navigation";
import { getProductById } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Edit product</h1>
      <ProductForm product={product} />
    </div>
  );
}
