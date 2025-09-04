import { useAuth } from "@/context/auth.context";
import { OrderService } from "@/service/client-API/order.service";
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router";
import CheckOutForm from "./CheckOutForm";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage=()=>{
    const [clientSecret,setClientSecret]=useState<string|null>(null)
    const {id}=useParams<{ id: string }>();
    const {user}=useAuth()
    const calledRef = useRef(false);
  const [orderId, setOrderId] = useState<string | null>(null);
      useEffect(() => {
    (async () => {

       if (!id || !user || calledRef.current) return;
  calledRef.current = true;
      
      const result = await OrderService.createPayment(id, user!.id);
      console.log(result)
      if (result) {
        setClientSecret(result.clientSecret);
        setOrderId(result.orderId);
      }
    })();
  }, [id])
  if(!orderId) return
    return(
        <div className="">
            {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckOutForm orderId={orderId} />
          </Elements>
        )}

        </div>
    )
}

export default CheckoutPage