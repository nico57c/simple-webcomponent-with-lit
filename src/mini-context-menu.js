import {LitElement, html, css} from 'lit';
import {MiniStore} from "./mini-store";

/**
 * Mini ContextMenu
 * @slot items
 */
export class MiniContextMenu extends LitElement {

    static get styles() {
        return css`
      :host {
        display: flex;
        position: absolute;
        cursor: pointer;
        user-select: none;
        background-color: white;
      }
      
      .mini-context-menu {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 5px;
        background-color: white;
        border: 1px solid black;
      }
      
      .mini-context-menu-item,
      .mini-context-menu-spacer {
        display: flex;
        flex-direction: row;
        line-height: 1.2em;
        font-size: 1em;
        padding: 4px;
        background-color: white;
      }

      .mini-context-menu-spacer {
        height: 1.2em;
      } 
          
      .mini-context-menu-item:hover {
        background-color: #EEE;
      }
      
      .mini-context-menu-separator {
        border-bottom: 2px solid black;
        margin-bottom: 5px;
        margin-top: 5px;
      }

    `;
    }

    static get properties() {
        return {
            items: {type: String} // JSON
        };
    }

    constructor() {
        super();
        this.items = undefined;
    }

    render() {

        const that = this;
        window.addEventListener('contextmenu', this.onRightClick.bind(this));
        window.addEventListener('click', this.onRightClick.bind(this))

        this.style.display = 'none';

        let itemsHtml = null;
        if(this.items !== undefined) {
            const items = JSON.parse(this.items);
            itemsHtml = [];
            items.forEach(item => {
                switch(item.type) {
                    case 'link':
                        itemsHtml.push(html`
                            <div class="mini-context-menu-item" @click="${this.itemClick.bind(this)}"
                                 itemId="${item.id}">${item.name}
                            </div>
                        `)
                        break;
                    case 'separator':
                        itemsHtml.push(html`
                            <div class="mini-context-menu-separator"></div>
                        `)
                        break;
                    case 'spacer':
                        itemsHtml.push(html`
                            <div class="mini-context-menu-spacer"></div>
                        `)
                        break;
                }
            });
        }

        return html`
          <div class="mini-context-menu">
              ${itemsHtml}
          </div>
    `;
    }

    itemClick(event) {
        this.style.display = 'none';
        MINI.store.sendMessage('CONTEXT_ITEM_CLICK', event.target.getAttribute('itemId'));
    }

    onRightClick(event) {
        event.preventDefault();
        if(event.button === 2){
            this.style.display = 'flex';
            this.style.top = event.clientY + 'px';
            this.style.left = event.clientX + 'px';
        } else {
            this.style.display = 'none';
        }
        return false;
    }
}

window.customElements.define('mini-context-menu', MiniContextMenu);
