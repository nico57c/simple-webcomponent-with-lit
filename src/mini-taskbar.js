// noinspection JSSuspiciousNameCombination

import {LitElement, html, css} from 'lit';

/**
 * Mini Taskbar inside web page
 * @slot Start menu with list of 'app/tasks'
 */
export class MiniTaskbar extends LitElement {

    static get styles() {
        return css`
      :host {
        display: flex;
        position: absolute;
        pading: 0;
        margin: 0;
      }
      
      .mini-taskbar {
        display: flex;
        flex: 1;
        flex-direction: row;
        background-color: red;
      }
    `;
    }

    static get properties() {
        return {
            start: {type: String},
            alignment: {type: String},
            width: {type: String},
            height: {type: String}
        };
    }

    constructor() {
        super();
    }

    render() {

        this.width = this.width ? this.width : '100%';
        this.height = this.height ? this.height : '40px';

        const tmpWidth = this.width;
        const tmpHeight = this.height;

        switch (this.alignment) {
            default:
            case 'top':
                this.alignment = 'top';
                this.style.top = '0px';
                this.style.width = tmpWidth;
                this.style.height = tmpHeight;
            break;
            case 'bottom':
                this.style.bottom = '-' + tmpHeight;
                this.style.width = tmpWidth;
                this.style.height = tmpHeight;
            break;
            case 'left':
                this.style.left = '0px';
                this.style.width = tmpHeight;
                this.style.height = tmpWidth;
            break;
            case 'right':
                this.style.right = '-' + tmpHeight;
                this.style.width = tmpHeight;
                this.style.height = tmpWidth;
            break;
        }

        return html`
      <div class="mini-taskbar">
          <slot name="start"></slot>
      </div>
    `;
    }
}

window.customElements.define('mini-taskbar', MiniTaskbar);
