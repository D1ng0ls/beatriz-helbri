import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Recommended() {
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [postAtual, setPostAtual] = useState({});
    const [categoria, setCategoria] = useState({});
    const [erro, setErro] = useState(null);

    const { title } = useParams();
    const id = title.match(/^(\d+)-/)?.[1];

    useEffect(() => {
        if (!id) return;

        fetch(`http://127.0.0.1:5000/api/v0.0.1/post/id/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error("Postagem não encontrada.");
                return response.json();
            })
            .then((data) => {
                setPostAtual(data);
                if (data?.categoria_id) {
                    fetch(`http://127.0.0.1:5000/api/v0.0.1/post/categoria/${data.categoria_id}`)
                        .then((response) => {
                            if (!response.ok) throw new Error("Postagens da categoria não encontradas.");
                            return response.json();
                        })
                        .then((data) => setPosts(data))
                        .catch((error) => setErro(error.message));

                    fetch(`http://127.0.0.1:5000/api/v0.0.1/categoria/${data.categoria_id}`)
                        .then((response) => {
                            if (!response.ok) throw new Error("Categoria não encontrada.");
                            return response.json();
                        })
                        .then((data) => setCategoria(data))
                        .catch((error) => setErro(error.message));
                }
            })
            .catch((error) => setErro(error.message));
    }, [id]);

    useEffect(() => {
        if (posts.length > 0) {
            const fetchComments = posts.map(post => 
                fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/post/${post.id}`)
                    .then((response) => {
                        if (!response.ok) throw new Error("Comentários não encontrados.");
                        return response.json();
                    })
                    .then((data) => ({ postId: post.id, comments: data }))
                    .catch((error) => setErro(error.message))
            );

            Promise.all(fetchComments)
                .then(results => {
                    const commentsByPost = results.reduce((acc, { postId, comments }) => {
                        acc[postId] = comments;
                        return acc;
                    }, {});
                    setComments(commentsByPost);
                });
        }
    }, [posts]);

    if (erro) return <p>{erro}</p>;
    if (!posts.length || !categoria.nome) return <p>Carregando...</p>;

    const outrosPosts = posts.filter(post => post.id !== postAtual.id).slice(0, 3);

    return (
        <div className="container-recommended">
            <p>Recentes na categoria {categoria.nome}</p>
            <div className="recommended-posts">
                {outrosPosts.map((post, index) => (
                    <a
                        href={`/post/${categoria.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}/${post.id}-${post.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`}
                    >
                        <div className={"post post" + index}>
                            <img src={"../../media/upload/posts/" + post.media} alt={"Imagem de "+post.titulo}/>
                            <h3>{post.titulo}</h3>
                            <div className="info-text-post-recommended">
                                <i className="bi bi-eye"></i><span className="info">{post.views > 999 ? post.views / 1000 + "mil" : post.views}</span>
                                <i className="bi bi-chat-dots"></i><span className="info">{comments[post.id]?.length || "0"}</span>
                                <i className="bi bi-heart"></i><span className="info">{post.likes > 999 ? post.likes / 1000 + "mil" : post.likes}</span>
                            </div>
                        </div>
                    </a>
                ))}
                <a href={"/feed?categories="+categoria.nome}>
                    <div className="more-posts">
                        <h3>Veja mais!</h3>
                        <i className="bi bi-arrow-right"></i>
                    </div>
                </a>
            </div>
        </div>
    );
}
