import React, { useState, useEffect } from "react";

export default function SobrePosts() {
    const [usuario, setUsuario] = useState(null);
    const [posts, setPost] = useState([]);
    const [categorias, setCategorias] = useState({});
    const [comentarios, setComentarios] = useState({});
    const [erro, setErro] = useState(null);

    useEffect(() => {
        Promise.all([
            fetch(`http://localhost:5000/api/v0.0.1/user/id/1`).then((response) => response.json()),
            fetch(`http://127.0.0.1:5000/api/v0.0.1/post`).then((response) => response.json())
        ])
            .then(async ([usuarioData, postsData]) => {
                setUsuario(usuarioData);
                setPost(postsData);
                
                const categoriaRequests = postsData.map((post) =>
                    fetch(`http://127.0.0.1:5000/api/v0.0.1/categoria/${post.categoria_id}`).then((response) => response.json())
                );
                const comentarioRequests = postsData.map((post) =>
                    fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/post/${post.id}`).then((response) => response.json())
                );

                const responses = await Promise.all([...categoriaRequests, ...comentarioRequests]);
                const categoriasMap = {};
                const comentariosMap = {};
                const categoryResponses = responses.slice(0, categoriaRequests.length);
                const commentResponses = responses.slice(categoriaRequests.length);
                categoryResponses.forEach((categoryData, index) => {
                    categoriasMap[postsData[index].categoria_id] = categoryData;
                });
                commentResponses.forEach((commentData, index_1) => {
                    comentariosMap[postsData[index_1].id] = commentData;
                });
                setCategorias(categoriasMap);
                setComentarios(comentariosMap);
            })
            .catch((error) => setErro(error.message));
    }, []);

    if (erro) return <p>{erro}</p>;
    if (!usuario || !posts.length || !categorias || !comentarios) return <p>Carregando...</p>;

    const firstFivePosts = posts.slice(0, 3);

    return (
        <div className="container-sobre-posts">
            <div className="container-posts">
                {firstFivePosts.map((post, index) => (
                    <a
                        href={`/post/${categorias[post.categoria_id]?.nome
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-zA-Z0-9\s]/g, "")
                            .replace(/\s+/g, "-")
                            .toLowerCase()}/${post.id}-${post.titulo
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-zA-Z0-9\s]/g, "")
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                        key={post.id}
                    >
                        <div className={`postagem post${index + 1}`}>
                            <div className="img-postagem">
                                <img src={"media/upload/posts/" + post.media} alt="Imagem da Postagem" />
                            </div>
                            <div className="text-postagem">
                                <i>
                                    <time dateTime={post.data_postagem}>
                                        {new Date(post.data_postagem).toLocaleDateString("pt-BR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </time>
                                    <span className="tag-postagem">{categorias[post.categoria_id]?.nome}</span>
                                </i>
                                <h2>{post.titulo}</h2>
                                <p dangerouslySetInnerHTML={{ __html:post.conteudo}}></p>
                                <div className="info-text-postagem">
                                    <i className="bi bi-eye"></i>
                                    <span className="info">{post.views > 999 ? post.views / 1000 + "mil" : post.views}</span>
                                    <i className="bi bi-chat-dots"></i>
                                    <span className="info">{comentarios[post.id]?.length || "0"}</span>
                                    <i className="bi bi-heart"></i>
                                    <span className="info">{post.likes > 999 ? post.likes / 1000 + "mil" : post.likes}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
                <a href="/feed">
                    <button>Mais posts</button>
                </a>
            </div>
            <div className="container-sobre">
                <div className="sobre">
                    <h2>Sobre mim</h2>
                    <img src={"media/upload/users/" + usuario.foto} alt={"Foto de " + usuario.nome} />
                    <h3>{usuario.nome}</h3>
                    <p>{usuario.bio}</p>
                    <a href="/sobre">Leia mais</a>
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
