"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useNotification } from "@/app/components/Notification";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { IProduct, VeggisVariant, VEGIIS_VARIANTS } from "@/models/product.model";
import Image from "next/image";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const { showNotification } = useNotification();

    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<VeggisVariant | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const id = params?.id;

            console.log("Product ID:", id); // Debugging

            if (!id) {
                setError("Product ID is missing");
                setLoading(false);
                return;
            }

            try {
                const data = await apiClient.getProduct(id.toString());

                console.log("Product Data:", data); // Debugging

                if (!data || Object.keys(data).length === 0) {
                    setError("Product not found");
                } else {
                    setProduct(data);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err instanceof Error ? err.message : "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    const handlePurchase = async (variant: VeggisVariant) => {
        if (!session) {
            showNotification("Please login to make a purchase", "error");
            router.push("/login");
            return;
        }

        if (!product?._id) {
            showNotification("Invalid product", "error");
            return;
        }

        try {
            const { orderId, amount } = await apiClient.createOrder({
                productId: product._id,
                variant,
            });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount,
                currency: "INR",
                name: "Veggies Shop",
                description: `${product.name} - ${variant.type} Version`,
                order_id: orderId,
                handler: function () {
                    showNotification("Payment successful!", "success");
                    router.push("/orders");
                },
                prefill: {
                    email: session.user.email,
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            showNotification(
                error instanceof Error ? error.message : "Payment failed",
                "error"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="alert alert-error max-w-md mx-auto my-8">
                <AlertCircle className="w-6 h-6" />
                <span>{error || "Product not found"}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden">
                        <Image
                            src={product.productUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            width={500}
                            height={500}
                            priority
                        />
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                        <p className="text-base-content/80 text-lg">{product.description}</p>
                    </div>

                    {/* Variants Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Available Variants</h2>
                        {product?.variants?.length > 0 ? (
                            product.variants.map((variant) => (
                                <div
                                    key={variant.type}
                                    className={`card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors ${selectedVariant?.type === variant.type
                                        ? "ring-2 ring-primary"
                                        : ""
                                        }`}
                                    onClick={() => setSelectedVariant(variant)}
                                >
                                    <div className="card-body p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {VEGIIS_VARIANTS[variant.type]?.label || "Unknown Variant"}
                                                </h3>
                                                <p className="text-sm text-base-content/70">
                                                    ₹{variant.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePurchase(variant);
                                                }}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-red-500">No variants available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
