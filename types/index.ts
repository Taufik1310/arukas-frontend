export type Role = "admin" | "petugas";
export type PaymentMethod = "cash" | "transfer" | "midtrans";
export type PaymentStatus = "pending" | "paid" | "failed";
export type PurchaseStatus = "draft" | "ordered" | "received" | "cancelled";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  avatar: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  products_count?: number;
}

export interface Supplier {
  id: number;
  code: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  notes: string | null;
  is_active: boolean;
  products_count?: number;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  category_id: number;
  category: { id: number; name: string } | null;
  suppliers: Array<{
    id: number;
    name: string;
    purchase_price: number | null;
  }>;
  stock: number;
  min_stock: number;
  purchase_price: number;
  sale_price: number;
  unit: string;
  barcode: string | null;
  qr_code: string | null;
  image_urls: string[];
  is_active: boolean;
  is_low_stock: boolean;
  created_at: string;
}

export interface SaleItem {
  id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  discount: number;
  subtotal: number;
}

export interface SaleTransaction {
  id: number;
  code: string;
  user_id: number;
  user?: Pick<User, "id" | "name">;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  paid_amount: number;
  change_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  midtrans_order_id: string | null;
  midtrans_token: string | null;
  items?: SaleItem[];
  notes: string | null;
  created_at: string;
}

export interface PurchaseItem {
  id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface PurchaseTransaction {
  id: number;
  code: string;
  supplier_id: number;
  supplier?: Supplier;
  user?: Pick<User, "id" | "name">;
  total_amount: number;
  status: PurchaseStatus;
  order_date: string;
  received_date: string | null;
  items?: PurchaseItem[];
  notes: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  user?: Pick<User, "id" | "name" | "email">;
  action: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface CartItem {
  product_id: number;
  product: Product;
  quantity: number;
  unit_price: number;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_suppliers: number;
  total_users: number;
  low_stock_count: number;
  today_sales: number;
  today_transactions: number;
  month_sales: number;
  growth_percent: number;
  pending_purchases: number;
}