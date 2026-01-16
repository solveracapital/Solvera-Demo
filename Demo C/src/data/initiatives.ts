import type { Initiative } from '../types';

export const INITIATIVES: Initiative[] = [
    {
        id: '1',
        name: 'Otomatisasi Supply Chain (ERP)',
        cost: 500000000,
        impact_multiple: 0.25,
        category: 'Engineering'
    },
    {
        id: '2',
        name: 'Integrasi Data Customer 360',
        cost: 200000000,
        impact_multiple: 0.15,
        category: 'Commercial'
    },
    {
        id: '3',
        name: 'AI-Driven Inventory Optimization',
        cost: 750000000,
        impact_multiple: 0.40,
        category: 'Operational'
    },
    {
        id: '4',
        name: 'Cloud Infrastructure Migration',
        cost: 300000000,
        impact_multiple: 0.10,
        category: 'Engineering'
    },
    {
        id: '5',
        name: 'Automated Financial Reporting',
        cost: 150000000,
        impact_multiple: 0.05,
        category: 'Operational'
    }
];
