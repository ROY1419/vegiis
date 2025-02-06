import { IProduct } from "@/models/product.model";
import ProductCard from "./ProductCard";

interface ProductGalleryProps {
    product: IProduct[];
}

export default function ProductGallery({ product }: ProductGalleryProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {product.map((item) => (
                <ProductCard key={item._id?.toString()} product={item} />
            ))}

            {product.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <p className="text-base-content/70">No products found</p>
                </div>
            )}
        </div>
    );
}
