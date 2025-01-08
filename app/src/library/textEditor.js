import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default class TextEditor extends Component {
    constructor(props) {
        super(props);

        const html = props.value || '';
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);

        this.state = {
        editorState,
        };
    }

    onEditorStateChange = (editorState) => {
        this.setState({ editorState });
        
        if (this.props.onChange) {
            this.props.onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        }
    };

    render() {
        const { editorState } = this.state;

        return (
        <div>
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    options: ['inline', 'emoji', 'blockType', 'fontSize', 'colorPicker', 'list', 'textAlign', 'link', 'history'],
                    inline: {
                        options: ["bold", "italic", "underline", "strikethrough", "superscript", "subscript",],
                    },
                    emoji: {
                        emojis: [
                            '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                            '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                            '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                            '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                            '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                            '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                            '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                            '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                            '✅', '❎', '💯',
                        ],
                    },
                    blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                    },
                    fontSize: {
                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 32],
                    },
                    colorPicker: {
                        colors: [
                        "#2E2E2E", "#525252", // Preto escuro e claro
                            "#93C97D", "#C6E3B0", // Verde escuro e claro
                            "#7FA9C6", "#A3CAE3", // Azul escuro e claro
                            "#A282C0", "#C6A8DC", // Roxo escuro e claro
                            "#EB7F91", "#F3A1AF", // Rosa escuro e claro
                            "#E6CD70", "#F6E6A5", // Amarelo escuro e claro
                            "#E08A54", "#F0B27C", // Laranja escuro e claro
                            "#B1A59F", "#D3CCC9", // Cinza quente escuro e claro
                            "#9A3F29", "#D08A6C", // Marrom escuro e claro

                        ],
                    },
                    list: {
                        inDropdown: true,
                    },
                    textAlign: {
                        inDropdown: true,
                    },
                    link: {
                        inDropdown: false,
                        defaultTargetOption: '_blank',
                        options: ['link', 'unlink'],
                    },
                }}
            />
        </div>
        );
    }
}