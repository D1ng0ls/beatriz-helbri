import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Buscar({ onFilterChange }) {
    const [buscarFixed, setBuscarFixed] = useState(false);
    const [filterAppears, setFilterAppears] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTime, setSelectedTime] = useState("recentes");
    const [searchText, setSearchText] = useState("");
    const [categorias ,setCategorias] = useState([])
    const [erro ,setErro] = useState(null)

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const categoriesFromUrl = searchParams.get("categoria")?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

    useEffect(() => {
        const handleScroll = () => {
            setBuscarFixed(window.scrollY > 103);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/v0.0.1/categoria`)
            .then((response) => {
                if (!response.ok) throw new Error("Categorias não encontradas.");
                return response.json();
            })
            .then((data) => setCategorias(data))
            .catch((error) => setErro(error.message));
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
        onFilterChange(selectedCategories, selectedTime);
    }

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        onFilterChange(selectedCategories, selectedTime, searchText);
    };

    if (erro) return <p>{erro}</p>;

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
                        onChange={handleSearchChange}
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
                            {categorias.map((categoria) => (
                                <div className="cat" key={categoria.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={categoria.nome.normalize("NFD")
                                                .replace(/[\u0300-\u036f]/g, "")
                                                .replace(/[^a-zA-Z0-9\s]/g, "")
                                                .replace(/\s+/g, "-")
                                                .toLowerCase()}
                                            onChange={handleCategoryChange}
                                        />
                                        <span>{categoria.nome}</span>
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