import {LitElement, html, css} from 'lit';

/**
 * Mini TaskTray inside web page
 */
export class MiniTasktray extends LitElement {

    static get styles() {
        return css`
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
      <div class="mini-tasktray"></div>
    `;
    }
}

window.customElements.define('mini-tasktray', MiniTasktray);
