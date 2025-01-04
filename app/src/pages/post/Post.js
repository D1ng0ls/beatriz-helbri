import React from "react";

import Content from "./Content"
import Recommended from "./Recommended";
import Comment from "./Comment";

export default function Post() {
    return (
        <main>
            <Content/>
            <Recommended/>
            <Comment/>
        </main>
    )
}

