const http = require("http");

function post(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let resp = "";
        res.on("data", (chunk) => (resp += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resp) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: resp });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: "GET",
      },
      (res) => {
        let resp = "";
        res.on("data", (chunk) => (resp += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resp) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: resp });
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function run() {
  console.log("Testing Guest Checkout (No Auth Token)...");

  // 1. Guest Invoice Creation
  const invoiceRes = await post("http://127.0.0.1:8080/api/payments/irembopay/invoice", {
    amountRwf: 12500,
    description: "Murakaza Guest Order - Exercise Books & Pens",
    customer: {
      fullName: "Keza Divine (Guest Parent)",
      phone: "0788123456",
      email: "keza@example.com",
    },
    items: [{ id: "sup-001", qty: 2, price: 6250 }],
  });

  console.log("Guest Invoice Response Status:", invoiceRes.status);
  console.log("Invoice Reference:", invoiceRes.data.invoiceNumber);

  if (invoiceRes.status !== 201 || !invoiceRes.data.invoiceNumber) {
    console.error("Guest checkout failed!", invoiceRes);
    process.exit(1);
  }

  const invoiceNumber = invoiceRes.data.invoiceNumber;

  // 2. Poll status as guest
  const statusRes = await get(`http://127.0.0.1:8080/api/payments/status/${invoiceNumber}`);
  console.log("Guest Polling Status:", statusRes.status, statusRes.data);

  // 3. Simulate Approval
  const simRes = await post("http://127.0.0.1:8080/api/payments/test/simulate-webhook", {
    invoiceNumber,
    status: "PAID",
  });
  console.log("Simulation Result:", simRes.status, simRes.data.success);

  // 4. Poll status again after approval
  const finalStatus = await get(`http://127.0.0.1:8080/api/payments/status/${invoiceNumber}`);
  console.log("Final Verified Status:", finalStatus.status, {
    providerRef: finalStatus.data.providerRef,
    status: finalStatus.data.status,
    webhookVerified: finalStatus.data.webhookVerified,
    amountCents: finalStatus.data.amountCents,
  });

  if (finalStatus.data.status === "SUCCEEDED" && finalStatus.data.webhookVerified === true) {
    console.log("✓ GUEST CHECKOUT & REAL SETTLEMENT VERIFIED SUCCESSFULLY!");
  } else {
    console.error("Verification failed!", finalStatus);
    process.exit(1);
  }
}

run().catch(console.error);
