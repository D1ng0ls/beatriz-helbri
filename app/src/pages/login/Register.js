import React from "react";

export default function Register() {
    return (
        <main>
            <div className="container-login">
                <div className="left-container img-register">

                </div>
                <div className="right-container">
                    <h2>Bem-vindo a bordo</h2>
                    <form method="post">
                        <input type="text" name="nome" id="nome" placeholder="Nome"/>
                        <input type="email" name="email" id="email" placeholder="Email"/>
                        <input type="password" name="password" id="password" placeholder="Senha"/>
                        <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirme sua senha"/>
                        <button type="submit">Cadastrar</button>
                    </form>
                    <i>Já possui cadastro? Faça <a href="/login">login</a></i>
                </div>
            </div>
        </main>
    )
}