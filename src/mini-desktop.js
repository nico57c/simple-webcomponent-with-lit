import {html, css, LitElement} from "lit";
import {classMap} from 'lit/directives/class-map.js';
import {MiniIconShortcut} from './mini-icon-shortcut';

export class MiniDesktop  extends LitElement {

    static get styles() {
        return css`
          :host {
            display: flex;
            flex: 1;
            flex-direction: row;
            cursor: pointer;
            user-select: none;
          }

          .mini-desktop,
          .mini-icons {
            display: flex;
            flex: 1;
            flex-direction: column;
          }
          
          .mini-background-stretch-mosaic {
            background-repeat: repeat;
            background-size: auto;
          }
        `;
    }

    static get properties() {
        return {
            background: {type: String},
            backgroundConfig: {type: Object},
            icons: {type: String}
        };
    }

    constructor() {
        super();
        this.icons = undefined;
        this.background = undefined;
        // stratch : 'mosaic', 'stretch', 'stretch-adjust', 'none'
        this.backgroundConfig = {
            stretch: 'mosaic',
            iconSize: 32,
            iconMargin: 32, // because of shortcut name at bottom of icon... // TODO check if iconMargin needs 2 values : left/right and top/bottom.
            backgroundPadding: 15
        };
    }

    render() {
        let iconsHtml = null;
        const classes = [];

        if(this.icons !== undefined && this.icons !== null) {
            this.icons = this.icons instanceof Array ? this.config : JSON.parse(this.icons);

            let y = this.backgroundConfig.backgroundPadding; let x = this.backgroundConfig.backgroundPadding;
            const config = this.backgroundConfig;

            iconsHtml = this.icons.map((item) => {
                const result = html`
                    <mini-icon-shortcut name="${item.name}" fontSize="8" iconSize="${config.iconSize}" top="${y}" left="${x}">
                        <mini-icon slot="icon" src="${item.src}" size="${config.iconSize}"
                                   type="${item.type}" target="${item.target}">
                        </mini-icon>
                    </mini-icon-shortcut>
                `;

                y += (config.iconSize + config.iconMargin);
                if(y >= (document.documentElement.getBoundingClientRect().height - config.iconSize - config.iconMargin)) {
                    x += (config.iconSize + config.iconMargin);
                    y = 0;
                }

                console.log(y, x);

                return result;
            });
        }

        switch (this.backgroundConfig.stretch) {
            case 'mosaic':
                classes['mini-background-stretch-mosaic'] = true;
            break;
            case 'stretch':
                classes['mini-background-stretch-full'] = true;
            break;
            case 'strech-adjust':
                classes['mini-background-stretch-adjust'] = true;
            break;
            default:
            case undefined:
            case 'none':
                classes['mini-background-stretch-none'] = true;
            break;
        }

        return html`
          <div class="mini-desktop ${classMap(classes)}" style="background-image: url('${this.background}')">
              <slot name="icons" class="mini-desktop-icons"></slot>
              ${iconsHtml}
          </div>
        `;
    }
}

window.customElements.define('mini-desktop', MiniDesktop);
