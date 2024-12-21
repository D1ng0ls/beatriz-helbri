import React, {useState, useEffect} from "react";

export default function Destaque() {
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/v0.0.1/post`)
            .then((response) => {
                if (!response.ok) throw new Error("Postagem não encontrada.");
                return response.json();
            })
            .then((data) => setPost(data))
            .catch((error) => setErro(error.message));
    }, []);

    useEffect(() => {
        if (post && post.length > 0) {
            fetch(`http://127.0.0.1:5000/api/v0.0.1/comment/post/${post[0].id}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Comentários não encontrados.");
                    return response.json();
                })
                .then((data) => setComment(data))
                .catch((error) => setErro(error.message));
        }
    }, [post]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        };
        const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);
        return `${formattedDate}`;
    };

    if (erro) return <p>{erro}</p>;
    if (post.length === 0) return <p>Carregando...</p>;

    return(
        <div className="container-destaque">
            <div className="destaque">
                <div className="img-destaque">
                    <img src="https://www.civitatis.com/blog/wp-content/uploads/2024/01/shutterstock_590390942-1280x853.jpg"/>
                </div>
                <div className="text-destaque">
                    <i><time dateTime={post[0].data_postagem}>{formatDate(post[0].data_postagem)}</time> <span className="tag-postagem">Saúde</span></i>
                    <h2>{post[0].titulo}</h2>
                    <p>{post[0].conteudo}</p>
                    <div className="info-text-destaque">
                        <i className="bi bi-eye"></i><span className="info">{post[0].views>999 ? post[0].views/1000 + "mil" : post[0].views}</span>
                        <i className="bi bi-chat-dots"></i><span className="info">{comment ? comment.length : '0'}</span>
                        <i className="bi bi-heart"></i><span className="info">{post[0].likes>999 ? post[0].likes/1000 + "mil" : post[0].likes}</span>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    )
}