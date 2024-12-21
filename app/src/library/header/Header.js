import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

import ImgHeader1 from "./../../media/global/logo-white.png"
import ImgHeader2 from "./../../media/global/logo-black.png"
import './header.css'

export default function Header() {
    const [logoHeader, setLogoHeader] = useState(ImgHeader2);
    const [logoState, setLogoState] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (['/'].includes(location.pathname)) {
            setLogoHeader(ImgHeader1);
            setLogoState(true);
        } else {
            setLogoHeader(ImgHeader2);
            setLogoState(false);
        }
    }, [location.pathname]);

    return (
        <header>
            <div className={`logo-header ${!logoState ? 'logo-black' : ''} `}>
                <img src={logoHeader}></img>
            </div>
            <nav className="menu-header">
                <ul>
                    <li id="home">
                        <a href="/">Home</a>
                    </li>
                    <li id="feed">
                        <a href="/feed">Posts</a>
                    </li>
                    <li id="sobre">
                        <a href="/sobre">Sobre</a>
                    </li>
                    <li id="contato">
                        <a href="/contato">Contato</a>
                    </li>
                </ul>
            </nav>
            <div className="user-header">
            <a href="/user"><i className="bi bi-person-circle"></i></a>
            </div>
        </header>
    )
}