import React, { useState, useEffect } from "react";
import htmlToDraft from 'html-to-draftjs';

export default function Posts({ selectedCategories, selectedTime, searchText }) {
    const [posts, setPosts] = useState([]);
    const [comentarios, setComentarios] = useState({});
    const [categoria, setCategoria] = useState([]);
    const [erro, setErro] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPosts = () => {
        if (loading) return;
        setLoading(true);

        fetch(`http://127.0.0.1:5000/api/v0.0.1/post`)
            .then((response) => {
                if (!response.ok) throw new Error("Postagem não encontrada.");
                return response.json();
            })
            .then((data) => setPosts(data))
            .catch((error) => setErro(error.message))
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
            fetchPosts();
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

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

    useEffect(() => {
        if (posts.length > 0) {
            const fetchCategorias = async () => {
                const categoriasMap = {};
                for (const post of posts) {
                    try {
                        const response = await fetch(`http://127.0.0.1:5000/api/v0.0.1/categoria/${post.categoria_id}`);
                        if (!response.ok) throw new Error("Categoria não encontrada.");
                        const data = await response.json();
                        categoriasMap[post.categoria_id] = data; // Mapeia pela ID da categoria
                    } catch (error) {
                        setErro(error.message);
                    }
                }
                setCategoria(categoriasMap); // Atualiza o estado com o mapa de categorias
            };
            fetchCategorias();
        }
    }, [posts]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts
        .filter((post) => {
            // Filtra por categoria
            if (selectedCategories?.length > 0) {
                return selectedCategories.includes(post.categoria);
            }
            return true;
        })
        .filter((post) => {
            // Filtra por texto de busca
            if (searchText) {
                return (
                    post.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                    post.conteudo.toLowerCase().includes(searchText.toLowerCase())
                );
            }
            return true;
        })
        .sort((a, b) => {
            // Ordena por tempo
            if (selectedTime === "recentes") {
                return new Date(b.data_postagem) - new Date(a.data_postagem);
            }
            return new Date(a.data_postagem) - new Date(b.data_postagem);
        });

    if (erro) return <p>{erro}</p>;
    if (!posts.length || !categoria) return <p>Carregando...</p>;

    return (
        <div className="container-postagem">
            <div className="postagens">
                {filteredPosts.map((post, index) => (
                    <a href={`/post/${categoria[post.categoria_id]?.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}/${post.id}-${post.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`}>
                        <div className={`post post${index + 1}`} key={post.id}>
                            <div className="img-post">
                                <img
                                    src={"media/upload/posts/" + post.media}
                                    alt={"Imagem de: " + post.titulo}
                                />
                            </div>
                            <div className="text-post">
                                <i>
                                    <time dateTime={post.data_postagem}>
                                        {new Date(post.data_postagem).toLocaleDateString("pt-BR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </time>
                                    <span className="tag-post">{categoria[post.categoria_id]?.nome}</span>
                                </i>
                                <h2>{post.titulo}</h2>
                                <p dangerouslySetInnerHTML={{ __html:post.conteudo}}></p>
                                <div className="info-text-post">
                                    <i className="bi bi-eye"></i><span className="info">{post.views>999 ? post.views/1000 + "mil" : post.views}</span>
                                    <i className="bi bi-chat-dots"></i><span className="info">{comentarios[post.id] || 0}</span>
                                    <i className="bi bi-heart"></i><span className="info">{post.likes>999 ? post.likes/1000 + "mil" : post.likes}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
