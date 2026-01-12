export interface PriceList {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  discount: number;
  companiesCount: number;
  productsCount: number;
  isActive: boolean;
  createdAt: string;
}

export const mockPriceLists: PriceList[] = [
  {
    id: 'pl-1',
    name: 'Enterprise Tier',
    description: 'Desconto especial para clientes Enterprise',
    type: 'percentage',
    discount: 25,
    companiesCount: 3,
    productsCount: 150,
    isActive: true,
    createdAt: '2025-06-15T10:00:00Z'
  },
  {
    id: 'pl-2',
    name: 'Gold Partner',
    description: 'Preços para parceiros Gold',
    type: 'percentage',
    discount: 15,
    companiesCount: 8,
    productsCount: 150,
    isActive: true,
    createdAt: '2025-08-20T14:30:00Z'
  },
  {
    id: 'pl-3',
    name: 'Atacado Regional Sul',
    description: 'Condições especiais para distribuidores da região Sul',
    type: 'percentage',
    discount: 20,
    companiesCount: 5,
    productsCount: 80,
    isActive: true,
    createdAt: '2025-09-10T09:00:00Z'
  },
  {
    id: 'pl-4',
    name: 'Black Friday 2025',
    description: 'Lista promocional temporária',
    type: 'percentage',
    discount: 35,
    companiesCount: 0,
    productsCount: 50,
    isActive: false,
    createdAt: '2025-11-01T00:00:00Z'
  }
];
