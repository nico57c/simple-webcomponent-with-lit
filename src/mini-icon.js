import {LitElement, html, css} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {MiniUtils} from "./mini-utils";

/**
 * Mini Taskbar inside web page
 * @slot Start menu with list of 'app/tasks'
 */
export class MiniIcon extends LitElement {

    static get styles() {
        return css`
          :host {
            display: flex;
            position: absolute;
            cursor: pointer;
            user-select: none;
          }

          .mini-icon {
            display: flex;
            flex: 1;
          }

          .mini-icon-file {
            margin: 0 10%;
            background-color: white;
            border: 2px solid black;
            color: black;
            clip-path: view-box polygon(0 0, 0 100%, 100% 100%, 100% 30%, 70% 0);
          }

          .mini-icon-file:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            background-color: black;
            width: calc(30% + 2px);
            height: calc(30% + 0px);
          }

          .mini-icon-directory {
            margin: 10% 10% 15%;
            background-color: white;
            border: 2px solid black;
            color: black;
            clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 20%, 35% 20%, 25% 0);
          }

          .mini-icon-directory:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            background-color: black;
            width: 72%;
            height: calc(20% + 5% + 2px);
          }

          .mini-icon-shortcut {
            margin: 0 10%;
            background-color: white;
            border: 2px solid black;
          }
          
          .mini-icon-shortcut:before {
            position: absolute;
            bottom: -.2em;
            font-family: monospace;
            font-weight: bold;
            content: '»';
            font-size: 1.8em;
            vertical-align: bottom;
          }
        `;
    }

    static get properties() {
        return {
            src: {type: String},
            size: {type: Number},
            type: {type: String}
        };
    }

    constructor() {
        super();
        this.src = undefined;
        this.size = 32;
        this.type = 'file';
        this.dragging = MiniUtils.dragging;
    }

    render() {
        let classes = {};
        if(this.src === undefined) {
            switch(this.type) {
                case 'file':
                    classes['mini-icon-file'] = true;
                break;
                case 'directory':
                    classes['mini-icon-directory'] = true;
                break;
                case 'shortcut':
                    classes['mini-icon-shortcut'] = true;
                break;
            }
        }

        this.style.width = this.size + 'px';
        this.style.height = this.size + 'px';

        return html`
          <div class="mini-icon ${classMap(classes)}" draggable="true" ondragstart="return false;" @mousedown=${this.dragging.bind(this)}></div>
        `;
    }

}

window.customElements.define('mini-icon', MiniIcon);
