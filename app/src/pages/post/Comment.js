import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Comment() {
    const [comments, setComments] = useState({});
    const [users, setUsers] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [erro, setErro] = useState(null);
    const [isCommentsLoaded, setIsCommentsLoaded] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [erroComment, setErroComment] = useState(null);

    const { title } = useParams();
    const id = title.match(/^(\d+)-/)?.[1];

    const idUser = 1;

    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/user/id/${idUser}`).then((response) => {
            if (!response.ok) throw new Error("Usuário não encontrado.");
            return response.json();
        }).then((data) => setUsuario(data)).catch((error) => setErro(error.message));
    }, [idUser]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/post/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error("Comentários não encontrados.");
                return response.json();
            })
            .then((data) => {
                setComments(Array.isArray(data) ? data : []);
                setIsCommentsLoaded(true);
            })
            .catch((error) => {
                setErro(error.message);
                setIsCommentsLoaded(true);
            });
    }, [id]);

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
        ];
    
        for (const interval of timeIntervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);

            if (count > 0) {
                const unit = interval.unit;
                const plural = count > 1 ? `${unit}s` : unit;
                return `${count} ${plural} atrás`;
            }
        }
    
        return "Agora mesmo";
    };

    const handleAddComment = () => {
        if (newComment.trim() === "") {
            setErroComment("Ops! O campo de comentário está vazio.");
            return;
        }

        fetch("http://localhost:5000/api/v0.0.1/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conteudo: newComment,
                usuario_id: idUser,
                postagem_id: id
            }),
        })
        .then((response) => {
            if (!response.ok) throw new Error("Falha ao adicionar comentário.");
            return response.json();
        })
        .then((data) => {
            setComments((prev) => [...prev, data]);
            setNewComment("");
            setErroComment(null);
        })
        .catch((error) => setErroComment(error.message));
    };

    const handleDeleteComment = (comment_id) => {
        if (!comment_id) {
            setErro("Nenhum comentário para deletar.");
            return;
        }

        if (window.confirm("Tem certeza que deseja excluir o comentário?")) {
            fetch(`http://localhost:5000/api/v0.0.1/comment/${comment_id}`, {
                method: "DELETE",
            })
            .then((response) => {
                if (!response.ok) throw new Error("Falha ao excluir o comentário.");
                return response.json();
            })
            .then(() => {
                setComments((prev) => prev.filter((comments) => comments.id !== comment_id));
                setErro(null);
            })
            .catch((error) => {
                setErro(error.message || "Erro desconhecido ao excluir o comentário.");
            });
        }
    };
    
    if (erro) return <p>{erro}</p>;
    if (!isCommentsLoaded || !users || !usuario) return <p>Carregando...</p>;

    return (
        <div className="container-comments" id="top">
            <p>{comments.length ? comments.length + " C" : "Sem c"}omentários{comments.length > 1 ? "s" : ""} </p>
            <div className="comments-add">
                <img src={`../../media/upload/users/${usuario?.foto || "default.png"}`} alt={"Foto de " + usuario.nome}/>
                <label>
                    <input
                        type="text"
                        name="comentario"
                        maxLength={120}
                        value={newComment}
                        placeholder={comments.length ? "Deixe seu comentário" : "Seja o primeiro a comentar" }
                        onChange={(e) => setNewComment(e.target.value)}
                        id="comentario" onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddComment();
                            }
                        }}
                    />
                    <button type="send" onClick={handleAddComment}>
                        <i class="bi bi-send"></i>
                    </button>
                </label>
            </div>
            <i className="error">{erroComment}</i>
            <div className="comments-post">
                {comments.map((comment) => (
                    <div className="comment" key={comment.id} id={"comment-"+comment.id}>
                        <div className="header-comment">
                            <div className="user-info-comment">
                                <img
                                    src={`../../media/upload/users/${users[comment.usuario_id]?.foto || "default.png"}`}
                                    alt={"Foto de " + (users[comment.usuario_id]?.nome)}
                                />
                                <div className="text-info-comment">
                                    <p>{users[comment.usuario_id]?.nome}</p>
                                    <time dateTime={comment.data_comentario}>{getRelativeTime(comment.data_comentario)}</time>
                                </div>
                            </div>
                            <div className="actions-comment">
                                <i class="bi bi-arrow-90deg-left"></i>
                                {comment.usuario_id == idUser && (
                                    <i class="bi bi-trash" onClick={() => handleDeleteComment(comment.id)}></i>
                                )}
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
