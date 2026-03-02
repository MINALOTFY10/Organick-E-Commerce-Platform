import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-utils";
import { findUserOrderById } from "@/lib/data/customer-order";
import { SHIPPING_COST_CENTS } from "@/lib/checkout-constants";

/**
 * GET /api/invoices/[orderId]
 *
 * Generates and returns a plain-text invoice as a downloadable file.
 * Only COMPLETED orders belonging to the authenticated user are allowed.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const order = await findUserOrderById(orderId, session.user.id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "COMPLETED") {
    return NextResponse.json({ error: "Invoices are only available for completed orders." }, { status: 400 });
  }

  const invoice = generateInvoiceHtml(order, session.user.name ?? "Customer");

  return new NextResponse(invoice, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="invoice-${order.id.slice(0, 8)}.html"`,
    },
  });
}

// ── Invoice HTML Generator ─────────────────────────────────────────────────────

function generateInvoiceHtml(order: NonNullable<Awaited<ReturnType<typeof findUserOrderById>>>, customerName: string): string {
  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = SHIPPING_COST_CENTS;
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;">${item.product.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">$${(item.price / 100).toFixed(2)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">$${((item.price * item.quantity) / 100).toFixed(2)}</td>
      </tr>`,
    )
    .join("");

  const addressHtml =
    order.address ?
      `
      <div style="margin-top:24px;">
        <h3 style="margin:0 0 8px;font-size:14px;color:#274C5B;">Ship To</h3>
        <p style="margin:0;font-size:13px;color:#525C60;line-height:1.6;">
          ${order.address.street}<br/>
          ${order.address.city}, ${order.address.state} ${order.address.postalCode}<br/>
          ${order.address.country}
        </p>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Invoice #${order.id.slice(0, 8)}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #274C5B; margin: 0; padding: 0; background: #f9f8f8; }
    .container { max-width: 680px; margin: 24px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(39,76,91,0.08); overflow: hidden; }
    .header { background: #274C5B; color: #fff; padding: 32px; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 4px 0 0; opacity: 0.7; font-size: 14px; }
    .body { padding: 32px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    th { background: #f3f4f6; padding: 10px 12px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #525C60; }
    th:nth-child(2) { text-align: center; }
    th:nth-child(3), th:nth-child(4) { text-align: right; }
    .totals td { padding: 8px 12px; font-size: 13px; }
    .totals .grand { font-size: 16px; font-weight: 700; border-top: 2px solid #274C5B; }
    .print-btn { display: block; margin: 20px auto; background: #274C5B; color: #fff; border: none; padding: 10px 28px; border-radius: 10px; font-size: 14px; cursor: pointer; }
    .print-btn:hover { background: #1e3a47; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Organick</h1>
      <p>Invoice</p>
    </div>
    <div class="body">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div>
          <p style="margin:0;font-size:13px;color:#525C60;">Invoice Number</p>
          <p style="margin:4px 0 0;font-weight:600;font-size:15px;">#${order.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div>
          <p style="margin:0;font-size:13px;color:#525C60;">Date</p>
          <p style="margin:4px 0 0;font-weight:600;font-size:15px;">${dateStr}</p>
        </div>
        <div>
          <p style="margin:0;font-size:13px;color:#525C60;">Customer</p>
          <p style="margin:4px 0 0;font-weight:600;font-size:15px;">${escapeHtml(customerName)}</p>
        </div>
      </div>

      ${addressHtml}

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
        <tbody class="totals">
          <tr>
            <td colspan="3" style="text-align:right;color:#525C60;padding:8px 12px;">Subtotal</td>
            <td style="text-align:right;padding:8px 12px;">$${(itemsSubtotal / 100).toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right;color:#525C60;padding:8px 12px;">Shipping</td>
            <td style="text-align:right;padding:8px 12px;">$${(shipping / 100).toFixed(2)}</td>
          </tr>
          <tr class="grand">
            <td colspan="3" style="text-align:right;padding:12px;">Total</td>
            <td style="text-align:right;padding:12px;">$${(order.total / 100).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <button class="print-btn no-print" onclick="window.print()">Print Invoice</button>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
