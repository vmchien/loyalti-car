import React, { useState } from "react";
import { Page, Box, Text, Radio, Button } from "zmp-ui";
import QRCode from "react-qr-code";

const orderTypes = [
  { value: "a-b", label: "Cuốc xe từ điểm A đến điểm B", price: 50000 },
  { value: "tour-basic", label: "Cuốc tham quan cơ bản", price: 150000 },
  { value: "tour-full", label: "Cuốc tham quan full", price: 200000 },
];

const CreateOrder: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [orderCode, setOrderCode] = useState<string>("");

  const handleSubmit = () => {
    if (!selectedType) {
      alert("Vui lòng chọn loại cuốc xe!");
      return;
    }
    // Mock tạo đơn: trả về chuỗi code
    const code = `ORDER-${selectedType.toUpperCase()}-${Math.floor(Math.random()*1000000)}`;
    setOrderCode(code);
  };

  return (
    <Page className="flex flex-col items-center justify-center min-h-screen bg-gray-50 relative">
      {/* Điểm khách hàng góc trên bên phải */}
      <Box className="absolute top-4 right-4 bg-yellow-100 px-4 py-2 rounded-full shadow flex items-center space-x-2">
        <Text className="font-bold text-yellow-700">Điểm: 10,000</Text>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFD700"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">★</text></svg>
      </Box>
  <Box className="w-full max-w-md p-6 bg-white rounded-lg shadow-md relative">
        <Text.Title size="large" className="mb-4 text-center text-blue-600">
          Tạo đơn hàng
        </Text.Title>
        <Box className="mb-6">
          <Text className="mb-2 font-medium">Chọn loại cuốc xe:</Text>
          <Box className="space-y-3">
            {orderTypes.map(order => (
              <Radio
                key={order.value}
                value={order.value}
                checked={selectedType === order.value}
                onChange={() => setSelectedType(order.value)}
                className="w-full"
              >
                <Box className="flex justify-between items-center w-full">
                  <Text>{order.label}</Text>
                  <Text className="font-bold text-blue-600">{order.price.toLocaleString()} VNĐ</Text>
                </Box>
              </Radio>
            ))}
          </Box>
        </Box>
        <Button
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
        >
          Tạo đơn
        </Button>

        {/* Hiển thị QR code nếu có mã đơn */}
        {orderCode && (
          <Box className="mt-8 flex flex-col items-center">
            <Text className="mb-2 font-medium text-green-700">Mã đơn: {orderCode}</Text>
            <QRCode value={orderCode} size={180} />
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default CreateOrder;
