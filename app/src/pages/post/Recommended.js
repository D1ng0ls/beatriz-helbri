import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Recommended() {
    const [comments, setComments] = useState([]);  // Para armazenar os comentários
    const [posts, setPosts] = useState([]);  // Corrigido de {} para [] porque posts é uma lista
    const [postAtual, setPostAtual] = useState({});  // Para armazenar o post atual
    const [categoria, setCategoria] = useState({});  // Para armazenar a categoria
    const [erro, setErro] = useState(null);  // Para armazenar erros

    const { title } = useParams();
    const id = title.match(/^(\d+)-/)?.[1];

    useEffect(() => {
        // Busca o post atual
        fetch(`http://127.0.0.1:5000/api/v0.0.1/post/id/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error("Postagem não encontrada.");
                return response.json();
            })
            .then((data) => {
                setPostAtual(data);
                // Faz a requisição para os posts da mesma categoria
                if (data?.categoria_id) {
                    fetch(`http://127.0.0.1:5000/api/v0.0.1/post/categoria/${data.categoria_id}`)
                        .then((response) => {
                            if (!response.ok) throw new Error("Postagens da categoria não encontradas.");
                            return response.json();
                        })
                        .then((data) => setPosts(data))
                        .catch((error) => setErro(error.message));
                    // Faz a requisição para pegar o nome da categoria
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
    }, [id]);  // Dependência para buscar os dados sempre que `id` mudar

    if (erro) return <p>{erro}</p>;
    if (!posts.length || !categoria.nome) return <p>Carregando...</p>;  // Espera os posts e o nome da categoria

    // Filtra os posts para remover o post atual da lista de recomendados
    const outrosPosts = posts.filter(post => post.id !== postAtual.id).slice(0, 3);  // Exclui o post atual

    return (
        <div className="container-recommended">
            <p>Recentes na categoria {categoria.nome}</p>  {/* Exibe o nome da categoria */}
            <div className="recommended-posts">
                {outrosPosts.map((post, index) => (
                    <a
                        href={`/post/${categoria.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}/${post.id}-${post.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`}
                    >
                        <div className={"post post" + index}>
                            <img src={"../../media/upload/posts/" + post.media} />
                            <h3>{post.titulo}</h3>
                            <div className="info-text-post-recommended">
                                <i className="bi bi-eye"></i><span className="info">{post.views > 999 ? post.views / 1000 + "mil" : post.views}</span>
                                <i className="bi bi-chat-dots"></i><span className="info">{comments.length || "0"}</span>
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
