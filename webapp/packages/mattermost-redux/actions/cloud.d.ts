import { ActionFunc } from "../types/actions";
import { Address, CloudCustomerPatch } from "../types/cloud";
export declare function getCloudSubscription(): ActionFunc;
export declare function getCloudProducts(): ActionFunc;
export declare function getSubscriptionStats(): ActionFunc;
export declare function getCloudCustomer(): ActionFunc;
export declare function getInvoices(): ActionFunc;
export declare function updateCloudCustomer(customerPatch: CloudCustomerPatch): ActionFunc;
export declare function updateCloudCustomerAddress(address: Address): ActionFunc;
