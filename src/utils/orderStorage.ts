import { CustomerOrder, CartItem } from '../types.ts';

const STORAGE_KEY = 'arctiq_private_customer_orders';

/**
 * Calculates estimated delivery date 3-5 business days from order placement.
 */
export function calculateEstimatedDelivery(fromDate: Date = new Date()): {
  estimatedDateStr: string;
  daysStr: string;
} {
  const target = new Date(fromDate);
  let businessDaysAdded = 0;

  // Add 4 business days (skipping Saturday & Sunday)
  while (businessDaysAdded < 4) {
    target.setDate(target.getDate() + 1);
    const dayOfWeek = target.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysAdded++;
    }
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return {
    estimatedDateStr: target.toLocaleDateString('en-GB', options),
    daysStr: '3–5 Business Days (Express Priority)',
  };
}

/**
 * Retrieves all orders saved privately on this user's computer.
 */
export function getStoredOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Saves a new order privately into the user's browser localStorage.
 */
export function saveOrderToStorage(newOrder: CustomerOrder): void {
  try {
    const existing = getStoredOrders();
    // Prepend new order, avoid duplicates
    const filtered = existing.filter((o) => o.orderRef !== newOrder.orderRef);
    const updated = [newOrder, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save order to local storage', err);
  }
}

/**
 * Clears local order history from this computer.
 */
export function clearStoredOrders(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Helper to construct a CustomerOrder from checkout state.
 */
export function createCustomerOrderRecord(params: {
  orderRef: string;
  name: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  paymentMethod: string;
  items: CartItem[];
  totalPrice: string;
}): CustomerOrder {
  const now = new Date();
  const { estimatedDateStr, daysStr } = calculateEstimatedDelivery(now);
  const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);

  return {
    orderRef: params.orderRef,
    createdAt: now.toISOString(),
    estimatedDeliveryDate: estimatedDateStr,
    deliveryDaysEstimate: daysStr,
    status: 'Preparing at Gothenburg Terminal',
    customerName: params.name,
    email: params.email,
    address: params.address,
    city: params.city,
    postal: params.postal,
    country: params.country,
    paymentMethod: params.paymentMethod,
    items: params.items.map((i) => ({
      id: i.id,
      name: i.name,
      colourway: i.colourway,
      size: i.size,
      price: i.price,
      numericPrice: i.numericPrice,
      image: i.image,
      quantity: i.quantity,
    })),
    totalPrice: params.totalPrice,
    trackingCarrier: 'PostNord / DHL Express Nordic Air',
    trackingCode: `SE-${randomSuffix}`,
  };
}
