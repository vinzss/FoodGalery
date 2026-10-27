// Client HTTP tipis untuk backend Express (/api diproxy oleh Vite ke :4000).
import {
  AuthUser,
  CommunitySubmission,
  PasswordResetRequest,
  Restaurant,
  UserReview,
  UserRole,
} from '../types';
import type { UmkmFormPayload } from '../admin/UmkmManager';

export class ApiError extends Error {
  status: number;
  code: string;
  details: Record<string, unknown>;

  constructor(status: number, code: string, details: Record<string, unknown> = {}) {
    super(code);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: options.method || 'GET',
      credentials: 'include',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR');
  }

  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    // respons tanpa body JSON (mis. proxy gagal karena server API mati)
  }

  if (!res.ok) {
    const code =
      typeof data.error === 'string'
        ? data.error
        : res.status >= 500
          ? 'SERVER_ERROR'
          : 'UNKNOWN_ERROR';
    throw new ApiError(res.status, code, data);
  }
  return data as T;
}

export const authApi = {
  me: () => request<{ user: AuthUser }>('/auth/me'),
  login: (identifier: string, password: string) =>
    request<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: { identifier, password },
    }),
  signup: (payload: {
    username: string;
    email: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
  }) =>
    request<{
      requiresVerification: boolean;
      email: string;
      username: string;
      devOtp?: string;
    }>('/auth/signup', { method: 'POST', body: payload }),
  verifyOtp: (email: string, otp: string) =>
    request<{ user: AuthUser }>('/auth/verify-otp', {
      method: 'POST',
      body: { email, otp },
    }),
  resendOtp: (email: string) =>
    request<{ ok?: boolean; email?: string; devOtp?: string; alreadyVerified?: boolean }>(
      '/auth/resend-otp',
      {
        method: 'POST',
        body: { email },
      }
    ),
  logout: () => request<{ ok: true }>('/auth/logout', { method: 'POST' }),

  forgotQuestion: (identifier: string) =>
    request<{ hasSecurityQuestion: boolean; securityQuestion: string | null }>(
      '/auth/forgot/question',
      { method: 'POST', body: { identifier } }
    ),
  forgotVerify: (identifier: string, answer: string, newPassword: string) =>
    request<{ ok: true }>('/auth/forgot/verify', {
      method: 'POST',
      body: { identifier, answer, newPassword },
    }),
  forgotRequestAdmin: (identifier: string, note: string) =>
    request<{ ok: true }>('/auth/forgot/request-admin', {
      method: 'POST',
      body: { identifier, note },
    }),
};

export const adminApi = {
  listUsers: () => request<{ users: AuthUser[] }>('/admin/users'),
  setRole: (id: number, role: UserRole) =>
    request<{ ok: true }>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: { role },
    }),
  setBanned: (id: number, banned: boolean) =>
    request<{ ok: true }>(`/admin/users/${id}/ban`, {
      method: 'PATCH',
      body: { banned },
    }),
  setVerified: (id: number, verified: boolean) =>
    request<{ ok: true }>(`/admin/users/${id}/verify`, {
      method: 'PATCH',
      body: { verified },
    }),
  resetPassword: (id: number, newPassword: string) =>
    request<{ ok: true }>(`/admin/users/${id}/reset-password`, {
      method: 'POST',
      body: { newPassword },
    }),
  deleteUser: (id: number) =>
    request<{ ok: true }>(`/admin/users/${id}`, { method: 'DELETE' }),
  listResetRequests: () =>
    request<{ requests: PasswordResetRequest[] }>('/admin/reset-requests'),
  setResetRequestStatus: (id: number, status: 'resolved' | 'rejected') =>
    request<{ ok: true }>(`/admin/reset-requests/${id}`, {
      method: 'PATCH',
      body: { status },
    }),
};

export const contentApi = {
  bootstrap: () =>
    request<{
      restaurants: Restaurant[];
      reviews: UserReview[];
      submissions: CommunitySubmission[];
      savedIds: string[];
    }>('/content/bootstrap'),
  migrateLocal: (payload: {
    restaurants?: Restaurant[];
    reviews?: UserReview[];
    submissions?: CommunitySubmission[];
  }) =>
    request<{
      restaurants: Restaurant[];
      reviews: UserReview[];
      submissions: CommunitySubmission[];
    }>('/content/migrate-local', { method: 'POST', body: payload }),
  addSubmission: (
    payload: Omit<CommunitySubmission, 'id' | 'submittedAt'>
  ) =>
    request<{ submission: CommunitySubmission }>('/content/submissions', {
      method: 'POST',
      body: payload,
    }),
  addReview: (payload: Omit<UserReview, 'id' | 'createdAt'>) =>
    request<{ review: UserReview }>('/content/reviews', {
      method: 'POST',
      body: payload,
    }),
  toggleFavorite: (restaurantId: string) =>
    request<{ savedIds: string[] }>(
      `/content/favorites/${encodeURIComponent(restaurantId)}/toggle`,
      { method: 'POST' }
    ),
  removeFavorite: (restaurantId: string) =>
    request<{ savedIds: string[] }>(
      `/content/favorites/${encodeURIComponent(restaurantId)}`,
      { method: 'DELETE' }
    ),
  saveRestaurant: (payload: UmkmFormPayload) =>
    request<{ restaurant: Restaurant }>('/content/restaurants', {
      method: 'POST',
      body: payload,
    }),
  deleteRestaurant: (id: string) =>
    request<{ ok: true }>(`/content/restaurants/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  approveSubmission: (id: string) =>
    request<{ restaurant: Restaurant }>(
      `/content/submissions/${encodeURIComponent(id)}/approve`,
      { method: 'POST' }
    ),
  rejectSubmission: (id: string) =>
    request<{ ok: true }>(
      `/content/submissions/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    ),
  deleteReview: (id: string) =>
    request<{ ok: true }>(`/content/reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};
