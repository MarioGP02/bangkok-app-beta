import { MENU_CATEGORY } from '@/lib/constants'

/**
 * @typedef {Object} MenuItem
 * @property {number}   id
 * @property {string}   category
 * @property {string}   name
 * @property {string}   description
 * @property {number}   price
 * @property {number}   prepMinutes
 * @property {string}   image
 * @property {boolean}  [popular]
 * @property {boolean}  [vegan]
 * @property {boolean}  [customizable]
 */

/** @type {MenuItem[]} */
export const MENU_ITEMS = [

  // ── NOODLES ──────────────────────────────────────────────────────────────
  {
    id: 1,
    category: MENU_CATEGORY.NOODLES,
    name: 'Finos Pollo',
    description: 'Noodles finos salteados al wok con pollo. Todos los platos llevan verdura. Elige tu nivel de picante.',
    price: 7.50,
    prepMinutes: 8,
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=400&q=80',
    popular: true,
    customizable: true,
  },
  {
    id: 2,
    category: MENU_CATEGORY.NOODLES,
    name: 'Pad Thai Pollo',
    description: 'Tallarines de arroz salteados con pollo, brotes de soja, huevo y salsa de tamarindo.',
    price: 8.00,
    prepMinutes: 9,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=400&q=80',
    popular: true,
    customizable: true,
  },
  {
    id: 3,
    category: MENU_CATEGORY.NOODLES,
    name: 'Anchos Pollo',
    description: 'Noodles anchos salteados al wok con pollo y verduras frescas.',
    price: 8.00,
    prepMinutes: 8,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    customizable: true,
  },
  {
    id: 4,
    category: MENU_CATEGORY.NOODLES,
    name: 'Udon Pollo',
    description: 'Gruesos noodles udon japoneses salteados al wok con pollo.',
    price: 8.00,
    prepMinutes: 9,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=400&q=80',
    customizable: true,
  },
  {
    id: 5,
    category: MENU_CATEGORY.NOODLES,
    name: 'Tallarines Vegetarianos',
    description: 'Noodles salteados al wok con verduras. Agrega proteína por +1.60 €. Opciones veganas y sin gluten.',
    price: 6.00,
    prepMinutes: 7,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
    vegan: true,
    customizable: true,
  },
  {
    id: 6,
    category: MENU_CATEGORY.NOODLES,
    name: 'Wok de Verduras',
    description: 'Verduras salteadas al wok con proteína a elegir: pollo, ternera o langostino.',
    price: 8.00,
    prepMinutes: 8,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=400&q=80',
    customizable: true,
  },

  // ── ARROZ FRITO ───────────────────────────────────────────────────────────
  {
    id: 7,
    category: MENU_CATEGORY.ARROZ,
    name: 'Arroz Pollo',
    description: 'Arroz frito al wok con pollo y verduras. Todos los platos llevan verdura.',
    price: 7.50,
    prepMinutes: 8,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80',
    popular: true,
    customizable: true,
  },
  {
    id: 8,
    category: MENU_CATEGORY.ARROZ,
    name: 'Arroz Ternera',
    description: 'Arroz frito al wok con ternera tierna y verduras frescas.',
    price: 8.00,
    prepMinutes: 9,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=400&q=80',
    customizable: true,
  },
  {
    id: 9,
    category: MENU_CATEGORY.ARROZ,
    name: 'Arroz Langostino',
    description: 'Arroz frito al wok con langostinos jugosos y verduras.',
    price: 8.00,
    prepMinutes: 10,
    image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&w=400&q=80',
    popular: true,
    customizable: true,
  },
  {
    id: 10,
    category: MENU_CATEGORY.ARROZ,
    name: 'Arroz Huevo',
    description: 'Arroz frito al wok con huevo y verduras. Opciones vegetarianas, veganas y sin gluten.',
    price: 6.00,
    prepMinutes: 7,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80',
    vegan: true,
    customizable: true,
  },

  // ── ENSALADAS ─────────────────────────────────────────────────────────────
  {
    id: 11,
    category: MENU_CATEGORY.ENSALADA,
    name: 'Ensalada Bangkok',
    description: 'Salsa Bangkok, mezcla de lechuga, pollo salteado, tomate cherry, baby maíz, cebolla morada, pepino holandés y picatostes.',
    price: 8.00,
    prepMinutes: 5,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    popular: true,
  },
  {
    id: 12,
    category: MENU_CATEGORY.ENSALADA,
    name: 'Ensalada César',
    description: 'Mezcla de lechugas, pollo empanado, tomate cherry, pepino holandés, queso parmesano y salsa césar.',
    price: 8.00,
    prepMinutes: 5,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 13,
    category: MENU_CATEGORY.ENSALADA,
    name: 'La del Joyero',
    description: 'Base de arroz, cebolla crujiente, pollo empanado, salsa kimchi, aguacate y mango.',
    price: 8.00,
    prepMinutes: 6,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80',
    popular: true,
  },

  // ── ENTRANTES ─────────────────────────────────────────────────────────────
  {
    id: 14,
    category: MENU_CATEGORY.ENTRANTE,
    name: 'Rollitos de Primavera (2 u.)',
    description: 'Rollitos crujientes de primavera. Dos unidades.',
    price: 4.00,
    prepMinutes: 6,
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=400&q=80',
    vegan: true,
  },
  {
    id: 15,
    category: MENU_CATEGORY.ENTRANTE,
    name: 'Rollitos de Langostino (2 u.)',
    description: 'Rollitos crujientes rellenos de langostino. Dos unidades.',
    price: 4.50,
    prepMinutes: 7,
    image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&w=400&q=80',
    popular: true,
  },
  {
    id: 16,
    category: MENU_CATEGORY.ENTRANTE,
    name: 'Rollitos de Pollo (2 u.)',
    description: 'Rollitos crujientes de pollo con queso y salsa especial de la casa. Dos unidades.',
    price: 4.50,
    prepMinutes: 7,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 17,
    category: MENU_CATEGORY.ENTRANTE,
    name: 'Gyozas de Pollo (5 u.)',
    description: 'Empanadillas japonesas al vapor y plancha rellenas de pollo. Cinco unidades.',
    price: 4.00,
    prepMinutes: 8,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
    popular: true,
  },
  {
    id: 18,
    category: MENU_CATEGORY.ENTRANTE,
    name: 'Gyozas de Verdura (5 u.)',
    description: 'Empanadillas japonesas al vapor y plancha rellenas de verduras. Cinco unidades.',
    price: 4.00,
    prepMinutes: 8,
    image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&w=400&q=80',
    vegan: true,
  },
  {
    id: 19,
    category: MENU_CATEGORY.ENTRANTE,
    name: 'Fingers de Pollo (4 u.)',
    description: 'Tiras de pollo crujiente con patatas y salsa a elegir. Cuatro unidades.',
    price: 6.00,
    prepMinutes: 9,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80',
    popular: true,
  },
  {
    id: 20,
    category: MENU_CATEGORY.ENTRANTE,
    name: 'Alitas Bangkok (8 u.)',
    description: 'Alitas de pollo crujientes con salsa a elegir. Ocho unidades.',
    price: 6.00,
    prepMinutes: 10,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=400&q=80',
  },

  // ── BEBIDAS ───────────────────────────────────────────────────────────────
  {
    id: 21,
    category: MENU_CATEGORY.BEBIDA,
    name: 'Coca Cola / Zero',
    description: 'Refresco Coca Cola original o Zero Azúcar. 33 cl.',
    price: 1.50,
    prepMinutes: 1,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 22,
    category: MENU_CATEGORY.BEBIDA,
    name: 'Fanta Naranja',
    description: 'Refresco Fanta Naranja. 33 cl.',
    price: 1.50,
    prepMinutes: 1,
    image: 'https://images.unsplash.com/photo-1624552184280-9e0d3e9b8b0f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 23,
    category: MENU_CATEGORY.BEBIDA,
    name: 'Nestea',
    description: 'Té frío Nestea. 33 cl.',
    price: 1.50,
    prepMinutes: 1,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 24,
    category: MENU_CATEGORY.BEBIDA,
    name: 'Cruzcampo',
    description: 'Cerveza Cruzcampo. 33 cl.',
    price: 1.50,
    prepMinutes: 1,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80',
  },

  // ── POSTRES ───────────────────────────────────────────────────────────────
  {
    id: 25,
    category: MENU_CATEGORY.POSTRE,
    name: 'Rollitos de Plátano con Nutella',
    description: 'Rollitos crujientes rellenos de plátano y Nutella. Tu postre favorito.',
    price: 5.00,
    prepMinutes: 5,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80',
    popular: true,
  },
]
