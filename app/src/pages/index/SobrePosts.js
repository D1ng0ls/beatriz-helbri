import React, { useState, useEffect } from "react";

export default function SobrePosts() {
    const [usuario, setUsuario] = useState(null);
    const [posts, setPost] = useState([]);
    const [comentarios, setComentarios] = useState({});
    const [erro, setErro] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/user/id/3`)
            .then((response) => {
                if (!response.ok) throw new Error("Usuário não encontrado.");
                return response.json();
            })
            .then((data) => setUsuario(data))
            .catch((error) => setErro(error.message));
    }, []);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/v0.0.1/post`)
            .then((response) => {
                if (!response.ok) throw new Error("Postagem não encontrada.");
                return response.json();
            })
            .then((data) => setPost(data))  // Esperando um array de posts
            .catch((error) => setErro(error.message));
    }, []);

    useEffect(() => {
        if (posts.length > 0) {
            posts.forEach((post) => {
                fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/post/${post.id}`)
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
            });
        }
    }, [posts]);

    if (erro) return <p>{erro}</p>;
    if (!usuario) return <p>Carregando...</p>;
    if (!posts.length) return <p>Carregando...</p>;

    const firstFivePosts = posts.slice(0, 3);

    return (
        <div className="container-sobre-posts">
            <div className="container-posts">
                {firstFivePosts.map((post, index) => (
                    <div className={`postagem post${index + 1}`} key={post.id}>
                        <div className="img-postagem">
                            <img src={'media/upload/posts/' + post.media} alt="Imagem da Postagem" />
                        </div>
                        <div className="text-postagem">
                            <i>
                                <time dateTime={post.data_postagem}>
                                    {new Date(post.data_postagem).toLocaleDateString("pt-BR", {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </time>
                                <span className="tag-postagem">{post.categoria}</span>
                            </i>
                            <h2>{post.titulo}</h2>
                            <p>{post.conteudo}</p>
                            <div className="info-text-postagem">
                                <i className="bi bi-eye"></i><span className="info">{post.views}</span>
                                <i className="bi bi-chat-dots"></i><span className="info">{comentarios[post.id]?.length || 0}</span>
                                <i className="bi bi-heart"></i><span className="info">{post.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <a href="/feed"><button>Mais posts</button></a>
            </div>
            <div className="container-sobre">
                <div className="sobre">
                    <h2>Sobre mim</h2>
                    <img src={'media/upload/users/' + usuario.foto} alt={'Foto de ' + usuario.nome} />
                    <h3>{usuario.nome}</h3>
                    <p>{usuario.bio}</p>
                    <a href='/sobre'>Leia mais</a>
                    <div className="follow-sobre">
                        <p>Siga-me nas redes sociais.</p>
                        <div className="sociais-follow-sobre">
                            <i className="bi bi-instagram"></i>
                            <i className="bi bi-youtube"></i>
                            <i className="bi bi-pinterest"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
