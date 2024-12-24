import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

export default function Content({postUrl, postTitle}) {
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState([]);
    const [comentarios, setComentarios] = useState({});
    const [erro, setErro] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/v0.0.1/post/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error("Postagem não encontrada.");
                return response.json();
            })
            .then((data) => setPost(data))
            .catch((error) => setErro(error.message));
    }, [id]);

     useEffect(() => {
        if (post.length > 0) {
                fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/post/${id}`)
                    .then((response) => {
                        if (!response.ok) throw new Error("Comentários não encontrados.");
                        return response.json();
                    })
                    .then((data) => {
                        setComentarios((prev) => ({
                            ...prev,
                            [post.id]: data.length,
                        }));
                    })
                    .catch((error) => setErro(error.message));
        }
    }, [post, id]);
    

    if (erro) return <p>{erro}</p>;
    if (post.length === 0) return <p>Carregando...</p>;

    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(postTitle);

    return (
        <div className="container-postagem">
            <div className="header-post">
                <i>
                    <time dateTime={post.data_postagem}>
                        {new Date(post.data_postagem).toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </time>
                    <span className="tag-post"> {post.categoria || 'categoria'}</span>
                </i>
                <h2>{post.titulo}</h2>
                <p>{post.conteudo}</p>
                <div className="share-post">
                    <p>Compartilhar com:
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-facebook"></i>
                        </a>

                        <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=blog,novidade`} target="_blank"rel="noopener noreferrer">
                            <i className="bi bi-twitter-x"></i>
                        </a>
                        <a href={`https://api.whatsapp.com/send?text=${encodedTitle}+${encodedUrl}`} target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-whatsapp"></i>
                        </a>
                    </p>
                </div>
                <div className="info-text-post">
                    <i className="bi bi-eye"></i><span className="info">{post.views}</span>
                    <i className="bi bi-chat-dots"></i><span className="info">{comentarios[id] || 0}</span>
                    <i className="bi bi-heart"></i><span className="info">{post.likes}</span>
                </div>
            </div>
        </div>
    )
}