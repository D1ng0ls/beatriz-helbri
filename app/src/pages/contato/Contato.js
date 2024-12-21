import React from "react";

export default function Contato() {
    return (
        <main>
            <div className="container-contato">
                <div className="contato">
                    <div className="social-contato">
                        <h2>Siga-me nas redes sociais</h2>
                        <div className="sociais-follow-contato">
                            <i className="bi bi-instagram"></i>
                            <i className="bi bi-youtube"></i>
                            <i className="bi bi-pinterest"></i>
                        </div>
                    </div>
                    <div className="forms-contato">
                        <h2>Envie sua mensagem</h2>
                        <form method="post">
                            <input type="text" name='nome' id="nome" placeholder="Seu nome"/>
                            <input type="email" name='email' id="email" placeholder="Seu melhor e-mail"/>
<textarea name="mensagem" id="mensagem" placeholder="Sua mensagem"></textarea>
                            <button type="submit" name="enviar">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}