import { API_BASE_URL } from "@/config";

// Giả sử token là JWT, kiểm tra hết hạn bằng cách decode phần payload
export function checkTokenExpired(token?: string | null): boolean {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // exp là số giây từ epoch
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

export async function refreshTokenIfNeeded(token: string | null, refreshToken: string | null): Promise<string | null> {
    if (!token || checkTokenExpired(token)) {
        if (refreshToken) {
            const response = await fetch(`${API_BASE_URL}/auth/v1/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });
            const data = await response.json();
            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                return data.accessToken;
            }
            return null;
        }
        return null;
    }
    return token;
}

// Hàm fetch tự động check & refresh token
export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    let token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    token = await refreshTokenIfNeeded(token, refreshToken);
    const headers = {
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(input, { ...init, headers });
}
