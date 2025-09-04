
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";



interface CheckOutFormProps{
    orderId:string
}

const   CheckOutForm:React.FC<CheckOutFormProps>=({orderId})=>{
     const stripe = useStripe();
  const elements = useElements();

  const makePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-result?orderId=${orderId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment succeeded! You will be enrolled shortly.");
    } else if (paymentIntent?.status === "processing") {
      toast.info("Processing… we will update your course access soon.");
    }
  };
    return(
        <div>
<form onSubmit={makePayment}>
      <PaymentElement />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
             disabled={!stripe}>
        pay
      </button>
    </form>
       
        </div>
    )
}

export default CheckOutForm

