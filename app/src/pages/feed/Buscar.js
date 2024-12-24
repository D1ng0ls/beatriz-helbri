import React, { useState, useEffect } from "react";

export default function Buscar({ onFilterChange }) {
    const [buscarFixed, setBuscarFixed] = useState(false);
    const [filterAppears, setFilterAppears] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTime, setSelectedTime] = useState("recentes");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setBuscarFixed(window.scrollY > 103);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleFilter = () => {
        setFilterAppears(!filterAppears);
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategories((prev) => {
            if (prev.includes(category)) {
                return prev.filter((item) => item !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.id);
    };

    const applyFilter = () => {
    onFilterChange(selectedCategories, selectedTime);  // Passa os filtros para o componente de posts
    }

    // Atualiza o texto de busca
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        onFilterChange(selectedCategories, selectedTime, e.target.value); // Passa o texto de busca
    };

    return (
        <div className={`container-buscar ${buscarFixed ? "fixed" : ""}`}>
            <div className="buscar">
                <div className="search-buscar">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        name="Search"
                        maxLength={40}
                        placeholder="Buscar"
                        value={searchText}
                        onChange={handleSearchChange} // Atualiza o texto em tempo real
                    />
                </div>
                <div className="filter-buscar">
                    <i
                        className={`bi bi-${filterAppears ? "x-lg" : "filter"}`}
                        onClick={toggleFilter}
                    ></i>
                </div>
            </div>
            <div className={`container-filter ${filterAppears ? "appears" : ""}`}>
                <div className="filter">
                    <div className="tema-filter type-filter">
                        <span>Categorias:</span>
                        <div className="inputs-filter">
                            {["viagens", "arte", "cultura", "diadia", "opiniao", "saude"].map((category) => (
                                <div className="cat" key={category}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={category}
                                            onChange={handleCategoryChange}
                                        />
                                        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="time-filter type-filter">
                        <span>Ordenar:</span>
                        <div className="inputs-filter">
                            <div className="cat">
                                <label>
                                    <input
                                        type="radio"
                                        name="tempo"
                                        id="recentes"
                                        checked={selectedTime === "recentes"}
                                        onChange={handleTimeChange}
                                    />
                                    <span>Mais recentes</span>
                                </label>
                            </div>
                            <div className="cat">
                                <label>
                                    <input
                                        type="radio"
                                        name="tempo"
                                        id="antigas"
                                        checked={selectedTime === "antigas"}
                                        onChange={handleTimeChange}
                                    />
                                    <span>Mais antigas</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <button onClick={applyFilter}>Filtrar</button>
                </div>
            </div>
        </div>
    );
}
