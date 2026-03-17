import CustomerNavbar from "@/components/layout/customer-navbar";
import CustomerFooter from "@/components/layout/customer-footer";
import CartSidebar from "@/components/cart/cart-sidebar";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <CustomerNavbar />
      <main className="flex-1">{children}</main>
      <CustomerFooter />
      <CartSidebar />
    </div>
  );
}
