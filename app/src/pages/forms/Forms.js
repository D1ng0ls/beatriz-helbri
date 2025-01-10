import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextEditor from "../../library/textEditor";

export default function Forms() {
    const [post, setPost] = useState({});
    const [categorias, setCategorias] = useState([]);
    const [content, setContent] = useState('');
    const [erro, setErro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [mediaPreview, setMediaPreview] = useState(null);
    const [novaCategoria, setNovaCategoria] = useState("");
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const query = new URLSearchParams(useLocation().search);
    const edit = query.get("edit");

    const navigate = useNavigate();
    const userId = 1;

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaPreview(URL.createObjectURL(file));
            setFormData((prevData) => ({
                ...prevData,
                media: file,
            }));
        }
    };

    const [formData, setFormData] = useState({
        titulo: "",
        conteudo: "",
        media: "",
        usuario_id: userId,
        categoria_id: "",
    });

    useEffect(() => {
        if (edit) {
            setLoading(true);
            fetch(`http://localhost:5000/api/v0.0.1/post/id/${edit}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Postagem não encontrada.");
                    return response.json();
                })
                .then((data) => {
                    setPost(data);
                    setFormData({
                        titulo: data.titulo || "",
                        conteudo: data.conteudo || "",
                        media: "",
                        usuario_id: userId,
                        categoria_id: data.categoria_id || "",
                    });
                    setContent(data.conteudo || '');
                    setLoading(false);
                })
                .catch((error) => setErro(error.message));
        } else {
            setLoading(false);
        }
    }, [edit]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/v0.0.1/categoria`)
            .then((response) => {
                if (!response.ok) throw new Error("Categoria não encontrada.");
                return response.json();
            })
            .then((data) => setCategorias(data))
            .catch((error) => setErro(error.message));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const postData = (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        const method = edit ? "PUT" : "POST";
        const url = edit
            ? `http://localhost:5000/api/v0.0.1/post/${edit}`
            : "http://localhost:5000/api/v0.0.1/post";
    
        let requestBody;
    
        if (!formData.media && post.media) {
            requestBody = {
                titulo: formData.titulo,
                conteudo: content,
                usuario_id: userId,
                categoria_id: formData.categoria_id,
                media: post.media,
            };
    
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message);
                    }
                    return response.json();
                })
                .then((data) => {
                    setSuccessMessage(edit ? "Post atualizado com sucesso!" : "Post criado com sucesso!");
                    setIsLoading(false);
                    console.log(edit ? "Post atualizado com sucesso:" : "Post criado com sucesso:", data);
                })
                .catch((error) => {
                    setErro(error.message);
                    setIsLoading(false);
                });
        } else {
            const formDataToSend = new FormData();
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('conteudo', content);
            formDataToSend.append('usuario_id', userId);
            formDataToSend.append('categoria_id', formData.categoria_id);
            
            if (formData.media) {
                formDataToSend.append('media', formData.media);
            } else {
                formDataToSend.append('media', 'keep');
            }
    
            fetch(url, {
                method: method,
                body: formDataToSend,
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message);
                    }
                    return response.json();
                })
                .then((data) => {
                    setSuccessMessage(edit ? "Post atualizado com sucesso!" : "Post criado com sucesso!");
                    setIsLoading(false);
                    console.log(edit ? "Post atualizado com sucesso:" : "Post criado com sucesso:", data);
                })
                .catch((error) => {
                    setErro(error.message);
                    setIsLoading(false);
                });
        }
    };

    const handleDeletePost = () => {
        if (window.confirm("Tem certeza que deseja excluir esta publicação?")) {
            fetch(`http://localhost:5000/api/v0.0.1/post/${edit}`, {
                method: "DELETE",
            })
            .then((response) => {
                if (!response.ok) throw new Error("Falha ao excluir postagem.");
                return response.json();
            })
            .then(() => {
                setSuccessMessage("Postagem excluída com sucesso!");
                navigate(`/insertpost`);
                window.location.reload();
            })
            .catch((error) => {
                setErro(error.message);   
            });
        }
    };

    const handleAddCategory = () => {
        if (novaCategoria.trim() === "") {
            setErro("O nome da categoria não pode estar vazio.");
            return;
        }

        fetch("http://localhost:5000/api/v0.0.1/categoria", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome: novaCategoria }),
        })
        .then((response) => {
            if (!response.ok) throw new Error("Falha ao adicionar categoria.");
            return response.json();
        })
        .then((data) => {
            setCategorias((prev) => [...prev, data]);
            setIsAddingCategory(false);
            setNovaCategoria("");
        })
        .catch((error) => setErro(error.message));
    };

    const handleDeleteCategory = () => {
        if (!formData.categoria_id) {
            setErro("Selecione uma categoria para deletar.");
            return;
        }

        if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
            fetch(`http://localhost:5000/api/v0.0.1/categoria/${formData.categoria_id}`, {
                method: "DELETE",
            })
            .then((response) => {
                if (!response.ok) throw new Error("Falha ao excluir categoria.");
                return response.json();
            })
            .then(() => {
                setCategorias((prev) => prev.filter((categoria) => categoria.id !== formData.categoria_id));
                setFormData((prevData) => ({
                    ...prevData,
                    categoria_id: "",
                }));
                setErro(null);
                setSuccessMessage("Categoria excluída com sucesso!");
            })
            .catch((error) => {
                setErro(error.message);
            });
        }
    };

    if (loading && erro) {
        navigate(`/insertpost`);
    }

    return (
        <main>
            <div className="container-forms">
                <form onSubmit={postData}>
                    <label
                        className={"mediaLabel " + (mediaPreview || post.media ? "mediaContent" : "")}
                        style={{
                            backgroundImage: mediaPreview
                                ? `url(${mediaPreview})`
                                : post.media
                                    ? `url('/media/upload/posts/${post.media}')`
                                    : "",
                            backgroundColor: mediaPreview ? "transparent" : "#BB5A3A",
                        }}
                    >
                        {!mediaPreview && !post.media ? (
                            <div className="add-media">
                                <i className="bi bi-plus-lg"></i>
                                <span>Adicionar imagem</span>
                            </div>
                        ) : (
                            <div className="alter-media">
                                <i className="bi bi-pencil"></i>
                            </div>
                        )}
                        <input
                            tabIndex={1}
                            type="file"
                            id="media"
                            name="media"
                            accept="image/png, image/jpeg"
                            onChange={handleMediaChange}
                        />
                    </label>

                    <label from="titulo">
                        Título
                        <input
                            tabIndex={2}
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                        />
                    </label>

                    <label from="categoria">
                        Categoria
                        <select
                            tabIndex={3}
                            name="categoria_id"
                            id="categoria"
                            value={formData.categoria_id}
                            onChange={handleChange}
                        >
                            <option value="" disabled>
                                - Selecione uma categoria -
                            </option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </option>
                            ))}
                        </select>
                        <div className="action-categoria">
                            <i className="bi bi-plus-lg" onClick={() => setIsAddingCategory(!isAddingCategory)}>
                                Adicionar categoria
                            </i>
                            <i className="bi bi-trash" onClick={handleDeleteCategory}>
                                Deletar categoria selecionada
                            </i>
                        </div>
                        {isAddingCategory && (
                            <div className="add-categoria">
                                <input
                                    type="text"
                                    value={novaCategoria}
                                    onChange={(e) => setNovaCategoria(e.target.value)}
                                    placeholder="Digite o nome da nova categoria"
                                />
                                <button type="button" onClick={handleAddCategory}>
                                    Adicionar
                                </button>
                            </div>
                        )}
                    </label>

                    <div className="card">
                        {!loading && (
                            <TextEditor defaultValue={content} onChange={(value) => setContent(value)} />
                        )}
                    </div>

                    <div className="buttons">
                        <a href="/">Cancelar</a>
                        <button type="submit">{isLoading ? "Publicando..." : edit ? "Salvar" : "Publicar"}</button>
                        {edit ? (
                            <button id="delete-btn" type="button" onClick={handleDeletePost}>
                                Deletar
                            </button>
                        ) : "" }
                    </div>
                </form>

                {erro && <p style={{ color: "red" }}>{erro}</p>}
                {successMessage && <p className="successMessage">{successMessage}</p>}
            </div>
        </main>
    );
}