import { useState } from "react";
import { subscribeNewsletter } from "../api/client";
import "./Newsletter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      setSuccess(true);
      setEmail("");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter">
      <p className="eyebrow">DROP ALERTS</p>
      <h2>Never miss a drop.</h2>
      <p>Get early access to new collections + an exclusive 10% off your first order.</p>

      {success ? (
        <p className="newsletter-success">✓ You&apos;re on the list. Check your inbox.</p>
      ) : (
        <form className="newsletter-form" onSubmit={onSubmit}>
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "..." : "JOIN"}
          </button>
        </form>
      )}
      {error ? <p className="newsletter-error">{error}</p> : null}
    </section>
  );
}
