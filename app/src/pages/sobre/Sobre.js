import React, {useState, useEffect} from "react";

export default function Sobre() {
    const [usuario, setUsuario] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/user/id/1`).then((response) => {
            if (!response.ok) throw new Error("Usuário não encontrado.");
            return response.json();
        }).then((data) => setUsuario(data)).catch((error) => setErro(error.message));
    }, []);

    if (erro) return <p>{erro}</p>;
    if (!usuario) return <p>Carregando...</p>;

    return (
        <main>
            <div className="container-sobre">
                <div className="sobre">
                    <div className="img-sobre">
                        <img src={'media/upload/users/' + usuario.foto} alt={'Foto de '+usuario.nome}/>
                    </div>
                    <div className="text-sobre">
                        <h2>Quem sou eu?</h2>
                        <p>{usuario.bio}</p>
                    </div>
                </div>
            </div>
        </main>
    )
}