import React from "react";

export default function ChangePassword() {
    return (
        <main>
            <div className="container-login">
                <div className="left-container img-change">

                </div>
                <div className="right-container">
                    <h2>Esqueceu sua senha?</h2>
                    <form method="post">
                        <input type="email" name="email" id="email" placeholder="Email"/>
                        <button type="submit">Recuperar senha</button>
                    </form>
                    <i><a href="/login">Cancelar</a></i>
                </div>
            </div>
        </main>
    )
}