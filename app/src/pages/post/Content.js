import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function Content() {
    const [post, setPost] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [comments, setComments] = useState([]);
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [copied, setCopied] = useState(false);

    const { categoriaUrl, title } = useParams();
    const id = title.match(/^(\d+)-/);

    const commentsFetched = useRef(false);
    const categoriaFetched = useRef(false);

    useEffect(() => {
        if (id) {
            const cachedPost = localStorage.getItem(`post_${id[1]}`);
            if (cachedPost) {
                setPost(JSON.parse(cachedPost));
                setCarregando(false);
            } else {
                fetch(`http://127.0.0.1:5000/api/v0.0.1/post/${id[1]}`)
                    .then((response) => {
                        if (!response.ok) throw new Error("Postagem não encontrada.");
                        return response.json();
                    })
                    .then((data) => {
                        setPost(data);
                        localStorage.setItem(`post_${id[1]}`, JSON.stringify(data));
                        setCarregando(false);
                    })
                    .catch((error) => {
                        setErro(error.message);
                        setCarregando(false);
                    });
            }
        }
    }, [id]);

    useEffect(() => {
        if (post && post.id && !commentsFetched.current) {
            fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/post/${id[1]}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Comentários não encontrados.");
                    return response.json();
                })
                .then((data) => {
                    setComments(data);
                    commentsFetched.current = true;
                })
                .catch((error) => setErro(error.message));
        }
    }, [id]);

    useEffect(() => {
        if (post && post.categoria_id && !categoriaFetched.current) {
            fetch(`http://127.0.0.1:5000/api/v0.0.1/category/${post.categoria_id}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Categoria não encontrada.");
                    return response.json();
                })
                .then((data) => {
                    setCategoria(data);
                    categoriaFetched.current = true;
                })
                .catch((error) => setErro(error.message));
        }
    }, [post]);

    const handleCopy = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((error) => console.error("Erro ao copiar a URL: ", error));
    };
    
    if (erro) return <p>{erro}</p>;
    if (carregando || !post || !categoria) return <p>Carregando...</p>;

    const encodedUrl = `${window.location.href}`;

    return (
        <>
        {(post.id + "-" + post.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase() === title && categoria?.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase() === categoriaUrl) ? (
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
                    <span className="tag-post">{categoria?.nome}</span>
                </i>
                <i className="bi bi-share" onClick={handleCopy}></i>
                <span className={copied ? "aparece" : "desaparece"}>URL Copiada!</span>
            </div>
            <h1>{post.titulo}</h1>
            <img src={"../../media/upload/posts/" + post.media} alt={"Imagem de: " + post.titulo} />
            <p>{post.conteudo}</p>
            <div className="share-post">
                <p>Compartilhar com:
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-facebook"></i>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?text=${post.titulo}&url=${encodedUrl}&hashtags=blog,novidade`} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href={`https://api.whatsapp.com/send?text=${post.titulo}+${encodedUrl}`} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-whatsapp"></i>
                    </a>
                </p>
            </div>
            <div className="info-text-post">
                <i className="bi bi-eye"></i><span className="info">{post.views > 999 ? post.views / 1000 + "mil" : post.views}</span>
                <i className="bi bi-chat-dots"></i><span className="info">{comments.length || '0'}</span>
                <i className="bi bi-heart"></i><span className="info">{post.likes > 999 ? post.likes / 1000 + "mil" : post.likes}</span>
            </div>
        </div>
        ) : "Postagem não encontrada!"}
        </>
    );
}
