import React, { useState, useEffect } from "react";

export default function Buscar() {
    const [buscarFixed, setBuscarFixed] = useState(false);
    const [filterAppears, setFilterAppears] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setBuscarFixed(window.scrollY > 103);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const togglefilter = () => {
        setFilterAppears(!filterAppears);
    };

    return(
        <div className={`container-buscar ${buscarFixed ? 'fixed' : ''}`}>
            <div className="buscar">
                <div className="search-buscar">
                    <i className="bi bi-search"></i>
                    <input type="text" name="Search" maxLength={40} placeholder="Buscar"></input>
                </div>
                <div className="filter-buscar">
                    <i className={`bi bi-${filterAppears ? 'x-lg' : 'filter'}`} onClick={togglefilter}></i>
                </div>
            </div>
            <div className={`container-filter ${filterAppears ? 'appears' : ''}`}>
                <div className="filter">
                    <div className="tema-filter type-filter">
                        <span>Tema:</span>
                        <div className="inputs-filter">
                            <div className="cat">
                                <label>
                                    <input type="checkbox" name="viagens" id="viagens" value='viagens'/>
                                    <span>Viagens</span>
                                </label>
                            </div>
                            <div className="cat">
                                <label>
                                    <input type="checkbox" name="arte" id="arte" value="arte"/>
                                    <span>Arte</span>
                                </label>
                            </div>
                            <div className="cat">
                                <label>
                                    <input type="checkbox" name="cultura" id="cultura" value="cultura"/>
                                    <span>Cultura</span>
                                </label>
                            </div>
                            <div className="cat">
                                <label>
                                    <input type="checkbox" name="diadia" id="diadia" value="diadia"/>
                                    <span>Dia a dia</span>
                                </label>
                            </div>
                            <div className="cat">
                                <label>
                                    <input type="checkbox" name="opiniao" id="opiniao" value="opiniao"/>
                                    <span>Opinião</span>
                                </label>
                            </div>
                            <div className="cat">
                                <label>
                                    <input type="checkbox" name="saude" id="saude" value="saude"/>
                                    <span>Saúde</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="time-filter type-filter">
                        <span>Ordenar:</span>
                        <div className="inputs-filter">
                            <div className="cat">
                                <label>
                                    <input type="radio" name="tempo" id="recentes" checked/>
                                    <span>Mais recentes</span>
                                </label>
                            </div>
                            <div className="cat">
                                <label>
                                    <input type="radio" name="tempo" id="recentes"/>
                                    <span>Mais antigas</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <button>Filtrar</button>
                </div>
            </div>
        </div>
    )
}