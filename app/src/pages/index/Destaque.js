import React from "react";

export default function Destaque() {
    return(
        <div className="container-destaque">
            <div className="destaque">
                <div className="img-destaque">
                    <img src="https://www.civitatis.com/blog/wp-content/uploads/2024/01/shutterstock_590390942-1280x853.jpg"/>
                    {/* <i className="tag-destaque">DESTAQUE</i> */}
                </div>
                <div className="text-destaque">
                    <i><time datetime='2024-12-17 20:00'>17 de Dez. de 2024</time> <span className="tag-postagem">Saúde</span></i>
                    <h2>Lorem ipsum dolor sit amet.</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore alias quisquam soluta nihil at dolores, neque beatae reiciendis eius voluptate aliquam magni fuga nam quia. Ea architecto cupiditate nesciunt quasi?</p>
                    <div className="info-text-destaque">
                        <i className="bi bi-eye"></i><span className="info">347</span>
                        <i className="bi bi-chat-dots"></i><span className="info">30</span>
                        <i className="bi bi-heart"></i><span className="info">138</span>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    )
}