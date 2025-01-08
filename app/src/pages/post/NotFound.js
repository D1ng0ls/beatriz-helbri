import React from "react";

import ImgNotFound from './../../media/pages/notfound/notfound-img.jpg'

export default function NotFound() {
    return(
        <div className="container-notfound">
            <h1>404</h1>
            <img src={ImgNotFound} alt="Bicho preguiça da página de não encontrado"/>
            <p>Nada por aqui, só um bicho preguiça perdido!</p>
            <a href="/">Voltar</a>
        </div>
    )
}