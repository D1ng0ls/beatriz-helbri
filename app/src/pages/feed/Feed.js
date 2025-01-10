import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Buscar from "./Buscar";
import Posts from "./Posts";

export default function Feed() {
    const [filters, setFilters] = useState({
        categories: [],
        time: "recentes",
        searchText: "",
    });

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const categoriesFromUrl = searchParams.get("categoria");
        
        const timeFromUrl = searchParams.get("time") || "recentes";
        const searchTextFromUrl = searchParams.get("searchText") || "";

        setFilters({
            categories: categoriesFromUrl,
            time: timeFromUrl,
            searchText: searchTextFromUrl,
        });
    }, [searchParams]);

    const handleFilterChange = (categories, time, searchText) => {
        setFilters({
            categories,
            time,
            searchText,
        });
    };

    return (
        <main>
            <Buscar onFilterChange={handleFilterChange} />
            <Posts
                selectedCategories={filters.categories}
                selectedTime={filters.time}
                searchText={filters.searchText}
            />
        </main>
    );
}