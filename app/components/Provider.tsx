"use client";

import { createContext, useContext, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import NotificationProvider from "./Notification";


interface ProductProviderProps {
    urlEndpoint: string;
    publicKey: string;
    authenticator: () => Promise<any>;
}

const ProductContext = createContext<ProductProviderProps | undefined>(undefined);

function ProductProvider({ children }: { children: ReactNode }) {
    const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

    const authenticator = async () => {
        try {
            const res = await fetch("/api/imagekit-auth");
            if (!res.ok) throw new Error("Failed to authenticate");
            return res.json();
        } catch (error) {
            console.error("Image authentication error:", error);
            throw error;
        }
    };

    return (
        <ProductContext.Provider value={{ urlEndpoint, publicKey, authenticator }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useImage() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useImage must be used within an ProductProvider");
    }
    return context;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider refetchInterval={5 * 60}>
            <NotificationProvider>
                <ProductProvider>{children}</ProductProvider>
            </NotificationProvider>
        </SessionProvider>
    );
}
