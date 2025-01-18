import React, { useState } from "react";
import { useNavigate} from "react-router-dom";

export default function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [user, setUser] = useState(false);
    const [confirmSenha, setConfirmSenha] = useState("");
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    const handleAddUser = (e) => {
        e.preventDefault();

        if (!nome.trim()) return setErro("Nome é obrigatório.");
        if (!/\S+@\S+\.\S+/.test(email)) return setErro("Email inválido.");
        if (senha.length < 8) return setErro("A senha deve ter no mínimo 8 caracteres.");
        if (senha !== confirmSenha) return setErro("As senhas não coincidem.");

        0

        if(!user) {
            fetch("http://localhost:5000/api/v0.0.1/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    tipo: 1,
                }),
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Falha ao adicionar usuário.");
                    return response.json();
                })
                .then((data) => {
                    setNome("");
                    setEmail("");
                    setSenha("");
                    setConfirmSenha("");
                    setErro("");
                    navigate('/user');
                })
                .catch((error) => setErro(error.message));
        }
    }

    return (
        <main>
            <div className="container-login">
                <div className="left-container img-register"></div>
                <div className="right-container">
                    <h2>Bem-vindo a bordo</h2>
                    <form onSubmit={handleAddUser}>
                        <input
                            type="text"
                            name="nome"
                            id="nome"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirme sua senha"
                            value={confirmSenha}
                            onChange={(e) => setConfirmSenha(e.target.value)}
                        />
                        {erro && <p style={{ color: "red" }}>{erro}</p>}
                        <button type="submit">Cadastrar</button>
                    </form>
                    <i>
                        Já possui cadastro? Faça <a href="/login">login</a>
                    </i>
                </div>
            </div>
        </main>
    );
}
