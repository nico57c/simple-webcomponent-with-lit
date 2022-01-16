
export class MiniUtils {

    /**
     * Query One slot with a name
     * @param {string} name
     * @param {LitElement} element
     */
    static queryOneSlot(name, element) {
        return element.renderRoot.querySelector(`slot[name=${name}]`);
    }

    /**
     * Query All slot with a name
     * @param {string} name
     * @param {LitElement} element
     */
    static queryAllSlot(name, element) {
        return element.renderRoot.querySelectorAll(`slot[name=${name}]`);
    }

}


