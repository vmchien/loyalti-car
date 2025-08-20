import React, { useState } from "react";
import { Box, Button, Input, Page, Text } from "zmp-ui";
import { API_BASE_URL } from "@/config";
import { authFetch } from "@/services/auth-service";

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu mới không khớp");
      return;
    }
    try {
      const response = await authFetch(`${API_BASE_URL}/auth/v1/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmNewPassword,
        }),
      });
      if (!response.ok) {
        throw new Error("Đổi mật khẩu thất bại");
      }
      setSuccess("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setconfirmNewPassword("");
    } catch (err) {
      setError("Đổi mật khẩu thất bại");
    }
  };

  return (
    <Page className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Box className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <Text.Title size="large" className="mb-4 text-center text-blue-600">
          Đổi mật khẩu
        </Text.Title>
        <Box className="mb-3">
          <Input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className="w-full"
          />
        </Box>
        <Box className="mb-3">
          <Input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full"
          />
        </Box>
        <Box className="mb-3">
          <Input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmNewPassword}
            onChange={e => setconfirmNewPassword(e.target.value)}
            className="w-full"
          />
        </Box>
        {error && (
          <Text className="text-red-500 mb-2 text-center">{error}</Text>
        )}
        {success && (
          <Text className="text-green-500 mb-2 text-center">{success}</Text>
        )}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
        >
          Đổi mật khẩu
        </Button>
      </Box>
    </Page>
  );
};

export default ChangePassword;
