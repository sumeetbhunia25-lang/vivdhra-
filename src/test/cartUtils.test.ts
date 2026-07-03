import { describe, it, expect } from 'vitest';
import { addItemToCart, updateCartQuantity } from '../lib/cartUtils';
import { Product, CartItem } from '../types';

const mockProduct: Product = {
  id: 'p1',
  name: 'Elegant Linen Dress',
  category: 'dresses',
  price: 2450,
  originalPrice: 2450,
  description: 'Pure organic linen crafted with standard care.',
  slogan: 'Linen redefined',
  materials: 'Organic Linen',
  care: 'Gentle hand wash',
  images: ['img1.jpg'],
  sizes: ['S', 'M', 'L'],
  colors: ['Ivory'],
  inStock: true,
  stock: 10,
  fitType: 'regular',
  isTrending: true
};

const mockProduct2: Product = {
  id: 'p2',
  name: 'Summer Knit Top',
  category: 'tops',
  price: 1800,
  originalPrice: 2000,
  description: 'Comfortable cotton summer top.',
  slogan: 'Soft and chic',
  materials: 'GOTS Organic Cotton',
  care: 'Machine wash warm',
  images: ['img2.jpg'],
  sizes: ['M', 'L'],
  colors: ['Beige'],
  inStock: true,
  stock: 5,
  fitType: 'slim',
  isTrending: false
};

describe('addItemToCart', () => {
  it('should add a new item to an empty cart with quantity 1', () => {
    const cart: CartItem[] = [];
    const result = addItemToCart(cart, mockProduct, 'S', 'Ivory', 'test-cart-id-1');
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'test-cart-id-1',
      productId: 'p1',
      productName: 'Elegant Linen Dress',
      price: 2450,
      image: 'img1.jpg',
      quantity: 1,
      size: 'S',
      color: 'Ivory'
    });
  });

  it('should add a second item to the cart when product or size is different', () => {
    const initialCart: CartItem[] = [
      {
        id: 'test-cart-id-1',
        productId: 'p1',
        productName: 'Elegant Linen Dress',
        price: 2450,
        image: 'img1.jpg',
        quantity: 1,
        size: 'S',
        color: 'Ivory'
      }
    ];

    const result = addItemToCart(initialCart, mockProduct, 'M', 'Ivory', 'test-cart-id-2');
    
    expect(result).toHaveLength(2);
    expect(result[1].size).toBe('M');
    expect(result[0].quantity).toBe(1);
    expect(result[1].quantity).toBe(1);
  });

  it('should increment the quantity of an item if it already exists with the same size', () => {
    const initialCart: CartItem[] = [
      {
        id: 'test-cart-id-1',
        productId: 'p1',
        productName: 'Elegant Linen Dress',
        price: 2450,
        image: 'img1.jpg',
        quantity: 1,
        size: 'S',
        color: 'Ivory'
      }
    ];

    const result = addItemToCart(initialCart, mockProduct, 'S', 'Ivory');
    
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(2);
  });
});

describe('updateCartQuantity', () => {
  it('should increment the quantity of a cart item when delta is 1', () => {
    const initialCart: CartItem[] = [
      {
        id: 'test-cart-id-1',
        productId: 'p1',
        productName: 'Elegant Linen Dress',
        price: 2450,
        image: 'img1.jpg',
        quantity: 2,
        size: 'S',
        color: 'Ivory'
      }
    ];

    const result = updateCartQuantity(initialCart, 'test-cart-id-1', 1);
    
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
  });

  it('should decrement the quantity of a cart item when delta is -1', () => {
    const initialCart: CartItem[] = [
      {
        id: 'test-cart-id-1',
        productId: 'p1',
        productName: 'Elegant Linen Dress',
        price: 2450,
        image: 'img1.jpg',
        quantity: 2,
        size: 'S',
        color: 'Ivory'
      }
    ];

    const result = updateCartQuantity(initialCart, 'test-cart-id-1', -1);
    
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(1);
  });

  it('should remove the item from the cart if quantity falls to 0 or less', () => {
    const initialCart: CartItem[] = [
      {
        id: 'test-cart-id-1',
        productId: 'p1',
        productName: 'Elegant Linen Dress',
        price: 2450,
        image: 'img1.jpg',
        quantity: 1,
        size: 'S',
        color: 'Ivory'
      },
      {
        id: 'test-cart-id-2',
        productId: 'p2',
        productName: 'Summer Knit Top',
        price: 1800,
        image: 'img2.jpg',
        quantity: 1,
        size: 'M',
        color: 'Beige'
      }
    ];

    const result = updateCartQuantity(initialCart, 'test-cart-id-1', -1);
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-cart-id-2');
  });
});
