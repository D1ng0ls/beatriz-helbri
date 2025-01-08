import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TextEditor from "../../library/textEditor";

export default function Forms() {
    const [post, setPost] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaPost, setCategoriaPost] = useState([]);
    const [content, setContent] = useState('');
    const [erro, setErro] = useState(null);

    const query = new URLSearchParams(useLocation().search);
    const edit = query.get("edit");

    useEffect(() => {
    if (edit) {
        fetch(`http://localhost:5000/api/v0.0.1/post/id/${edit}`)
        .then((response) => {
            if (!response.ok) throw new Error("Postagem não encontrada.");
            return response.json();
        })
        .then((data) => {
            setPost(data);
            setContent(data?.conteudo || '');
        })
        .catch((error) => setErro(error.message));
    }
    }, [edit]);

    useEffect(() => {
    if (post && post.categoria_id) {
        fetch(`http://localhost:5000/api/v0.0.1/post/id/${post.categoria_id}`)
        .then((response) => {
            if (!response.ok) throw new Error("Categoria não encontrada.");
            return response.json();
        })
        .then((data) => setCategoriaPost(data))
        .catch((error) => setErro(error.message));
    }
    }, [post]);


    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/categoria`)
        .then((response) => {
            if (!response.ok) throw new Error("Categoria não encontrada.");
            return response.json();
        })
        .then((data) => setCategorias(data))
        .catch((error) => setErro(error.message));
    }, []);


    const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    formData.append('conteudo', content);

    console.log("Form data:", Object.fromEntries(formData));
    };

    if (erro) return <p>{erro}</p>;
    if (!post || !categorias) return <p>Carregando...</p>;

    return (
        <main>
            <div className="container-forms">
                <form onSubmit={handleSubmit} method="post">
                    <label id="mediaLabel" form="media">
                        {!post.media ? (
                            <div className="add-media">
                                <i className="bi bi-plus-lg"></i>
                                <span>Adicionar imagem</span>
                            </div>
                        ):''}
                        <input
                            tabIndex={1}
                            type="file"
                            id="media"
                            name="media"
                            accept="image/png, image/jpeg"
                            defaultValue={post?.media || ''}
                        />
                    </label>
                    <label form="titulo">Título
                        <input
                            tabIndex={2}
                            type="text"
                            id="titulo"
                            name="titulo"
                            defaultValue={post?.titulo || ''}
                        />
                    </label>
                    <label form="categoria">Categoria
                        <select tabIndex={3} name="categoria" id="categoria">
                            <option value="" selected={!categoriaPost.id ? true : false} disabled={true}>
                            - Selecione uma categoria -
                            </option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id} selected={categoriaPost.id === categoria.id ? true : false}>
                                {categoria.nome}
                                </option>
                            ))}
                        </select>
                    </label>
                    {content !== '' && (
                        <div className="card">
                            <TextEditor defaultValue={content} onChange={(value) => setContent(value)} />
                        </div>
                    )}
                    <input type="text" name="conteudo" id="conteudo" value={content} disabled='true' hidden='true'/>
                    <div className="buttons">
                        <a href="">Cancelar</a>
                        <button type="submit">Publicar</button>
                    </div>
                </form>
            </div>
        </main>
    );
}