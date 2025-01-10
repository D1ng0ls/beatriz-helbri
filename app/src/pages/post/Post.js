import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Content from "./Content";
import Recommended from "./Recommended";
import Comment from "./Comment";
import NotFound from "./NotFound";

export default function Post() {
    const [post, setPost] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [hasViewed, setViewed] = useState(false);

    const { categoriaUrl, title } = useParams();
    const id = title.match(/^(\d+)-/)?.[1];

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setCarregando(true);

                // Remover o uso do localStorage, fazendo uma requisição direta sempre
                const postResponse = await fetch(`http://127.0.0.1:5000/api/v0.0.1/post/id/${id}`).then((res) => {
                    if (!res.ok) throw new Error("Postagem não encontrada.");
                    return res.json();
                });

                setPost(postResponse);

                const categoriaResponse = await fetch(`http://127.0.0.1:5000/api/v0.0.1/categoria/${postResponse.categoria_id}`).then((res) => {
                    if (!res.ok) throw new Error("Categoria não encontrada.");
                    return res.json();
                });
                setCategoria(categoriaResponse);
            } catch (error) {
                setErro(error.message);
            } finally {
                setCarregando(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (id && post?.views !== undefined) {
            
            
            if (!hasViewed) {
                fetch(`http://localhost:5000/api/v0.0.1/post/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        titulo: post.titulo,
                        conteudo: post.conteudo,
                        usuario_id: post.usuario_id,
                        categoria_id: post.categoria_id,
                        views: post.views + 1,
                    }),
                })
                .then((response) => {
                    if (!response.ok) throw new Error("Falha ao adicionar categoria.");
                    return response.json();
                })
                .then((updatedPost) => {
                    setPost((prevPost) => ({
                        ...prevPost,
                        views: prevPost.views + 1,
                    }));
                    
                    setViewed(true);
                })
                .catch((error) => setErro(error.message));
            }
        }
    }, [id, post]);

    if (!id || !post) return <main><NotFound/></main>
    if (erro) return <p>{erro}</p>;
    if (carregando) return <p>Carregando...</p>;
    

    return (
        <main>
            {!id || (post.id + "-" + post.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase() === title &&
                categoria?.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase() === categoriaUrl) ? (
            <>    
                <Content/>
                <Recommended/>
                <Comment/>
            </>
            ) : (
            <>    
                <NotFound/>
            </>
            )}
        </main>
    );
}
