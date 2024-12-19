import React from "react";
import './footer.css';
import ImgLogo from './../../media/global/logo-black.png'

export default function Footer() {
    return (
       <footer>
            <div className="logo-footer">
                <img src={ImgLogo}/>
            </div>
            <div className="social-footer">
                <i className="bi bi-instagram"></i>
                <i className="bi bi-youtube"></i>
                <i className="bi bi-pinterest"></i>
            </div>
            <div className="copy-footer">
                <p>©2023 por Beatriz Helbri. Todos os direitos reservados</p>
            </div>
        </footer>
    )
}