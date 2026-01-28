export type PizzaSize = 'personal' | 'mediana' | 'grande' | 'familiar' | 'gigante';

export interface Pizza {
    id: string;
    name: string;
    ingredients: string;
    prices: Record<PizzaSize, number>;
    image: string;
}

export const PIZZAS: Pizza[] = [
    {
        id: 'americana',
        name: 'Americana',
        ingredients: 'Jamón americano + Queso mozzarella',
        prices: { personal: 8, mediana: 15, grande: 26, familiar: 30, gigante: 40 },
        image: '/images/americana.webp'
    },
    {
        id: 'peperoni',
        name: 'Peperoni',
        ingredients: 'Peperoni italiano + Queso mozzarella',
        prices: { personal: 10, mediana: 17, grande: 26, familiar: 31, gigante: 41 },
        image: '/images/peperoni.webp'
    },
    {
        id: 'hawaiana',
        name: 'Hawaiana',
        ingredients: 'Jamón + Piña + Queso mozzarella',
        prices: { personal: 11, mediana: 17, grande: 26, familiar: 31, gigante: 41 },
        image: '/images/hawaina.webp'
    },
    {
        id: 'hawaiana-chicken',
        name: 'Hawaiana Chicken',
        ingredients: 'Jamón + Pollo + Piña + BBQ + Mozzarella',
        prices: { personal: 12, mediana: 20, grande: 28, familiar: 34, gigante: 44 },
        image: '/images/hawaina chicken.webp'
    },
    {
        id: 'hawaiana-tropical',
        name: 'Hawaiana Tropical',
        ingredients: 'Jamón + Piña + Durazno + Mozzarella',
        prices: { personal: 12, mediana: 20, grande: 27, familiar: 32, gigante: 42 },
        image: '/images/hawaina tropical.webp'
    },
    {
        id: 'che-argentina',
        name: 'Che Argentina',
        ingredients: 'Jamón + Peperoni + Carne + Chorizo',
        prices: { personal: 12, mediana: 18, grande: 28, familiar: 32, gigante: 42 },
        image: '/images/che argentina.webp'
    },
    {
        id: 'alemana',
        name: 'Alemana',
        ingredients: 'Jamón + Champiñones + Frankfurter + Tocino + Mozzarella',
        prices: { personal: 12, mediana: 18, grande: 28, familiar: 32, gigante: 42 },
        image: '/images/alemana.webp'
    },
    {
        id: 'la-parrillera',
        name: 'La Parrillera',
        ingredients: 'Salchichón cervecero + Carne + Chimichurri + Mozzarella',
        prices: { personal: 12, mediana: 20, grande: 28, familiar: 32, gigante: 44 },
        image: '/images/parrillera.webp'
    },
    {
        id: 'carnivora',
        name: 'Carnívora',
        ingredients: 'Peperoni + Salami + Chorizo + Tocino + Mozzarella',
        prices: { personal: 12, mediana: 20, grande: 28, familiar: 32, gigante: 44 },
        image: '/images/carnivora.webp'
    },
    {
        id: 'vegetariana',
        name: 'Vegetariana',
        ingredients: 'Champiñones + Cebolla Blanca + Aceitunas + Pimiento caramelizado',
        prices: { personal: 12, mediana: 20, grande: 28, familiar: 32, gigante: 44 },
        image: '/images/vegetariana.webp'
    },
    {
        id: 'espanola',
        name: 'Española',
        ingredients: 'Jamón + Cabanossi + Chorizo + Carne + Mozzarella',
        prices: { personal: 12, mediana: 20, grande: 28, familiar: 34, gigante: 44 },
        image: '/images/espanola.webp'
    },
    {
        id: 'suprema',
        name: 'Suprema',
        ingredients: 'Jamón + Aceitunas + Cebollas + Champiñones + Carne + Mozzarella',
        prices: { personal: 12, mediana: 20, grande: 28, familiar: 34, gigante: 44 },
        image: '/images/suprema.webp'
    },
    {
        id: 'brava',
        name: 'Brava',
        ingredients: 'Salchichón + Cabanossi + Chorizo + Mozzarella',
        prices: { personal: 12, mediana: 18, grande: 28, familiar: 32, gigante: 44 },
        image: '/images/brava.webp'
    },
    {
        id: 'grito-de-lobo',
        name: 'Grito de Lobo',
        ingredients: 'Peperoni + Jamón + Chorizo + Cabanossi',
        prices: { personal: 12, mediana: 20, grande: 28, familiar: 32, gigante: 44 },
        image: '/images/grito de lobo.webp'
    },
    {
        id: 'atun-picante',
        name: 'Atún Picante',
        ingredients: 'Cebolla salteada, atún y ají limo',
        prices: { personal: 13, mediana: 22, grande: 30, familiar: 35, gigante: 45 },
        image: '/images/americana.webp' // Fallback or missing image, but user removed it. I'll keep it for data consistency if user brings it back, or map to americana for now to avoid errors if logic queries it.
    },
    {
        id: '2-estaciones',
        name: '2 Estaciones',
        ingredients: 'Combinación de 2 sabores',
        prices: { personal: 12, mediana: 18, grande: 28, familiar: 32, gigante: 45 },
        image: '/images/hero-pizza.png'
    },
    {
        id: '4-estaciones',
        name: '4 Estaciones',
        ingredients: 'Combinación de 4 sabores',
        prices: { personal: 13, mediana: 19, grande: 28, familiar: 34, gigante: 46 },
        image: '/images/hero-pizza.png'
    }
];

export const OTHER_PRODUCTS = {
    pastas: [
        { name: 'Lasagna de Carne', description: 'Salsa blanca, salsa de carne, queso mozzarella y pasta de lasagna', price: 20, image: '/images/pastas y otros/lasagna_carne.png' },
        { name: 'Spaguetti A lo Alfredo', description: 'Salsa blanca, jamón y queso parmesano', price: 13, image: '/images/pastas y otros/spaguetti_alfredo.png' },
        { name: 'Spaguetti A la Bolognesa', description: 'Salsa bolognesa y queso parmesano', price: 13, image: '/images/pastas y otros/spaguetti_bolognesa.png' },
        { name: 'Spaguetti en Salsa de Champiñones', description: 'Salsa blanca, champiñones y queso parmesano', price: 15, image: '/images/pastas y otros/spaguetti_champibones.png' },
    ],
    entradas: [
        { name: 'Pan al Ajo Simple', price: 4 },
        { name: 'Pan al Ajo con Queso Mozzarella', price: 8 },
        { name: 'Pan al Ajo Especial', price: 10 },
    ],
    salchipapas: [
        { name: 'Salchipapa', description: 'Salchicha ahumada con papas nativas', price: 10, image: '/images/pastas y otros/salchipapa.png' },
        { name: 'Salchipapa a lo Pobre', description: 'Salchicha ahumada + Papas nativas + Huevo + Plátano frito', price: 15, image: '/images/pastas y otros/salchipapa-a-lo-pobre.png' },
        { name: 'Salchialitas', description: 'Salchicha ahumada + Papas nativas + Alitas', price: 22, image: '/images/pastas y otros/salchialitas.png' },
        { name: 'Alitas BBQ', description: 'Alitas BBQ + Papas nativas', price: 18, image: '/images/pastas y otros/alitas-bbq.png' },
        { name: 'Alitas Búfalo', description: 'Alitas Búfalo + Papas nativas', price: 19, image: '/images/pastas y otros/alitas-bufalo.png' },
        { name: 'Alitas Acevichadas', description: 'Alitas Acevichadas + Papas nativas', price: 20, image: '/images/pastas y otros/alitas-acevichadas.png' },
        { name: 'Alitas Maracuyá', description: 'Alitas de Maracuyá + Papas nativas', price: 20, image: '/images/pastas y otros/alitas-maracuya.png' },
    ],
    combos: [
        { name: 'Combo Para Dos', content: '1 Pizza Mediana (Peperoni o Americana) + Limonada o Naranjada + Pan al ajo', price: 26, image: '/images/combos/combo para dos.png' },
        { name: 'Súper Combo Los Glotones', content: '2 Pizzas Medianas (Peperoni, Americana o Hawaiana) + Gaseosa 1L + Pan al ajo', price: 38, image: '/images/combos/Super Combo los Glotones.png' },
        { name: 'Súper Combo Mediana', content: '3 Pizzas Medianas (Peperoni, Americana o Hawaiana) + Gaseosa 1L + Pan al ajo', price: 47.99, image: '/images/combos/Super Combo Mediana.png' },
        { name: 'Combo Familiar', content: '1 Pizza Familiar (Peperoni, Americana o Hawaiana) + Gaseosa 1L + Pan al ajo', price: 38, image: '/images/combos/combo familiar.png' },
        { name: 'Combo Dúo Grande', content: '2 Pizzas Grandes (Peperoni, Americana o Hawaiana) + Gaseosa 1L + Pan al ajo', price: 49.99, image: '/images/combos/Combo Duo Grande.png' },
        { name: 'Combo Extra Familiar', content: '2 Pizzas Familiares (Peperoni o Americana) + Gaseosa 1L + Pan al ajo', price: 62, image: '/images/combos/combo extra familiar.png' },
        { name: 'Combo Pizza Gigante', content: '1 Pizza Gigante (Americana) + Gaseosa 1L + Pan al ajo', price: 46, image: '/images/combos/combo pizza gigante.png' },
        { name: 'Dúo Italiano', content: '1 Pizza Mediana (Peperoni, Americana o Hawaiana) + Lasagna de Carne + Bebida + Pan al ajo', price: 40, image: '/images/combos/duo italiano.png' },
        { name: 'Trío Italiano', content: '1 Lasagna de Carne + 1 Spaghetti Alfredo + 1 Spaghetti a la Boloñesa + Bebida + Pan al ajo', price: 45, image: '/images/combos/trio italiano.png' },
        { name: 'Combo Full Amigos', content: '1 Pizza Grande + 1 Mediana (Peperoni, Americana o Hawaiana) + 1 Lasagna + Bebida + Pan al ajo', price: 65, image: '/images/combos/combo full amigos.png' },
    ],
    drinks: [
        { name: 'Limonada / Maracuyá (1L)', price: 10, category: 'Naturales' },
        { name: 'Limonada / Maracuyá (1/2L)', price: 5, category: 'Naturales' },
        { name: 'Piña / Naranjada (1L)', price: 12, category: 'Naturales' },
        { name: 'Fresa / Hierba Luisa (1L)', price: 12, category: 'Naturales' },
        { name: 'Pepsi 1.5 Lt', price: 8, category: 'Gaseosas' },
        { name: 'Inca Kola / Coca Cola 1.5 Lt', price: 13, category: 'Gaseosas' },
        { name: 'Inca Kola / Coca Cola 1 Lt', price: 8, category: 'Gaseosas' },
    ],
    liquors: [
        { name: 'Casillero del Diablo (Tinto)', price: 60, details: 'Cabernet Sauvignon' },
        { name: 'Frontera (Tinto)', price: 50, details: 'Cabernet Sauvignon' },
        { name: 'Santiago Queirolo', price: 25, details: 'Borgoña o Magdalena' },
        { name: '2x1 Chilcano o Cuba Libre', price: 20, details: 'Promoción Cócteles' },
    ]
};
