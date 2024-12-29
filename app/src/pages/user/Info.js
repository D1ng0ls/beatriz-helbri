import React, {useState, useEffect} from "react";

export default function Info() {
    const [usuario, setUsuario] = useState(null);
    const [erro, setErro] = useState(null);
    const [ativa, setAtiva] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/user/id/1`).then((response) => {
            if (!response.ok) throw new Error("Usuário não encontrado.");
            return response.json();
        }).then((data) => setUsuario(data)).catch((error) => setErro(error.message));
    }, []);


    if (erro) return <p>{erro}</p>;
    if (!usuario) return <p>Carregando...</p>;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        };
        const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);
        return `${formattedDate}`;
    };

    const alteraDisabled = () => {
        setAtiva(true);
    };

    return (
        <div className="container-user-info">
            <div className="img-user" style={{ backgroundImage: usuario.foto ? `url(media/upload/users/${usuario.foto})` : "" }}>
                <i>{!usuario.foto ? "Alterar foto?" : ""}</i>
            </div>
            <div className="text-user">
                <label>Nome</label>
                <input type="text" name="nome" id="nome" defaultValue={usuario.nome} onChange={alteraDisabled}/>
                <label>Email</label>
                <input type="email" name="email" id="email" defaultValue={usuario.email} onChange={alteraDisabled}/>
                <label>Bio</label>
<textarea placeholder="Adicionar biografia" onChange={alteraDisabled}>{usuario.bio}</textarea>
                <i>Membro desde <time dateTime={usuario.data_cadastro}>{formatDate(usuario.data_cadastro)}</time></i>
                <button type="submit" disabled={!ativa}>Salvar</button>
            </div>
        </div>
    )
}