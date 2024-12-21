import React from "react";

export default function Login() {
    return (
        <main>
            <div className="container-login">
                <div className="left-container img-login">

                </div>
                <div className="right-container">
                    <h2>Que bom te ver novamente!</h2>
                    <form method="post">
                        <input type="email" name="email" id="email" placeholder="Email"/>
                        <input type="password" name="password" id="password" placeholder="Senha"/>
                        <a href="/changepassword" id="change">Esqueci minha senha</a>
                        <button type="submit">Entrar</button>
                    </form>
                    <i>Novo por aqui? <a href="/register">Cadastre-se</a></i>
                </div>
            </div>
        </main>
    )
}