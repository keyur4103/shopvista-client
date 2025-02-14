import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Header from "../../layout/Header/Header";

const AddMoneyHeader = () => {
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(
      "pk_test_51QDr5DP1IPTmJpHhB1UyjE56Jo0wcV0A7RkUBMbLDQt3ci3Jy9VTqQ6d6CnziVK8s0dMSwAaDcibAl9h0tQfQipx00uKZ6KiTw"
    )
  );

  return (
    <Elements stripe={stripePromise}>
      <Header />
    </Elements>
  );
};

export default AddMoneyHeader;
