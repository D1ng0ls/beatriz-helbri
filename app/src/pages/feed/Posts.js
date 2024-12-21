import React, { useState, useEffect } from "react";

export default function Posts({ selectedCategories, selectedTime }) {
    const [posts, setPosts] = useState([]);
    const [comentarios, setComentarios] = useState({});
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
            .then((data) => {
                setPosts((prevPosts) => {
                    const newPosts = data.filter(
                        (post) => !prevPosts.some((prevPost) => prevPost.id === post.id)
                    );
                    return [...prevPosts, ...newPosts];
                });
            })
            .catch((error) => setErro(error.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

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

    const filteredPosts = posts
        .filter((post) => {
            if (selectedCategories.length > 0) {
                return selectedCategories.includes(post.categoria);
            }
            return true;
        })
        .sort((a, b) => {
            if (selectedTime === "recentes") {
                return new Date(b.data_postagem) - new Date(a.data_postagem);
            }
            return new Date(a.data_postagem) - new Date(b.data_postagem);
        });

    if (erro) return <p>{erro}</p>;
    if (!posts.length) return <p>Carregando...</p>;

    return (
        <div className="container-postagem">
            <div className="postagens">
                {filteredPosts.map((post, index) => (
                    <div className={`post post${index + 1}`} key={post.id}>
                        <div className="img-post">
                            <img src={'media/upload/posts/' + post.media} alt={'Imagem de: ' + post.titulo} />
                        </div>
                        <div className="text-post">
                            <i>
                                <time dateTime={post.data_postagem}>
                                    {new Date(post.data_postagem).toLocaleDateString("pt-BR", {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </time>
                                <span className="tag-post">{post.categoria}</span>
                            </i>
                            <h2>{post.titulo}</h2>
                            <p>{post.conteudo}</p>
                            <div className="info-text-post">
                                <i className="bi bi-eye"></i><span className="info">{post.views}</span>
                                <i className="bi bi-chat-dots"></i><span className="info">{comentarios[post.id] || 0}</span>
                                <i className="bi bi-heart"></i><span className="info">{post.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {loading && <i className="bi bi-arrow-repeat"></i>}
        </div>
    );
}