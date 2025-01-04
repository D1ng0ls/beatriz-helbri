import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Comment() {
    const [comments, setComments] = useState({}); // Garantimos que é um array
    const [users, setUsers] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [erro, setErro] = useState(null);
    const [isCommentsLoaded, setIsCommentsLoaded] = useState(false); // Novo estado

    const { title } = useParams();
    const id = title.match(/^(\d+)-/)?.[1];

    const idUser = 1;

    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/user/id/${idUser}`).then((response) => {
            if (!response.ok) throw new Error("Usuário não encontrado.");
            return response.json();
        }).then((data) => setUsuario(data)).catch((error) => setErro(error.message));
    }, [idUser]);

    // Fetch de comentários
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/post/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error("Comentários não encontrados.");
                return response.json();
            })
            .then((data) => {
                setComments(Array.isArray(data) ? data : []); // Garante que data é um array
                setIsCommentsLoaded(true);
            })
            .catch((error) => {
                setErro(error.message);
                setIsCommentsLoaded(true);
            });
    }, [id]);

    // Fetch de usuários para cada comentário
    useEffect(() => {
        if (comments && comments.length > 0) {
            const fetchUsers = async () => {
                const usersMap = {};
                for (const comment of comments) {
                    if (!usersMap[comment.usuario_id]) {
                        try {
                            const response = await fetch(`http://127.0.0.1:5000/api/v0.0.1/user/id/${comment.usuario_id}`);
                            if (!response.ok) throw new Error("Usuário não encontrado.");
                            const user = await response.json();
                            usersMap[comment.usuario_id] = user;
                        } catch (error) {
                            setErro(error.message);
                        }
                    }
                }
                setUsers((prev) => ({ ...prev, ...usersMap }));
            };

            fetchUsers();
        }
    }, [comments]);

    const getRelativeTime = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);
    
        const timeIntervals = [
            { unit: "ano", seconds: 31536000 },
            { unit: "mês", seconds: 2592000 },
            { unit: "dia", seconds: 86400 },
            { unit: "hora", seconds: 3600 },
            { unit: "minuto", seconds: 60 },
            { unit: "segundo", seconds: 1 },
        ];
    
        for (const interval of timeIntervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
    
            // Se a diferença for maior que 0 para a unidade, mostra o valor
            if (count > 0) {
                const unit = interval.unit;
                const plural = count > 1 ? `${unit}s` : unit;
                return `${count} ${plural} atrás`;
            }
        }
    
        return "Agora mesmo"; // Caso a diferença seja muito pequena
    };
    

    // Renderização condicional
    if (erro) return <p>{erro}</p>;
    if (!isCommentsLoaded || !users || !usuario) return <p>Carregando...</p>;

    return (
        <div className="container-comments" id="top">
            <p>{comments.length ? comments.length + " C" : "Sem c"}omentários{comments.length > 1 ? "s" : ""} </p>
            <div className="comments-add">
                <img src={`../../media/upload/users/${usuario?.foto || "default.png"}`} alt={"Foto de " + usuario.nome}/>
                <label><input type="text" name="comentario" maxLength={120} placeholder={comments.length ? "Deixe seu comentário" : "Seja o primeiro a comentar" } id="comentario"/><button type="send"><i class="bi bi-send"></i></button></label>
            </div>
            <div className="comments-post">
                {comments.map((comment) => (
                    <div className="comment" key={comment.id} id={"comment-"+comment.id}>
                        <div className="header-comment">
                            <div className="user-info-comment">
                                {/* Verifica se o usuário existe antes de acessar a foto */}
                                <img
                                    src={`../../media/upload/users/${users[comment.usuario_id]?.foto || "default.png"}`}
                                    alt={"Foto de " + (users[comment.usuario_id]?.nome)}
                                />
                                <div className="text-info-comment">
                                    {/* Verifica se o usuário existe antes de acessar o nome */}
                                    <p>{users[comment.usuario_id]?.nome}</p>
                                    <time dateTime={comment.data_comentario}>{getRelativeTime(comment.data_comentario)}</time>
                                </div>
                            </div>
                            <div className="actions-comment">
                                <i class="bi bi-arrow-90deg-left"></i>
                            </div>
                        </div>
                        <div className="comment-body">
                            <p>{comment.conteudo}</p>
                        </div>
                    </div>
                ))}
                {comments.length ? (
                <div className="back-to-top">
                    <a href="#top">
                        <i className="bi bi-arrow-up"></i>
                    </a>
                </div>
                ) : ""}
            </div>
        </div>
    );
}
