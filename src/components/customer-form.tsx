import React, { useState, useEffect } from "react";
import { Box, Button, Input, Page, Text, Select, DatePicker, Avatar, Spinner } from "zmp-ui";
import { customerService, CustomerData } from "@/services/customer-service";

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: Date | null;
  gender: string;
  note: string;
}

const CustomerForm: React.FC = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: null,
    gender: "",
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchId, setSearchId] = useState("");
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [showCustomerList, setShowCustomerList] = useState(false);

  // Load danh sách khách hàng
  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
      alert("Lỗi khi tải danh sách khách hàng");
    } finally {
      setIsLoading(false);
    }
  };

  // Tìm kiếm khách hàng theo số điện thoại
  const searchCustomerByPhone = async (phone: string) => {
    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setIsSearching(true);
      const customer = await customerService.getCustomerByPhone(phone);
      
      if (customer) {
        loadCustomerInfo(customer);
        alert("Đã tìm thấy thông tin khách hàng!");
      } else {
        alert("Không tìm thấy khách hàng với số điện thoại này");
      }
    } catch (error) {
      console.error("Error searching customer:", error);
      alert("Lỗi khi tìm kiếm khách hàng");
    } finally {
      setIsSearching(false);
    }
  };

  // Tìm kiếm khách hàng theo ID
  const searchCustomerById = async (id: string) => {
    if (!id.trim()) {
      alert("Vui lòng nhập ID khách hàng");
      return;
    }

    try {
      setIsSearching(true);
      
      // Sử dụng Fetch API để gọi JSONPlaceholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const json = await response.json();
      alert(JSON.stringify(json));

      console.log(json);
      
      // Tiếp tục với tìm kiếm khách hàng từ service
      const customer = await customerService.getCustomerById(id);
      
      if (customer) {
        loadCustomerInfo(customer);
        alert("Đã tìm thấy thông tin khách hàng!");
      } else {
        alert("Không tìm thấy khách hàng với ID này");
      }
    } catch (error) {
      console.error("Error searching customer by ID:", error);
      alert("Lỗi khi tìm kiếm khách hàng");
    } finally {
      setIsSearching(false);
    }
  };

  // Load thông tin khách hàng từ danh sách
  const loadCustomerInfo = (customer: CustomerData) => {
    setCustomerInfo({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth) : null,
      gender: customer.gender,
      note: customer.note,
    });
    setCurrentCustomerId(customer.id);
    setErrors({});
    setShowCustomerList(false);
  };

  // Xóa khách hàng
  const handleDeleteCustomer = async () => {
    if (!currentCustomerId) return;

    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa khách hàng này?");
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const success = await customerService.deleteCustomer(currentCustomerId);
      
      if (success) {
        alert("Xóa khách hàng thành công!");
        handleReset();
        await loadCustomers();
      } else {
        alert("Không thể xóa khách hàng");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Lỗi khi xóa khách hàng");
    } finally {
      setIsLoading(false);
    }
  };

  // Load danh sách khách hàng khi component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const handleInputChange = (field: keyof CustomerInfo, value: string | Date | null) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = "Họ tên là bắt buộc";
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (!customerInfo.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    }

    if (!customerInfo.gender) {
      newErrors.gender = "Giới tính là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const customerData = {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address,
        dateOfBirth: customerInfo.dateOfBirth ? customerInfo.dateOfBirth.toISOString().split('T')[0] : "",
        gender: customerInfo.gender,
        note: customerInfo.note,
      };

      if (currentCustomerId) {
        // Update existing customer
        await customerService.updateCustomer(currentCustomerId, customerData);
        alert("Cập nhật thông tin khách hàng thành công!");
      } else {
        // Create new customer
        await customerService.createCustomer(customerData);
        alert("Tạo mới khách hàng thành công!");
      }

      // Reload customer list
      await loadCustomers();
      
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Lỗi khi lưu thông tin khách hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCustomerInfo({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      dateOfBirth: null,
      gender: "",
      note: "",
    });
    setErrors({});
    setCurrentCustomerId(null);
    setSearchPhone("");
    setSearchId("");
  };

  return (
    <Page className="bg-white">
      <Box className="p-4">
        {/* Header */}
        <Box className="mb-6 text-center">
          <Text.Title size="large" className="text-blue-600 mb-2">
            Thông tin khách hàng
          </Text.Title>
          <Text className="text-gray-600">
            Vui lòng nhập đầy đủ thông tin khách hàng bên dưới
          </Text>
        </Box>

        {/* Search Section */}
        <Box className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Text className="block mb-3 font-medium text-gray-700">
            Tìm kiếm khách hàng
          </Text>
          
          {/* Search by Phone */}
          <Box className="flex space-x-2 mb-3">
            <Input
              placeholder="Nhập số điện thoại để tìm kiếm"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="secondary"
              onClick={() => searchCustomerByPhone(searchPhone)}
              disabled={isSearching}
            >
              {isSearching ? <Spinner /> : "Tìm SĐT"}
            </Button>
          </Box>

          {/* Search by ID */}
          <Box className="flex space-x-2 mb-3">
            <Input
              placeholder="Nhập ID khách hàng để tìm kiếm"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="secondary"
              onClick={() => searchCustomerById(searchId)}
              disabled={isSearching}
            >
              {isSearching ? <Spinner /> : "Tìm ID"}
            </Button>
          </Box>

          <Button
            variant="tertiary"
            onClick={() => setShowCustomerList(!showCustomerList)}
            className="w-full"
          >
            {showCustomerList ? "Ẩn" : "Hiển thị"} danh sách khách hàng
          </Button>
        </Box>

        {/* Customer List */}
        {showCustomerList && (
          <Box className="mb-6 p-4 bg-blue-50 rounded-lg">
            <Text className="block mb-3 font-medium text-gray-700">
              Danh sách khách hàng ({customers.length})
            </Text>
            {isLoading ? (
              <Box className="text-center py-4">
                <Spinner />
                <Text className="mt-2">Đang tải...</Text>
              </Box>
            ) : (
              <Box className="space-y-2 max-h-60 overflow-y-auto">
                {customers.map((customer) => (
                  <Box
                    key={customer.id}
                    className="p-3 bg-white rounded border cursor-pointer hover:bg-gray-50"
                    onClick={() => loadCustomerInfo(customer)}
                  >
                    <Text className="font-medium">{customer.fullName}</Text>
                    <Text className="text-sm text-gray-600">ID: {customer.id}</Text>
                    <Text className="text-sm text-gray-600">{customer.phone}</Text>
                    <Text className="text-sm text-gray-600">{customer.email}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Current Customer Info */}
        {currentCustomerId && (
          <Box className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <Text className="text-green-700 font-medium">
              ✓ Đang chỉnh sửa thông tin khách hàng có ID: {currentCustomerId}
            </Text>
          </Box>
        )}

        {/* Avatar Section */}
        <Box className="flex justify-center mb-6">
          <Avatar
            size={80}
            src=""
            className="border-2 border-blue-200"
          />
        </Box>

        {/* Form Fields */}
        <Box className="space-y-4">
          {/* Họ tên */}
          <Box>
            <Text className="block mb-2 font-medium text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </Text>
            <Input
              placeholder="Nhập họ và tên"
              value={customerInfo.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              status={errors.fullName ? "error" : "normal"}
              className="w-full"
            />
            {errors.fullName && (
              <Text className="text-red-500 text-sm mt-1">{errors.fullName}</Text>
            )}
          </Box>

          {/* Số điện thoại */}
          <Box>
            <Text className="block mb-2 font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </Text>
            <Input
              placeholder="Nhập số điện thoại"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              status={errors.phone ? "error" : "normal"}
              className="w-full"
            />
            {errors.phone && (
              <Text className="text-red-500 text-sm mt-1">{errors.phone}</Text>
            )}
          </Box>

          {/* Email */}
          <Box>
            <Text className="block mb-2 font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </Text>
            <Input
              placeholder="Nhập địa chỉ email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              status={errors.email ? "error" : "normal"}
              className="w-full"
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
            )}
          </Box>

          {/* Địa chỉ */}
          <Box>
            <Text className="block mb-2 font-medium text-gray-700">
              Địa chỉ <span className="text-red-500">*</span>
            </Text>
            <Input
              placeholder="Nhập địa chỉ"
              value={customerInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              status={errors.address ? "error" : "normal"}
              className="w-full"
            />
            {errors.address && (
              <Text className="text-red-500 text-sm mt-1">{errors.address}</Text>
            )}
          </Box>

          {/* Ngày sinh */}
          <Box>
            <Text className="block mb-2 font-medium text-gray-700">
              Ngày sinh <span className="text-red-500">*</span>
            </Text>
            <DatePicker
              value={customerInfo.dateOfBirth || undefined}
              onChange={(value) => handleInputChange("dateOfBirth", value || null)}
              placeholder="Chọn ngày sinh"
            />
            {errors.dateOfBirth && (
              <Text className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</Text>
            )}
          </Box>

          {/* Giới tính */}
          <Box>
            <Text className="block mb-2 font-medium text-gray-700">
              Giới tính <span className="text-red-500">*</span>
            </Text>
            <Select
              value={customerInfo.gender}
              onChange={(value) => handleInputChange("gender", String(value || ""))}
              placeholder="Chọn giới tính"
            >
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
              <Select.Option value="other">Khác</Select.Option>
            </Select>
            {errors.gender && (
              <Text className="text-red-500 text-sm mt-1">{errors.gender}</Text>
            )}
          </Box>

          {/* Ghi chú */}
          <Box>
            <Text className="block mb-2 font-medium text-gray-700">
              Ghi chú
            </Text>
            <Input.TextArea
              placeholder="Nhập ghi chú (không bắt buộc)"
              value={customerInfo.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              rows={3}
              className="w-full"
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="space-y-3 mt-8">
          <Box className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="flex-1"
              disabled={isLoading}
            >
              {currentCustomerId ? "Tạo mới" : "Đặt lại"}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Box className="flex items-center space-x-2">
                  <Spinner />
                  <Text>Đang lưu...</Text>
                </Box>
              ) : (
                currentCustomerId ? "Cập nhật" : "Tạo mới"
              )}
            </Button>
          </Box>
          
          {/* Delete Button - Only show when editing */}
          {currentCustomerId && (
            <Button
              variant="tertiary"
              onClick={handleDeleteCustomer}
              className="w-full"
              disabled={isLoading}
            >
              🗑️ Xóa khách hàng
            </Button>
          )}
        </Box>

        {/* Info Note */}
        <Box className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text className="text-sm text-blue-700">
            <strong>Lưu ý:</strong> Các trường có dấu (*) là bắt buộc. 
            Vui lòng kiểm tra kỹ thông tin trước khi lưu.
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default CustomerForm;
