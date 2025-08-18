import React, { useState } from "react";
import { Box, Button, Input, Page, Text } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { API_BASE_URL } from "@/config";

const Home: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleLogin = async () => {
        if (!username || !password) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/common/v1/health/detail`, {
                method: "GET",
            })
              if (!response.ok) {
                throw new Error("Đăng nhập thất bại");
            }
            const data = await response.json();
            if (data.success) {
                alert("Đăng nhập thành công!");
                setError("");
                // TODO: Lưu token, chuyển trang, ...
            } else {
                setError(data.message || "Đăng nhập thất bại");
            }

            // const response = await fetch(`${API_BASE_URL}/login`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ username, password }),
            // });
            // if (!response.ok) {
            //     throw new Error("Đăng nhập thất bại");
            // }
            // const data = await response.json();
            // if (data.success) {
            //     alert("Đăng nhập thành công!");
            //     setError("");
            //     // TODO: Lưu token, chuyển trang, ...
            // } else {
            //     setError(data.message || "Đăng nhập thất bại");
            // }
        } catch (err) {
            setError("Không thể kết nối tới server hoặc thông tin không đúng");
        }
    };

    const navigate = useNavigate();
    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <Page className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Box className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <Text.Title size="large" className="mb-4 text-center text-blue-600">
                    Đăng nhập
                </Text.Title>
                <Box className="mb-3">
                    <Input
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full"
                    />
                </Box>
                <Box className="mb-3">
                    <Input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full"
                    />
                </Box>
                {error && (
                    <Text className="text-red-500 mb-2 text-center">{error}</Text>
                )}
                <Button
                    variant="primary"
                    className="w-full mb-3"
                    onClick={handleLogin}
                >
                    Đăng nhập
                </Button>
                <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleRegister}
                >
                    Đăng ký
                </Button>
            </Box>
        </Page>
    );
};

export default Home;
