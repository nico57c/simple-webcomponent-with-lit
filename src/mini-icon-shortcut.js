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
            iconSize: {type: Number},
            top: {type: Number},
            left: {type: Number},
            color: {type: String}
        };
    }

    constructor() {
        super();
        this.name = '';
        this.fontSize = '4';
        this.dragging = MiniUtils.dragging;
        this.color = 'black';
    }

    render() {
        this.style.fontSize = this.fontSize + 'px';
        this.style.width = (this.iconSize*1.5) + 'px';
        this.style.height = (this.iconSize + (this.fontSize*1.8)) + 'px';
        if(this.top !== undefined) this.style.top = (this.offsetTop + this.top) + 'px';
        if(this.left !== undefined) this.style.left = (this.offsetLeft + this.left) + 'px';
        this.style.color = this.color;

        return html`
          <div class="mini-icon-shortcut" draggable="true" ondragstart="return false;" 
               @mousedown="${this.mouseDown.bind(this)}" @mouseup="${this.mouseUp.bind(this)}">
              <slot name="icon"></slot>
              <div class="mini-icon-shortcut-name"  @mouseenter="${this.mouseOver.bind(this)}" @mouseout="${this.mouseOut.bind(this)}"
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

    mouseOut(event) {
        clearTimeout(this.waitingOnTooltip);
    }

    mouseOver(event) {
        this.waitingOnTooltip = setTimeout(() => {
            MiniUtils.tooltip(this.name, event.clientX, event.clientY, 2000);
        }, 1500);
    }
}

window.customElements.define('mini-icon-shortcut', MiniIconShortcut);
