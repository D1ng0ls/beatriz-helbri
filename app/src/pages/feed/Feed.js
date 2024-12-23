import React, { useState } from "react";
import Buscar from "./Buscar";
import Posts from "./Posts";

export default function Feed() {
    const [filters, setFilters] = useState({
        categories: [],
        time: "recentes",
        searchText: "",
    });

    const handleFilterChange = (categories, time, searchText) => {
        setFilters({
            categories,
            time,
            searchText, // Atualiza o texto de pesquisa
        });
    };

    return (
        <main>
            <Buscar onFilterChange={handleFilterChange} />
            <Posts
                selectedCategories={filters.categories}
                selectedTime={filters.time}
                searchText={filters.searchText} // Passa o texto de pesquisa
            />
        </main>
    );
}
