import {LitElement, html, css} from 'lit';

/**
 * Mini StartMenu inside web page
 * @slot shortcuts
 * @slot items
 * @slot favorites
 */
export class MiniStartMenu extends LitElement {

    static get styles() {
        return css`
      :host {
        display: flex;
        cursor: pointer;
        user-select: none;
        background-color: white;
      }
      
      .mini-start-menu {
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 15rem;
        padding: 5px;
        border: 1px solid black;
      }
    `;
    }

    static get properties() {
        return {
        };
    }

    constructor() {
        super();
    }

    render() {
        return html`
      <div class="mini-start-menu">
          <slot name="shortcuts" class="mini-start-menu-shortcuts"></slot>
          <slot name="items" class="mini-start-menu-items"></slot>
          <slot name="favorites" class="mini-start-menu-favorites"></slot>
      </div>
    `;
    }
}

window.customElements.define('mini-start-menu', MiniStartMenu);
