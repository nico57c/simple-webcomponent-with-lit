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
          
          .mini-icon-content {
            font-size: .6em; 
            font-family: monospace; 
            flex-direction: row; 
            justify-content: center; 
            align-items: center; 
            display: flex; 
            flex: 1;
          }
        `;
    }

    static get properties() {
        return {
            src: {type: String},
            size: {type: Number},
            type: {type: String},
            target: {type: String},
            draggable: {type: Boolean}
        };
    }

    constructor() {
        super();
        this.src = undefined;
        this.size = 32;
        this.type =  undefined;
        this.dragging = MiniUtils.dragging;
    }

    render() {
        let classes = {};
        if(this.src === undefined || this.type !== undefined) {
            switch(this.type) {
                default:
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
        } else {
            classes['mini-icon-src'] = true;
        }

        this.style.width = this.size + 'px';
        this.style.height = this.size + 'px';

        let draggableEvent = null
        if(this.draggable === true) {
            draggableEvent = html`
                draggable="true" ondragstart="return false;"
                @mousedown="${this.mouseDown.bind(this)}" @mouseup="${this.mouseUp.bind(this)}" 
            `
        }

        return html`
          <div class="mini-icon ${classMap(classes)}" ${draggableEvent} style="background-image: url('${this.src}');">
              <slot name="content" class="mini-icon-content"></slot>
          </div>
        `;
    }

    mouseDown(event) {
        this.savedZ = this.style.zIndex;
        this.style.zIndex = 999;
        this.dragging(event);
    }

    mouseUp(event) {
        this.style.zIndex = this.savedZ;
    }
}

window.customElements.define('mini-icon', MiniIcon);
