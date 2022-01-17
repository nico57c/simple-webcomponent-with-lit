import {LitElement, html, css} from 'lit';
//import * as moment from 'moment';
import moment from 'moment/dist/moment.js';

/**
 * Mini Taskbar inside web page
 * @slot Start menu with list of 'app/tasks'
 */
export class MiniClock extends LitElement {

    static get styles() {
        return css`
      :host {
        display: flex;
        flex: 1;
        align-items: center;
        cursor: pointer;
        user-select: none;
      }
          
      .mini-clock {
        width: 5em;
        display: flex;
        flex-direction: column;
        font-family: monospace;
        align-items: center;
      }
          
      .mini-clock-time {
        display: flex;
        flex-direction: row;
        font-size: 1em;
        text-align: center;
        align-items: center;
      }
          
      .mini-clock-date {
        display: flex;
        flex-direction: row;
        font-size: .8em;
        text-align: center;
        align-items: center;
      }
    `;
    }

    static get properties() {
        return {
            timerender: {type: Function},
            daterender: {type: Function},
            timeformat: {type: String},
            dateformat: {type: String},
        };
    }

    constructor() {
        super();
        this.timer = undefined;
        this.timeformat = 'HH:mm:ss';
        this.dateformat = 'dddd Y-MM-D';
    }

    render() {
        this.startTimer();
        return html`
          <div class="mini-clock">
              <div class="mini-clock-time">${this.time}</div>
              <div class="mini-clock-date">${this.date}</div>
          </div>
        `;
    }

    startTimer() {
        if(this.timer !== undefined) return;

        this.timer = setInterval(() => {
            if(this.timerender !== undefined) {
                this.time = this.timerender(moment());
            } else {
                this.time = moment().format(this.timeformat);
            }

            if(this.daterender !== undefined) {
                this.date = this.daterender(moment());
            } else {
                this.date = moment().format(this.dateformat);
            }

            this.requestUpdate();
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }
}

window.customElements.define('mini-clock', MiniClock);
