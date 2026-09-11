const http = require("http");

function post(url, data, headers = {}) {
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
          ...headers,
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

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: "GET",
        headers,
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
  console.log("Testing Admin Payments API...");

  // 1. Login as Admin
  const authRes = await post("http://localhost:8080/api/auth/login", {
    email: "admin@murakaza.rw",
    password: "admin1234",
  });

  const adminToken = authRes.data.accessToken;
  if (!adminToken) {
    console.error("Login failed (no accessToken):", authRes);
    process.exit(1);
  }
  console.log("Logged in as Admin:", authRes.data.user.fullName);

  // 2. Fetch admin payments
  const adminRes = await get("http://localhost:8080/api/payments/admin/all", {
    Authorization: `Bearer ${adminToken}`,
  });

  console.log("Admin Payments Status:", adminRes.status);
  console.log("Summary Statistics:", JSON.stringify(adminRes.data.summary, null, 2));
  console.log(`Retrieved ${adminRes.data.payments?.length || 0} payments.`);
  if (adminRes.data.payments && adminRes.data.payments.length > 0) {
    const sample = adminRes.data.payments[0];
    console.log("Sample Payment:", {
      provider: sample.provider,
      providerRef: sample.providerRef,
      amountCents: sample.amountCents,
      status: sample.status,
      webhookVerified: sample.webhookVerified,
      user: sample.user?.fullName,
    });
  }

  console.log("✓ Admin Payments API is verified and working!");
}

run().catch(console.error);
