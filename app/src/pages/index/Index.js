import React from "react";
import Home from './Home'
import Destaque from "./Destaque";
import SobrePosts from "./SobrePosts";

export default function Index() {
    return (
        <main>
            <Home/>
            <Destaque/>
            <SobrePosts/>
        </main>
    )
}