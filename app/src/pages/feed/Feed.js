import React, { useState } from 'react';
import Buscar from './Buscar';
import Posts from './Posts';

export default function Feed() {
    const [filters, setFilters] = useState({
        categories: [],
        time: "recentes",
    });

    const handleFilterChange = (categories, time) => {
        setFilters({
            categories,
            time,
        });
    };

    return (
        <main>
            <Buscar onFilterChange={handleFilterChange} />
            <Posts selectedCategories={filters.categories} selectedTime={filters.time} />
        </main>
    );
}
