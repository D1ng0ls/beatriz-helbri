import React from "react";
import ImgHeader1 from "./../../media/global/logo-white.png"
import ImgHeader2 from "./../../media/global/logo-black.png"
import './header.css'

export default function Header() {
    return (
        <header>
            <div className="logo-header">
                <img src={ImgHeader1}></img>
            </div>
            <nav className="menu-header">
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/posts">Posts</a>
                    </li>
                    <li>
                        <a href="/sobre">Sobre</a>
                    </li>
                    <li>
                        <a href="/social">Redes</a>
                    </li>
                </ul>
            </nav>
            <div className="user-header">
            <a href="/user"><i className="bi bi-person-circle"></i></a>
            </div>
        </header>
    )
}