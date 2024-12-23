import React, { useState, useEffect, useRef} from "react";

export default function Comentarios() {
    const [usuario, setUsuario] = useState(null);
    const [comments, setComments] = useState(null);
    const [posts, setPosts] = useState({});
    const [erro, setErro] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("recentes"); // Filtro "Recentes" como padrão

    const [isPassed, setIsPassed] = useState(false);
    const elementRef = useRef(null); // Referência para o elemento a ser monitorado

    useEffect(() => {
        const handleScroll = () => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                // Se o topo do elemento atingir 0 ou passar disso
                if (rect.top <= 0) {
                    setIsPassed(true); // O topo do elemento chegou ao topo da janela
                } else {
                    setIsPassed(false); // O elemento não atingiu o topo ainda
                }
            }
        };

        // Adiciona o evento de scroll
        window.addEventListener("scroll", handleScroll);

        // Limpeza do evento de scroll quando o componente for desmontado
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const user = 3;

    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/user/id/${user}`)
        .then((response) => {
            if (!response.ok) throw new Error("Usuário não encontrado.");
            return response.json();
        })
        .then((data) => setUsuario(data))
        .catch((error) => setErro(error.message));
    }, []);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/user/${user}`)
        .then((response) => {
            if (!response.ok) throw new Error("Comentários não encontrados.");
            return response.json();
        })
        .then((data) => setComments(data))
        .catch((error) => setErro(error.message));
    }, []);

    useEffect(() => {
        if (comments && comments.length > 0) {
            comments.forEach((comment) => {
                fetch(`http://127.0.0.1:5000/api/v0.0.1/post/${comment.postagem_id}`)
                    .then((response) => {
                        if (!response.ok) throw new Error("Postagem não encontrada.");
                        return response.json();
                    })
                    .then((data) => {
                        setPosts((prevPosts) => ({
                            ...prevPosts,
                            [comment.postagem_id]: data,
                        }));
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
    if (!comments) return <p>Carregando comentários...</p>;
    if (!posts) return <p>Carregando postagens...</p>;

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
            <div className="comentarios" ref={elementRef} >
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
                        {posts[comment.postagem_id] && (
                            <div className="post-comment">
                                <h3>{posts[comment.postagem_id].titulo}</h3>
                                <img src={"media/upload/posts/" + posts[comment.postagem_id].media} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
