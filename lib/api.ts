import { PaginatedProperties, Property, PropertyInput } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://139.59.232.15";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message ?? `Yêu cầu thất bại (${res.status})`;
    throw new Error(message);
  }

  return body.data as T;
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export async function login(email: string, password: string): Promise<string> {
  const data = await request<{ access_token: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return data.access_token;
}

export async function fetchProperties(): Promise<Property[]> {
  const data = await request<PaginatedProperties>("/properties?page=1&limit=100");
  return data.data;
}

export async function fetchProperty(id: string): Promise<Property | null> {
  return request<Property | null>(`/properties/${id}`);
}

export async function createProperty(token: string, input: PropertyInput): Promise<Property> {
  return request<Property>("/properties", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(input),
  });
}

export async function updateProperty(
  token: string,
  id: string,
  input: Partial<PropertyInput>
): Promise<Property> {
  return request<Property>(`/properties/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(input),
  });
}

export async function deleteProperty(token: string, id: string): Promise<void> {
  await request<Property>(`/properties/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const data = await request<{ url: string }>("/uploads", {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });
  return data.url;
}
