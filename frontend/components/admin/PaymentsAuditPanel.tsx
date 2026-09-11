"use client";

import { useEffect, useState } from "react";
import { payments, AdminPaymentItem, AdminPaymentsResponse } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PaymentsAuditPanel() {
  const { language } = useLanguage();
  const [data, setData] = useState<AdminPaymentsResponse>({
    payments: [],
    summary: {
      totalCount: 0,
      succeededCount: 0,
      pendingCount: 0,
      failedCount: 0,
      verifiedCount: 0,
      totalVolumeRwf: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentItem | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  async function loadPayments() {
    setLoading(true);
    try {
      const res = await payments.listAllAdmin({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        provider: providerFilter === "ALL" ? undefined : providerFilter,
        search: search.trim() || undefined,
      });
      setData(res);
    } catch (err) {
      console.error("Failed to load admin payments:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, [statusFilter, providerFilter]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadPayments();
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  }

  const formatRwf = (cents: number) => {
    const rwf = Math.round(cents / 100);
    return new Intl.NumberFormat(language === "rw" ? "rw-RW" : "en-RW").format(rwf) + " RWF";
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === "rw" ? "rw-RW" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Header & KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Settled Volume */}
        <div className="rounded-card border border-ubumwe-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              {language === "rw" ? "Amafaranga Yinjiye" : "Settled Revenue"}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-imbuto-50 text-imbuto-600 font-bold">
              💳
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-ubumwe-900">
            {new Intl.NumberFormat(language === "rw" ? "rw-RW" : "en-RW").format(data.summary.totalVolumeRwf)} RWF
          </p>
          <p className="mt-1 text-xs text-ink/50">
            {language === "rw" ? "Kwishyura kwagenzuwe neza" : "From cryptographically verified transactions"}
          </p>
        </div>

        {/* Succeeded */}
        <div className="rounded-card border border-ubumwe-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-imbuto-600">
              {language === "rw" ? "Ibyishyuwe Neza" : "Succeeded"}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-imbuto-50 text-imbuto-600 font-bold">
              ✓
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-imbuto-600">{data.summary.succeededCount}</p>
          <p className="mt-1 text-xs text-ink/50">
            {data.summary.totalCount > 0
              ? `${Math.round((data.summary.succeededCount / data.summary.totalCount) * 100)}% settlement rate`
              : "No orders yet"}
          </p>
        </div>

        {/* Pending Webhooks */}
        <div className="rounded-card border border-ubumwe-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sun-600">
              {language === "rw" ? "Bitegereje (Pending)" : "Pending Settlement"}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sun-50 text-sun-600 font-bold">
              ⏳
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-sun-600">{data.summary.pendingCount}</p>
          <p className="mt-1 text-xs text-ink/50">
            {language === "rw" ? "Bitegereje kwemezwa na Gateway" : "Awaiting provider webhook callback"}
          </p>
        </div>

        {/* Cryptographic Verification */}
        <div className="rounded-card border border-ubumwe-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ubumwe">
              {language === "rw" ? "Umutekano (HMAC)" : "Cryptographic Proof"}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ubumwe-50 text-ubumwe font-bold">
              🛡️
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-ubumwe-900">{data.summary.verifiedCount}</p>
          <p className="mt-1 text-xs text-ink/50">
            {language === "rw" ? "Byemejwe na HMAC-SHA256" : "Zero-trust webhook validated"}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-card border border-ubumwe-100 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === "rw"
                ? "Shakisha fagitire (INV-...), izina, telefone, imeri..."
                : "Search invoice (INV-...), name, phone, email..."
            }
            className="w-full max-w-md rounded-pill border border-ubumwe-100 px-4 py-2 text-sm outline-none transition focus:border-ubumwe"
          />
          <button
            type="submit"
            className="rounded-pill bg-ubumwe px-4 py-2 text-sm font-semibold text-white transition hover:bg-ubumwe-800"
          >
            {language === "rw" ? "Shakisha" : "Search"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Provider Filter */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="rounded-pill border border-ubumwe-100 bg-white px-3 py-2 text-xs font-semibold text-ink/80 outline-none focus:border-ubumwe"
          >
            <option value="ALL">{language === "rw" ? "Amarembo Yose (All)" : "All Gateways"}</option>
            <option value="IREMBOPAY">🇷🇼 IremboPay (Official)</option>
            <option value="MOMO">🟡 MTN Mobile Money</option>
            <option value="STRIPE">💳 Stripe (Cards)</option>
            <option value="FLUTTERWAVE">🦋 Flutterwave</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-pill border border-ubumwe-100 bg-white px-3 py-2 text-xs font-semibold text-ink/80 outline-none focus:border-ubumwe"
          >
            <option value="ALL">{language === "rw" ? "Imiterere Yose (All)" : "All Statuses"}</option>
            <option value="SUCCEEDED">✓ {language === "rw" ? "Byishyuwe (Succeeded)" : "Succeeded"}</option>
            <option value="PENDING">⏳ {language === "rw" ? "Bitegereje (Pending)" : "Pending"}</option>
            <option value="FAILED">✗ {language === "rw" ? "Byanze (Failed)" : "Failed"}</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={() => loadPayments()}
            disabled={loading}
            title="Refresh Transactions"
            className="flex items-center gap-1.5 rounded-pill border border-ubumwe-100 bg-gray-50 px-3 py-2 text-xs font-semibold text-ink/70 hover:bg-gray-100"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            {language === "rw" ? "Vugurura" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-card border border-ubumwe-100 bg-white shadow-soft">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-ubumwe border-t-transparent" />
            <p className="mt-3 text-sm font-semibold text-ink/60">
              {language === "rw" ? "Kuzana amakuru y'ubwishyu..." : "Loading transaction audit logs..."}
            </p>
          </div>
        ) : data.payments.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl">🧾</span>
            <p className="mt-3 font-semibold text-ubumwe-900">
              {language === "rw" ? "Nta bwishyu buraboneka" : "No payments match your filter"}
            </p>
            <p className="mt-1 text-xs text-ink/50">
              {language === "rw"
                ? "Gerageza guhindura akayunguruzo cyangwa gushakisha ikindi."
                : "Try adjusting your filters or creating an order in checkout."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ubumwe-100 bg-ubumwe-50/50 text-xs font-semibold text-ink/70">
                <tr>
                  <th className="py-3.5 pl-5 pr-3">Date & Time</th>
                  <th className="px-3 py-3.5">Gateway</th>
                  <th className="px-3 py-3.5">Invoice / Provider Ref</th>
                  <th className="px-3 py-3.5">Customer</th>
                  <th className="px-3 py-3.5">Amount</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5">Verification</th>
                  <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ubumwe-100/60">
                {data.payments.map((p) => {
                  const customer = p.metadata?.customer;
                  const customerName = customer?.fullName || p.user?.fullName || "Guest Customer";
                  const customerPhone = customer?.phone || "—";
                  const customerEmail = customer?.email || p.user?.email || "—";

                  return (
                    <tr key={p.id} className="transition hover:bg-ubumwe-50/30">
                      {/* Date */}
                      <td className="whitespace-nowrap py-4 pl-5 pr-3 text-xs text-ink/70">
                        {formatDate(p.createdAt)}
                      </td>

                      {/* Gateway / Provider */}
                      <td className="whitespace-nowrap px-3 py-4">
                        {p.provider === "IREMBOPAY" ? (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                            🇷🇼 IremboPay
                          </span>
                        ) : p.provider === "MOMO" ? (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-yellow-50 px-2.5 py-1 text-xs font-bold text-yellow-800">
                            🟡 MTN MoMo
                          </span>
                        ) : p.provider === "STRIPE" ? (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                            💳 Card (Stripe)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-700">
                            🦋 Flutterwave
                          </span>
                        )}
                      </td>

                      {/* Reference */}
                      <td className="whitespace-nowrap px-3 py-4 font-mono text-xs text-ink">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-ubumwe-900">{p.providerRef}</span>
                          <button
                            onClick={() => copyToClipboard(p.providerRef)}
                            className="text-ink/40 hover:text-ubumwe"
                            title="Copy reference"
                          >
                            {copiedRef === p.providerRef ? "✓" : "📋"}
                          </button>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-3 py-4">
                        <div className="text-xs font-semibold text-ubumwe-900">{customerName}</div>
                        <div className="text-[11px] text-ink/60">
                          {customerPhone !== "—" ? customerPhone : customerEmail}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="whitespace-nowrap px-3 py-4 font-semibold text-ubumwe-900">
                        {formatRwf(p.amountCents)}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-3 py-4">
                        {p.status === "SUCCEEDED" ? (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-imbuto-50 px-2.5 py-1 text-xs font-bold text-imbuto-700">
                            ✓ {language === "rw" ? "Byishyuwe" : "Succeeded"}
                          </span>
                        ) : p.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-sun-50 px-2.5 py-1 text-xs font-bold text-sun-700">
                            ⏳ {language === "rw" ? "Bitegereje" : "Pending"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                            ✗ {language === "rw" ? "Byanze" : "Failed"}
                          </span>
                        )}
                      </td>

                      {/* Cryptographic Webhook Proof */}
                      <td className="whitespace-nowrap px-3 py-4">
                        {p.webhookVerified ? (
                          <span
                            className="inline-flex items-center gap-1 rounded-pill bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800"
                            title="Cryptographically verified server-to-server webhook"
                          >
                            🛡️ HMAC Verified
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 rounded-pill bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500"
                            title="Awaiting verified webhook"
                          >
                            ⏳ Unverified
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap py-4 pl-3 pr-5 text-right">
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="rounded-pill border border-ubumwe-100 bg-white px-3 py-1 text-xs font-semibold text-ubumwe transition hover:bg-ubumwe hover:text-white"
                        >
                          {language === "rw" ? "Ibisobanuro" : "Audit Details"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Detail & Receipt Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-ubumwe-100 pb-4">
              <div>
                <span className="rounded-pill bg-ubumwe-50 px-2.5 py-1 text-xs font-bold text-ubumwe">
                  AUDIT LOG #{selectedPayment.providerRef}
                </span>
                <h3 className="mt-1 text-xl font-black text-ubumwe-900">
                  {selectedPayment.provider === "IREMBOPAY"
                    ? "🇷🇼 IremboPay Payment Verification"
                    : `${selectedPayment.provider} Transaction Audit`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink/40 hover:bg-gray-100 hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-5 text-sm">
              {/* Status Banner */}
              <div
                className={`rounded-xl p-4 ${
                  selectedPayment.status === "SUCCEEDED"
                    ? "bg-imbuto-50 border border-imbuto-200 text-imbuto-800"
                    : selectedPayment.status === "PENDING"
                    ? "bg-sun-50 border border-sun-200 text-sun-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    Status: {selectedPayment.status} (
                    {selectedPayment.webhookVerified
                      ? "Cryptographically Confirmed via Webhook"
                      : "Awaiting Server Callback"}
                    )
                  </span>
                  <span className="text-lg font-black">{formatRwf(selectedPayment.amountCents)}</span>
                </div>
              </div>

              {/* Transaction Key Data Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-xs">
                <div>
                  <p className="text-ink/60">Invoice / Provider Ref</p>
                  <p className="font-mono font-bold text-ubumwe-900">{selectedPayment.providerRef}</p>
                </div>
                <div>
                  <p className="text-ink/60">Payment Gateway</p>
                  <p className="font-semibold text-ubumwe-900">{selectedPayment.provider}</p>
                </div>
                <div>
                  <p className="text-ink/60">Created At</p>
                  <p className="font-semibold text-ubumwe-900">{formatDate(selectedPayment.createdAt)}</p>
                </div>
                <div>
                  <p className="text-ink/60">Last Updated / Settled</p>
                  <p className="font-semibold text-ubumwe-900">{formatDate(selectedPayment.updatedAt)}</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="rounded-xl border border-ubumwe-100 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60">Customer Information</h4>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
                  <div>
                    <span className="text-ink/50">Name:</span>
                    <p className="font-semibold text-ubumwe-900">
                      {selectedPayment.metadata?.customer?.fullName || selectedPayment.user?.fullName || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-ink/50">Phone:</span>
                    <p className="font-semibold text-ubumwe-900">
                      {selectedPayment.metadata?.customer?.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-ink/50">Email:</span>
                    <p className="font-semibold text-ubumwe-900">
                      {selectedPayment.metadata?.customer?.email || selectedPayment.user?.email || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Directive & Webhook Proof */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-900">
                <div className="flex items-center gap-2 font-bold">
                  <span>🛡️</span>
                  <span>Production Security Audit Confirmation</span>
                </div>
                <p className="mt-1 text-ink/70">
                  {selectedPayment.webhookVerified
                    ? "Cryptographic HMAC-SHA256 signature was verified across raw byte buffer with constant-time comparison. No client return URL or query parameter was trusted."
                    : "Zero-trust model active: This payment has NOT transitioned to settled state because cryptographic webhook verification is still pending."}
                </p>
              </div>

              {/* Raw Metadata / Webhook payload inspection */}
              {selectedPayment.metadata && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60">
                    Audit Metadata & Raw Gateway Payload
                  </h4>
                  <pre className="mt-1 max-h-40 overflow-x-auto rounded-lg bg-gray-900 p-3 font-mono text-[11px] text-green-400">
                    {JSON.stringify(selectedPayment.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3 border-t border-ubumwe-100 pt-4">
              <button
                onClick={() => window.print()}
                className="rounded-pill border border-ubumwe-100 px-4 py-2 text-xs font-semibold text-ubumwe hover:bg-ubumwe-50"
              >
                🖨️ Print Dispatch Receipt
              </button>
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-pill bg-ubumwe px-5 py-2 text-xs font-semibold text-white hover:bg-ubumwe-800"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
