import { Dictionary } from './utilities';
export declare type CloudState = {
    subscription?: Subscription;
    products?: Dictionary<Product>;
    customer?: CloudCustomer;
    invoices?: Dictionary<Invoice>;
    subscriptionStats?: SubscriptionStats;
};
export declare type Subscription = {
    id: string;
    customer_id: string;
    product_id: string;
    add_ons: string[];
    start_at: number;
    end_at: number;
    create_at: number;
    seats: number;
    is_paid_tier: string;
    last_invoice?: Invoice;
};
export declare type Product = {
    id: string;
    name: string;
    description: string;
    price_per_seat: number;
    add_ons: AddOn[];
};
export declare type AddOn = {
    id: string;
    name: string;
    display_name: string;
    price_per_seat: number;
};
export declare type CloudCustomer = {
    id: string;
    creator_id: string;
    create_at: number;
    email: string;
    name: string;
    num_employees: number;
    contact_first_name: string;
    contact_last_name: string;
    billing_address: Address;
    company_address: Address;
    payment_method: PaymentMethod;
};
export declare type CloudCustomerPatch = {
    email?: string;
    name?: string;
    num_employees?: number;
    contact_first_name?: string;
    contact_last_name?: string;
};
export declare type Address = {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
};
export declare type PaymentMethod = {
    type: string;
    last_four: number;
    exp_month: number;
    exp_year: number;
    card_brand: string;
    name: string;
};
export declare type Invoice = {
    id: string;
    number: string;
    create_at: number;
    total: number;
    tax: number;
    status: string;
    description: string;
    period_start: number;
    period_end: number;
    subscription_id: string;
    line_items: InvoiceLineItem[];
};
export declare type InvoiceLineItem = {
    price_id: string;
    total: number;
    quantity: number;
    price_per_unit: number;
    description: string;
    type: string;
    metadata: Dictionary<string>;
};
export declare type SubscriptionStats = {
    remaining_seats: number;
    is_paid_tier: string;
};
