import React, { useState, useEffect, useRef} from "react";

export default function Comentarios() {
    const [usuario, setUsuario] = useState(null);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState({});
    const [categorias, setCategorias] = useState({});
    const [erro, setErro] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("recentes");

    const [isPassed, setIsPassed] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                if (rect.top <= 0) {
                    setIsPassed(true);
                } else {
                    setIsPassed(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const user = 1;

    // Carregar o usuário
    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/user/id/${user}`)
            .then((response) => {
                if (!response.ok) throw new Error("Usuário não encontrado.");
                return response.json();
            })
            .then((data) => setUsuario(data))
            .catch((error) => setErro(error.message));
    }, []);

    // Carregar os comentários
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/user/${user}`)
            .then((response) => {
                if (!response.ok) throw new Error("Comentários não encontrados.");
                return response.json();
            })
            .then((data) => setComments(data))
            .catch((error) => setErro(error.message));
    }, []);

    // Carregar postagens e associar categorias
    useEffect(() => {
        if (comments.length > 0) {
            const postMap = {};
            const categoriaMap = {};

            // Carregar postagens associadas aos comentários
            comments.forEach((comment) => {
                fetch(`http://127.0.0.1:5000/api/v0.0.1/post/id/${comment.postagem_id}`)
                    .then((response) => {
                        if (!response.ok) throw new Error("Postagem não encontrada.");
                        return response.json();
                    })
                    .then((data) => {
                        postMap[comment.postagem_id] = data;

                        // Carregar categorias associadas às postagens
                        fetch(`http://127.0.0.1:5000/api/v0.0.1/categoria/${data.categoria_id}`)
                            .then((response) => {
                                if (!response.ok) throw new Error("Categoria não encontrada.");
                                return response.json();
                            })
                            .then((dataCategoria) => {
                                categoriaMap[data.categoria_id] = dataCategoria;
                                setPosts(postMap);
                                setCategorias(categoriaMap);
                            })
                            .catch((error) => setErro(error.message));
                    })
                    .catch((error) => setErro(error.message));
            });
        }
    }, [comments]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        };
        return new Intl.DateTimeFormat("pt-BR", options).format(date);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilter = (newFilter) => {
        setFilter(newFilter);
    };

    const filteredComments = comments
        ? comments
            .filter((comment) => comment.conteudo.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                const dateA = new Date(a.data_comentario);
                const dateB = new Date(b.data_comentario);

                if (filter === "recentes") {
                    return dateB - dateA; // Mais recentes primeiro
                } else if (filter === "antigos") {
                    return dateA - dateB; // Mais antigos primeiro
                }
                return 0;
            })
        : [];

    if (erro) return <p>{erro}</p>;
    if (!usuario) return <p>Carregando usuário...</p>;
    if (!comments.length) return <p>Carregando comentários...</p>;
    if (Object.keys(posts).length === 0 || Object.keys(categorias).length === 0) {
        return <p>Carregando postagens e categorias...</p>;
    }

    return (
        <div className="container-comments">
            <h2>Comentários</h2>
            <hr />
            <div className={`search-filter ${isPassed ? "fixed" : ""}`}>
                <div className="search-comments">
                    <input
                        type="text"
                        name="buscar"
                        id="buscar"
                        placeholder="Buscar comentário"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button onClick={() => handleSearch}>Buscar</button>
                </div>
                <div className="filter-comments">
                    <button
                        className={filter === "recentes" ? "selected" : ""}
                        onClick={() => handleFilter("recentes")}
                    >
                        Recentes
                    </button>
                    <button
                        className={filter === "antigos" ? "selected" : ""}
                        onClick={() => handleFilter("antigos")}
                    >
                        Antigos
                    </button>
                </div>
            </div>
            <div className="comentarios" ref={elementRef}>
                {filteredComments.map((comment) => (
                    <div key={comment.id} className={`comentario comentario${comment.id}`}>
                        <div className="header-comment">
                            <div className="info-user-comment">
                                {!usuario.foto ? (
                                    <i className="bi bi-person-circle"></i>
                                ) : (
                                    <img src={`media/upload/users/${usuario.foto}`} alt={"Foto de " + usuario.nome} />
                                )}
                                <div className="text-info-user">
                                    <p>{usuario.nome}</p>
                                    <time dateTime={comment.data_comentario}>
                                        {formatDate(comment.data_comentario)}
                                    </time>
                                </div>
                            </div>
                            <div className="options-comment">
                                <i className="bi bi-arrow-90deg-right"></i>
                                <i className="bi bi-trash"></i>
                            </div>
                        </div>
                        <div className="text-comment">
                            <p>{comment.conteudo}</p>
                        </div>
                        {posts[comment.postagem_id] && categorias[posts[comment.postagem_id].categoria_id] && (
                            <a
                                href={`/post/${categorias[posts[comment.postagem_id].categoria_id].nome
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .replace(/[^a-zA-Z0-9\s]/g, "")
                                    .replace(/\s+/g, "-")
                                    .toLowerCase()}/${comment.postagem_id}-${posts[comment.postagem_id].titulo
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .replace(/[^a-zA-Z0-9\s]/g, "")
                                    .replace(/\s+/g, "-")
                                    .toLowerCase()}`}
                            >
                                <div className="post-comment">
                                    <h3>{posts[comment.postagem_id].titulo}</h3>
                                    <img src={"media/upload/posts/" + posts[comment.postagem_id].media} alt={"Imagem de: " + posts[comment.postagem_id].titulo} />
                                </div>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
