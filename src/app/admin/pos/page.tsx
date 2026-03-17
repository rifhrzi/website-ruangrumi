"use client";

import { useState } from "react";
import PosHeader from "@/components/pos/pos-header";
import MenuPanel from "@/components/pos/menu-panel";
import OrderPanel from "@/components/pos/order-panel";
import VariantModal from "@/components/pos/variant-modal";
import OrderSuccessModal from "@/components/pos/order-success-modal";
import { usePosStore } from "@/lib/stores/pos-store";
import { generateOrderCode } from "@/lib/utils";

interface SuccessOrder {
  orderCode: string;
  orderType: string;
  tableName: string | null;
  customerName: string;
  itemCount: number;
  total: number;
  paymentMethod: string;
}

export default function PosPage() {
  const [successOrder, setSuccessOrder] = useState<SuccessOrder | null>(null);
  const variantModalItem = usePosStore((s) => s.variantModalItem);

  const handleProcessOrder = () => {
    const state = usePosStore.getState();
    if (state.items.length === 0) return;

    state.setIsProcessing(true);

    setTimeout(() => {
      const order: SuccessOrder = {
        orderCode: generateOrderCode(),
        orderType: state.orderType,
        tableName: state.selectedTable?.name ?? null,
        customerName: state.customerName || "Walk-in Customer",
        itemCount: state.getItemCount(),
        total: state.getTotal(),
        paymentMethod: state.paymentMethod,
      };

      state.setIsProcessing(false);
      setSuccessOrder(order);
    }, 500);
  };

  const handleNewOrder = () => {
    setSuccessOrder(null);
    usePosStore.getState().resetOrder();
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-cream-50">
      <PosHeader />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <MenuPanel />
        </div>
        <div className="w-[360px] shrink-0 overflow-hidden xl:w-[400px]">
          <OrderPanel onProcessOrder={handleProcessOrder} />
        </div>
      </div>
      {variantModalItem && <VariantModal />}
      {successOrder && (
        <OrderSuccessModal order={successOrder} onNewOrder={handleNewOrder} />
      )}
    </div>
  );
}
