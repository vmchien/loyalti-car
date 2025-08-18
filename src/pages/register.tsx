import React, { useState } from "react";
import { Box, Button, Input, Page, Text, Select, DatePicker } from "zmp-ui";

const Register: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: null as Date | null,
  });
  const [error, setError] = useState("");

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate
    if (!form.username || !form.password || !form.fullName || !form.email || !form.phone) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    // TODO: Call API đăng ký
    alert("Đăng ký thành công!");
    setError("");
  };

  return (
    <Page className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Box className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <Text.Title size="large" className="mb-4 text-center text-blue-600">
          Đăng ký tài khoản
        </Text.Title>
        <Box className="mb-3">
          <Input
            placeholder="Tên đăng nhập *"
            value={form.username}
            onChange={e => handleChange("username", e.target.value)}
            className="w-full"
          />
        </Box>
        <Box className="mb-3">
          <Input
            type="password"
            placeholder="Mật khẩu *"
            value={form.password}
            onChange={e => handleChange("password", e.target.value)}
            className="w-full"
          />
        </Box>
        <Box className="mb-3">
          <Input
            placeholder="Họ và tên *"
            value={form.fullName}
            onChange={e => handleChange("fullName", e.target.value)}
            className="w-full"
          />
        </Box>
        <Box className="mb-3">
          <Input
            placeholder="Email *"
            value={form.email}
            onChange={e => handleChange("email", e.target.value)}
            className="w-full"
          />
        </Box>
        <Box className="mb-3">
          <Input
            placeholder="Số điện thoại *"
            value={form.phone}
            onChange={e => handleChange("phone", e.target.value)}
            className="w-full"
          />
        </Box>
        <Box className="mb-3">
          <Input
            placeholder="Địa chỉ"
            value={form.address}
            onChange={e => handleChange("address", e.target.value)}
            className="w-full"
          />
        </Box>
        <Box className="mb-3">
          <Select
            value={form.gender}
            onChange={value => handleChange("gender", String(value || ""))}
            placeholder="Giới tính"
            className="w-full"
          >
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </Box>
        <Box className="mb-3">
          <DatePicker
            value={form.dateOfBirth || undefined}
            onChange={value => handleChange("dateOfBirth", value || null)}
            placeholder="Ngày sinh"
          />
        </Box>
        {error && (
          <Text className="text-red-500 mb-2 text-center">{error}</Text>
        )}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
        >
          Đăng ký
        </Button>
      </Box>
    </Page>
  );
};

export default Register;
