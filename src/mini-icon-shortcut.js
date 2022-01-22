import {html, css, LitElement} from "lit";
import {MiniIcon} from './mini-icon';
import {MiniUtils} from "./mini-utils";

export class MiniIconShortcut  extends LitElement {

    static get styles() {
        return css`
          :host {
            display: flex;
            position: absolute;
            flex-direction: column;
            flex-basis: content;
            cursor: pointer;
            user-select: none;
            overflow: hidden;
          }

          .mini-icon-shortcut {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: center;
            justify-items: center;
          }
          
          .mini-icon-shortcut-name {
            color: black;
            margin-top: auto;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
            text-align: left;
          }
          
          .mini-icon-shortcut-name:hover {
            text-decoration: underline;
            color: #008;
          }
        `;
    }

    static get properties() {
        return {
            name: {type: String},
            fontSize: {type: Number},
            iconSize: {type: Number}
        };
    }

    constructor() {
        super();
        this.name = '';
        this.fontSize = '4';
        this.dragging = MiniUtils.dragging;
    }

    render() {
        this.style.fontSize = this.fontSize + 'px';
        this.style.width = (this.iconSize*1.5) + 'px';
        this.style.height = (this.iconSize + (this.fontSize*1.8)) + 'px';

        return html`
          <div class="mini-icon-shortcut" draggable="true" ondragstart="return false;" 
               @mousedown="${this.mouseDown.bind(this)}" @mouseup="${this.mouseUp.bind(this)}">
              <slot name="icon"></slot>
              <div class="mini-icon-shortcut-name"
                   style="height: ${(this.fontSize*1.8) + 'px'}; line-height: ${(this.fontSize*1.8) + 'px'}; font-size: ${this.fontSize + 'px'}">
                  ${this.name}
              </div>
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

window.customElements.define('mini-icon-shortcut', MiniIconShortcut);
