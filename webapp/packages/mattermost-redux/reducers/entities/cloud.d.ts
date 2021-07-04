import { Product, Invoice } from "../../types/cloud";
import { Dictionary } from "../../types/utilities";
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    customer: any;
    subscription: any;
    products: Dictionary<Product> | null;
    invoices: Dictionary<Invoice> | null;
    subscriptionStats: any;
}>, import("redux").AnyAction>;
export default _default;
