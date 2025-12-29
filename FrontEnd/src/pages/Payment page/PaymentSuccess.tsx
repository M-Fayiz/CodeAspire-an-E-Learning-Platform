import { useEffect, useState } from "react";
import { CheckCircle, FileText, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { OrderService } from "@/service/order.service";

const PaymentSuccess = () => {
  const query = new URLSearchParams(window.location.search);
  const sessionId = query.get("session_id");

  const [data, setData] = useState<{
    amount: number;
    currency: string;
    paymentStatus: string;
    paymentIntentId: string;
    invoiceId?: string;
    invoiceUrl?: string;
    invoicePdf?: string;
    paymentType: "COURSE" | "SLOT";
    createdAt: number;
  } | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    (async () => {
      const session = await OrderService.getOrderDetails(sessionId);

      if (!session) return;

      setData({
        amount: session.amount_total / 100,
        currency: session.currency,
        paymentStatus: session.payment_status,
        paymentIntentId: session.payment_intent?.id,
        invoiceId: session.invoice?.id,
        invoiceUrl: session.invoice?.hosted_invoice_url,
        invoicePdf: session.invoice?.invoice_pdf,
        paymentType:
          session.metadata?.paymentType === "SLOT_BOOKING" ? "SLOT" : "COURSE",
        createdAt: session.created,
      });
    })();
  }, [sessionId]);

  if (!data) return null;

  const redirectPath =
    data.paymentType === "COURSE"
      ? "/learner/enrolled-courses"
      : "/learner/slots";

  const redirectLabel =
    data.paymentType === "COURSE" ? "View Enrolled Courses" : "View My Slots";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-orange-500" size={56} />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 text-center">
          Payment Successful
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Your payment has been completed successfully
        </p>

        <div className="border-t border-gray-200 my-5" />

        {/* Payment details */}
        <div className="space-y-3 text-sm">
          <Row label="Amount Paid">
            ₹{data.amount} {data.currency.toUpperCase()}
          </Row>

          <Row label="Payment Status">
            <span className="capitalize">{data.paymentStatus}</span>
          </Row>

          <Row label="Transaction ID">{data.paymentIntentId}</Row>

          {data.invoiceId && <Row label="Invoice ID">{data.invoiceId}</Row>}

          <Row label="Date">
            {new Date(data.createdAt * 1000).toLocaleString()}
          </Row>
        </div>

        {/* Invoice actions */}
        {(data.invoiceUrl || data.invoicePdf) && (
          <div className="mt-4 flex flex-col gap-2">
            {data.invoiceUrl && (
              <a
                href={data.invoiceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                <ExternalLink size={16} />
                View Invoice
              </a>
            )}

            {data.invoicePdf && (
              <a
                href={data.invoicePdf}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                <FileText size={16} />
                Download Invoice (PDF)
              </a>
            )}
          </div>
        )}

        {/* Navigation */}
        <Link
          to={redirectPath}
          className="mt-6 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-medium transition"
        >
          {redirectLabel}
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex justify-between text-gray-700">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-right">{children}</span>
  </div>
);
