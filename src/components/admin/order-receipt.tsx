import { formatCurrency } from "@/lib/utils";
import Logo from "@/components/ui/logo";

export interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
  variants?: string[];
  addons?: string[];
}

export interface ReceiptData {
  orderCode: string;
  date: string;
  type: string;
  table?: string | null;
  customerName: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

export default function OrderReceipt({ data }: { data: ReceiptData }) {
  return (
    <div className="hidden print:block w-[80mm] mx-auto bg-white text-black font-mono text-[11px] leading-tight p-4">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Logo size="lg" className="mb-2 grayscale" />
        <h1 className="text-xl font-bold tracking-widest uppercase mb-1">
          Ruang Rumi
        </h1>
        <p className="max-w-[80%] mx-auto text-[10px] text-gray-500">
          Jl. Sudirman No. 42, Senopati
          <br />
          Jakarta Selatan 12190
          <br />
          +62 21 5678 9012
        </p>
      </div>

      {/* Meta Info */}
      <div className="border-t border-b border-black/20 border-dashed py-2 mb-4 space-y-1">
        <div className="flex justify-between">
          <span>Order No</span>
          <span className="font-bold">{data.orderCode}</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span>{data.date}</span>
        </div>
        <div className="flex justify-between">
          <span>Type</span>
          <span className="capitalize">{data.type.replace("-", " ")}</span>
        </div>
        {data.table && (
          <div className="flex justify-between">
            <span>Table</span>
            <span>{data.table}</span>
          </div>
        )}
        {data.customerName && (
          <div className="flex justify-between">
            <span>Customer</span>
            <span>{data.customerName}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-4">
        {data.items.map((item, idx) => (
          <div key={idx} className="mb-2">
            <div className="flex justify-between font-bold">
              <span className="break-words max-w-[65%] leading-snug">
                {item.name}
              </span>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-0.5">
              <span>
                {item.qty} x {formatCurrency(item.price)}
              </span>
            </div>
            {(item.variants?.length ? true : false || item.addons?.length ? true : false) && (
              <div className="text-[10px] text-gray-500 mt-0.5 pr-8">
                {item.variants?.map((v) => (
                  <div key={v}>- {v}</div>
                ))}
                {item.addons?.map((a) => (
                  <div key={a}>+ {a}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-black/20 border-dashed pt-2 space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(data.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (11%)</span>
          <span>{formatCurrency(data.tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service (5%)</span>
          <span>{formatCurrency(data.serviceCharge)}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatCurrency(data.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm mt-2 border-t border-black/20 pt-2">
          <span>TOTAL</span>
          <span>{formatCurrency(data.total)}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-black/20 border-dashed pt-4 flex flex-col items-center text-center space-y-1">
        <p className="capitalize">
          Payment: <span className="font-bold">{data.paymentMethod.replace("-", " ")}</span>
        </p>
        <p className="mt-4 font-bold tracking-widest text-[12px]">THANK YOU!</p>
        <p className="text-[10px] text-gray-500 mt-1">Please come again</p>
        <p className="text-[9px] text-gray-400 mt-4">
          Wifi: RuangRumi_Guest | Pass: premiumcoffee
        </p>
      </div>
    </div>
  );
}
