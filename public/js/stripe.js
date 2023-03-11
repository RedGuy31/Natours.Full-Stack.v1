import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51Mj4B9DP2zC8ObtynRaOK9llm20UetenmqISRQooX0C6MmMNvJzlQaVty5Umna3BdLz2llyg3uWrUxD842RRYcio00VO1sWe8I"
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
