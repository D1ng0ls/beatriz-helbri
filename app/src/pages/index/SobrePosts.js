import React from "react";

import ImgPerfil from './../../media/pages/index/bia.enc'

export default function SobrePosts() {
    return(
        <div className="container-sobre-posts">
            <div className="container-posts">
                <div className="postagem post1">
                    <div className="img-postagem">
                        <img src="https://www.civitatis.com/blog/wp-content/uploads/2024/01/shutterstock_590390942-1280x853.jpg"/>
                        {/* <i className="tag-destaque">DESTAQUE</i> */}
                    </div>
                    <div className="text-postagem">
                        <i><time datetime='2024-12-17 20:00'>17 de Dez. de 2024</time> <span className="tag-postagem">Saúde</span></i>
                        <h2>Lorem ipsum dolor sit amet.</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore alias quisquam soluta nihil at dolores, neque beatae reiciendis eius voluptate aliquam magni fuga nam quia. Ea architecto cupiditate nesciunt quasi?</p>
                        <div className="info-text-postagem">
                            <i className="bi bi-eye"></i><span className="info">347</span>
                            <i className="bi bi-chat-dots"></i><span className="info">30</span>
                            <i className="bi bi-heart"></i><span className="info">138</span>
                        </div>
                    </div>
                </div>
                <div className="postagem post2">
                    <div className="img-postagem">
                        <img src="https://www.civitatis.com/blog/wp-content/uploads/2024/01/shutterstock_590390942-1280x853.jpg"/>
                        {/* <i className="tag-destaque">DESTAQUE</i> */}
                    </div>
                    <div className="text-postagem">
                        <i><time datetime='2024-12-17 20:00'>17 de Dez. de 2024</time> <span className="tag-postagem">Saúde</span></i>
                        <h2>Lorem ipsum dolor sit amet.</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore alias quisquam soluta nihil at dolores, neque beatae reiciendis eius voluptate aliquam magni fuga nam quia. Ea architecto cupiditate nesciunt quasi?</p>
                        <div className="info-text-postagem">
                            <i className="bi bi-eye"></i><span className="info">347</span>
                            <i className="bi bi-chat-dots"></i><span className="info">30</span>
                            <i className="bi bi-heart"></i><span className="info">138</span>
                        </div>
                        </div>
                    </div>
                <div className="postagem post3">
                    <div className="img-postagem">
                        <img src="https://www.civitatis.com/blog/wp-content/uploads/2024/01/shutterstock_590390942-1280x853.jpg"/>
                        {/* <i className="tag-destaque">DESTAQUE</i> */}
                    </div>
                    <div className="text-postagem">
                        <i><time datetime='2024-12-17 20:00'>17 de Dez. de 2024</time> <span className="tag-postagem">Saúde</span></i>
                        <h2>Lorem ipsum dolor sit amet.</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore alias quisquam soluta nihil at dolores, neque beatae reiciendis eius voluptate aliquam magni fuga nam quia. Ea architecto cupiditate nesciunt quasi?</p>
                        <div className="info-text-postagem">
                            <i className="bi bi-eye"></i><span className="info">347</span>
                            <i className="bi bi-chat-dots"></i><span className="info">30</span>
                            <i className="bi bi-heart"></i><span className="info">138</span>
                        </div>
                    </div>
                </div>
                <a href="?posts=15"><button>Mais posts</button></a>
            </div>
            <div className="container-sobre">
                <div className="sobre">
                    <h2>Sobre mim</h2>
                    <img src={ImgPerfil}/>
                    <h3>Beatriz Helbri</h3>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta enim maxime ipsa debitis eum voluptatibus aperiam officiis cumque facere quod?</p>
                    <a href='/sobre'>Leia mais</a>
                    <div className="follow-sobre">
                        <p>Siga-me nas redes sociais.</p>
                        <div className="sociais-follow-sobre">
                            <i className="bi bi-instagram"></i>
                            <i className="bi bi-youtube"></i>
                            <i className="bi bi-pinterest"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}