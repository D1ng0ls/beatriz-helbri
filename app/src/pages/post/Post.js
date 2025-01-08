import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Content from "./Content"
import Recommended from "./Recommended";
import Comment from "./Comment";
import NotFound from "./NotFound";

export default function Post() {
    const [post, setPost] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const { categoriaUrl, title } = useParams();
    const id = title.match(/^(\d+)-/)?.[1];

    useEffect(() => {
            if (!id) return;
    
            const fetchData = async () => {
                try {
                    setCarregando(true);
    
                    // Fetch Post
                    const cachedPost = localStorage.getItem(`post_${id}`);
                    const postResponse = cachedPost
                        ? JSON.parse(cachedPost)
                        : await fetch(`http://127.0.0.1:5000/api/v0.0.1/post/id/${id}`).then((res) => {
                              if (!res.ok) throw new Error("Postagem não encontrada.");
                              return res.json();
                          });
    
                    if (!cachedPost) {
                        localStorage.setItem(`post_${id}`, JSON.stringify(postResponse));
                    }
                    setPost(postResponse);
    
                    // Fetch Categoria
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

        if (erro) return <p>{erro}</p>;
        if (carregando || !post || !categoria) return <p>Carregando...</p>;

    return (
        <main>
            {(post.id + "-" + post.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase() === title &&
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
    )
}

