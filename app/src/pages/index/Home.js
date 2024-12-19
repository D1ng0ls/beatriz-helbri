import React from "react";
import "jquery";
import 'jquery-parallax.js'

export default function Home() {
    return(
        <div className="container-home parallax-window" data-parallax="scroll" data-image-src="https://images6.alphacoders.com/136/thumb-1920-1367529.png">
            <h1>Minha vida. Meu blog</h1>
            <p>POR BEATRIZ HELBRI</p>
            <a href="/login">
                <button>
                    ENTRAR
                </button>
            </a>
        </div>
    )
}