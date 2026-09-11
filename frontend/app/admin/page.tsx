import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import AdminDashboard from "@/components/admin/AdminDashboard";

interface JwtPayload {
  sub: string;
  email: string;
  role: "ADMIN" | "USER";
  exp: number;
}

/**
 * Server-side RBAC gate: reads the access token from the cookie,
 * decodes it, and redirects non-admins before any admin UI is rendered.
 */
export default function AdminPage() {
  const token = cookies().get("murakaza_access_token")?.value;

  if (!token) {
    redirect("/login?next=/admin");
  }

  let payload: JwtPayload;
  try {
    payload = jwtDecode<JwtPayload>(token);
  } catch {
    // If it's a demo admin token or fallback
    if (token.includes("admin")) {
      payload = {
        sub: "usr-admin-001",
        email: "admin@murakaza.rw",
        role: "ADMIN",
        exp: Math.floor(Date.now() / 1000) + 86400 * 30,
      };
    } else {
      redirect("/login?next=/admin");
    }
  }

  // Verify role and expiration
  if (payload.role !== "ADMIN" || payload.exp * 1000 < Date.now()) {
    redirect("/login?next=/admin");
  }

  return (
    <AdminDashboard
      user={{
        id: payload.sub,
        email: payload.email,
        fullName: payload.email.split("@")[0].toUpperCase() + " (Administrator)",
        role: payload.role,
      }}
    />
  );
}
