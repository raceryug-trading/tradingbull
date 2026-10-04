import { useMemo, useState } from "react";
import {
  CheckCircle2,
  QrCode,
  Smartphone,
  TicketPercent,
  Copy,
  MessageCircle,
  Lock,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { BRAND, UPI, COURSES, COUPONS } from "../config";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function PaymentSection() {
  const [selectedId, setSelectedId] = useState(COURSES[0].id);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, percentOff } or null
  const [initiated, setInitiated] = useState(false);

  const course = useMemo(
    () => COURSES.find((c) => c.id === selectedId) || COURSES[0],
    [selectedId]
  );

  const finalPrice = useMemo(() => {
    if (!appliedCoupon) return course.price;
    return Math.max(1, Math.round(course.price * (1 - appliedCoupon.percentOff / 100)));
  }, [course, appliedCoupon]);

  const applyCoupon = () => {
    const typed = coupon.trim().toUpperCase();
    const match = COUPONS.find((c) => c.code.toUpperCase() === typed);
    if (match) {
      setAppliedCoupon(match);
      toast.success(`${match.percentOff}% OFF applied with ${match.code}!`);
    } else {
      setAppliedCoupon(null);
      toast.error("Invalid coupon code");
    }
  };

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI.id,
      pn: UPI.payeeName,
      am: String(finalPrice),
      cu: "INR",
      tn: `${course.title}${appliedCoupon ? ` (${appliedCoupon.code})` : ""}`,
    });
    return `upi://pay?${params.toString()}`;
  }, [course, finalPrice, appliedCoupon]);

  const whatsAppLink = useMemo(() => {
    const num = (BRAND.whatsappNumber || "").replace(/[^\d]/g, "");
    const msg = encodeURIComponent(
      `Hi, I just paid ${inr(finalPrice)} for the "${course.title}" via UPI (${UPI.id}). ${
        appliedCoupon ? `Coupon ${appliedCoupon.code} applied. ` : ""
      }Please activate my login — screenshot attached.`
    );
    return `https://wa.me/${num}?text=${msg}`;
  }, [course, finalPrice, appliedCoupon]);

  const handlePayNow = () => {
    setInitiated(true);
    // Open UPI intent — opens the user's installed UPI app
    window.location.href = upiLink;
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI.id);
      toast.success("UPI ID copied");
    } catch {
      toast.error("Copy failed — long-press to copy");
    }
  };

  return (
    <section
      id="enroll"
      className="border-y border-[#232D42] bg-[#0A0D14]/60"
      data-testid="payment-section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center">
          <div className="font-mono-t text-[10px] uppercase tracking-[0.3em] text-amber-400">
            Enroll Now
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-gray-100">
            Join the Academy — Pay via UPI
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
            One-time payment · Lifetime access · Login credentials shared on WhatsApp within 2 hours of payment.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* LEFT — Course selector + price breakdown */}
          <div className="rounded-lg border border-[#232D42] bg-[#111622] p-5 sm:p-6">
            <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
              1. Choose Your Course
            </h3>
            <div
              className="mt-4 grid gap-3 sm:grid-cols-2"
              data-testid="course-selector"
            >
              {COURSES.map((c) => {
                const active = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    data-testid={`course-option-${c.id}`}
                    onClick={() => {
                      setSelectedId(c.id);
                      setInitiated(false);
                    }}
                    className={`group text-left relative overflow-hidden rounded-lg border p-4 transition-all ${
                      active
                        ? "border-emerald-400 bg-emerald-500/10"
                        : "border-[#232D42] bg-[#0A0D14] hover:border-emerald-500/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-mono-t text-[9px] uppercase tracking-widest text-amber-400">
                          {c.tag}
                        </div>
                        <h4 className="mt-1 font-display text-base font-bold uppercase tracking-wide text-gray-100 leading-tight">
                          {c.title}
                        </h4>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {c.subtitle}
                        </p>
                      </div>
                      {active && (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-mono-t text-[11px] text-gray-500 line-through">
                        {inr(c.mrp)}
                      </span>
                      <span className="font-display text-xl font-extrabold text-emerald-400">
                        {inr(c.price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Highlights */}
            <div className="mt-5 rounded-md border border-[#232D42] bg-[#0A0D14] p-4">
              <div className="font-mono-t text-[10px] uppercase tracking-widest text-emerald-400">
                What's included
              </div>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {course.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-1.5 text-[13px] text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-400" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coupon */}
            <div className="mt-5 rounded-md border border-dashed border-[#232D42] bg-[#0A0D14] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TicketPercent className="h-4 w-4 text-amber-400" />
                  <span className="font-mono-t text-[11px] uppercase tracking-widest text-gray-400">
                    Have a coupon?
                  </span>
                </div>
                {appliedCoupon && (
                  <span
                    data-testid="coupon-badge"
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2 py-0.5 font-mono-t text-[10px] uppercase tracking-widest text-emerald-300"
                  >
                    <BadgeCheck className="h-3 w-3" /> {appliedCoupon.percentOff}% OFF
                  </span>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  data-testid="coupon-input"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value);
                    if (appliedCoupon) setAppliedCoupon(null);
                  }}
                  placeholder="Enter coupon code"
                  className="input-terminal flex-1 rounded px-3 py-2 text-sm uppercase tracking-wider"
                />
                <button
                  data-testid="coupon-apply-button"
                  type="button"
                  onClick={applyCoupon}
                  className="rounded bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0A0D14] hover:bg-amber-400 transition-colors"
                >
                  Apply
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5" data-testid="coupon-hints">
                {COUPONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    data-testid={`coupon-hint-${c.code}`}
                    onClick={() => {
                      setCoupon(c.code);
                      setAppliedCoupon(c);
                      toast.success(`${c.percentOff}% OFF applied with ${c.code}!`);
                    }}
                    className="rounded border border-amber-500/30 bg-amber-500/5 px-2 py-0.5 font-mono-t text-[10px] uppercase tracking-widest text-amber-300 hover:bg-amber-500/15 transition-colors"
                  >
                    {c.code} · {c.percentOff}% OFF
                  </button>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="mt-5 rounded-md border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent p-4">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Course price</span>
                <span className="font-mono-t">{inr(course.price)}</span>
              </div>
              {appliedCoupon && (
                <div
                  className="mt-1 flex items-center justify-between text-sm text-emerald-300"
                  data-testid="coupon-discount-line"
                >
                  <span>Coupon {appliedCoupon.code} ({appliedCoupon.percentOff}% off)</span>
                  <span className="font-mono-t">
                    − {inr(course.price - finalPrice)}
                  </span>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-emerald-500/20 pt-3">
                <span className="font-mono-t text-[11px] uppercase tracking-widest text-gray-400">
                  You pay
                </span>
                <span
                  data-testid="final-price"
                  className="font-display text-3xl font-extrabold text-emerald-400"
                >
                  {inr(finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — Payment panel */}
          <div className="space-y-6">
            {/* Pay Now (mobile UPI deep link) */}
            <div className="rounded-lg border border-[#232D42] bg-[#111622] p-5">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
                  2. Pay on Mobile
                </h3>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Opens Google Pay / PhonePe / Paytm / any UPI app on your phone with ₹{finalPrice} pre-filled.
              </p>
              <a
                data-testid="pay-now-button"
                href={upiLink}
                onClick={() => setInitiated(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 py-3 text-sm font-bold uppercase tracking-widest text-[#0A0D14] hover:bg-emerald-400 transition-colors"
              >
                Pay {inr(finalPrice)} Now
              </a>
              <div className="mt-3 flex items-center justify-between rounded border border-[#232D42] bg-[#0A0D14] px-3 py-2">
                <div className="min-w-0">
                  <div className="font-mono-t text-[9px] uppercase tracking-widest text-gray-500">
                    UPI ID
                  </div>
                  <div
                    data-testid="upi-id-text"
                    className="font-mono-t text-xs text-gray-200 truncate"
                  >
                    {UPI.id}
                  </div>
                </div>
                <button
                  data-testid="copy-upi-button"
                  onClick={copyUpi}
                  className="ml-3 inline-flex items-center gap-1 rounded border border-[#232D42] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:border-emerald-500"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
            </div>

            {/* QR Code (desktop / scan) */}
            <div className="rounded-lg border border-[#232D42] bg-[#111622] p-5">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-emerald-400" />
                <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
                  Or Scan QR
                </h3>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Scan with any UPI app and enter {inr(finalPrice)} as the amount.
              </p>
              <div className="mt-4 flex items-center justify-center rounded-md bg-white p-3">
                <img
                  data-testid="payment-qr-image"
                  src={UPI.qrImage}
                  alt="Pay via UPI QR"
                  className="w-full max-w-[220px] rounded"
                />
              </div>
              <div className="mt-3 text-center font-mono-t text-[10px] uppercase tracking-widest text-gray-500">
                Payee · {UPI.payeeName}
              </div>
            </div>

            {/* After-payment WhatsApp step */}
            <div
              className={`rounded-lg border p-5 transition-colors ${
                initiated
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-amber-500/40 bg-amber-500/5"
              }`}
              data-testid="post-payment-card"
            >
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-400" />
                <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
                  3. Get Your Login
                </h3>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                After payment, send the screenshot on WhatsApp — your username &amp; password are shared within 2 hours.
              </p>
              <a
                data-testid="whatsapp-confirm-button"
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-3 text-sm font-bold uppercase tracking-widest text-black hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Send Screenshot on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
