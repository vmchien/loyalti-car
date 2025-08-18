// Mock API service for customer data
export interface CustomerData {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string; // ISO string format
  gender: string;
  note: string;
}

// Mock data for demo
const mockCustomers: CustomerData[] = [
  {
    id: "1",
    fullName: "Nguyễn Văn An",
    phone: "0123456789",
    email: "nguyen.van.an@email.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    dateOfBirth: "1990-01-15",
    gender: "male",
    note: "Khách hàng VIP"
  },
  {
    id: "2",
    fullName: "Trần Tâm",
    phone: "0857869999",
    email: "tran.tam@email.com",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    dateOfBirth: "1985-05-20",
    gender: "female",
    note: "Khách hàng thường xuyên"
  },
  {
    id: "3",
    fullName: "Lê Hoàng Cường",
    phone: "0912345678",
    email: "le.hoang.cuong@email.com",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    dateOfBirth: "1992-12-10",
    gender: "male",
    note: ""
  }
];

export const customerService = {
  // Lấy danh sách khách hàng
  getCustomers: (): Promise<CustomerData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCustomers);
      }, 1000); // Simulate API delay
    });
  },

  // Lấy thông tin khách hàng theo ID
  getCustomerById: async (id: string): Promise<CustomerData | null> => {
    try {
      const response = await fetch(`http://localhost:8000/getCustomerById?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      return null;
    }
  },

  // Lấy thông tin khách hàng theo số điện thoại
  getCustomerByPhone: (phone: string): Promise<CustomerData | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find(c => c.phone === phone);
        resolve(customer || null);
      }, 800);
    });
  },

  // Tạo khách hàng mới
  createCustomer: (customerData: Omit<CustomerData, 'id'>): Promise<CustomerData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer: CustomerData = {
          id: (mockCustomers.length + 1).toString(),
          ...customerData
        };
        mockCustomers.push(newCustomer);
        resolve(newCustomer);
      }, 1000);
    });
  },

  // Cập nhật thông tin khách hàng
  updateCustomer: (id: string, customerData: Partial<CustomerData>): Promise<CustomerData | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCustomers[index] = { ...mockCustomers[index], ...customerData };
          resolve(mockCustomers[index]);
        } else {
          resolve(null);
        }
      }, 1000);
    });
  },

  // Xóa khách hàng
  deleteCustomer: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCustomers.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  }
};
