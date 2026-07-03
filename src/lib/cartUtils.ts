import { Product, CartItem } from '../types';

/**
 * Adds a product to the cart. If the product with the same size already exists,
 * increments its quantity. Otherwise, adds a new item to the cart.
 */
export function addItemToCart(
  cart: CartItem[],
  product: Product,
  size: 'XS' | 'S' | 'M' | 'L' | 'XL',
  color: string,
  itemIdOverride?: string
): CartItem[] {
  const existingIndex = cart.findIndex(
    (item) => item.productId === product.id && item.size === size
  );
  
  if (existingIndex > -1) {
    return cart.map((item, idx) => {
      if (idx === existingIndex) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
  } else {
    const id = itemIdOverride || Math.random().toString();
    return [
      ...cart,
      {
        id,
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.images[0] || '',
        quantity: 1,
        size,
        color,
      },
    ];
  }
}

/**
 * Updates the quantity of a cart item. If the resulting quantity is 0 or less,
 * removes the item from the cart.
 */
export function updateCartQuantity(cart: CartItem[], itemId: string, delta: number): CartItem[] {
  return cart
    .map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);
}
