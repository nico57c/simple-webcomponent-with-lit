import {Subject} from 'rxjs';

export class MiniStore {
    /**
     * Instance of miniStore for Singleton pattern
     * @type {MiniStore}
     * @static
     * @private
     */
    static miniStoreInstance = null;

    /**
     * Private constructor for singleton pattern
     * @private
     */
    constructor() {
        /**
         * Services
         * @type {Array<{id: Number, name: String, instance: any}>}
         * @private
         */
        this.services = [];

        /**
         * Messages
         * @type {Array<{id: String, subject: Subject}>}
         * @private
         */
        this.messages = [];
    }

    /**
     * getInstance
     * @returns {MiniStore}
     * @static
     * @private
     */
    static getInstance() {
        if(MiniStore.miniStoreInstance === null) {
            MiniStore.miniStoreInstance = new MiniStore();
        }
        return MiniStore.miniStoreInstance;
    }

    /**
     * AddService instance to store
     * @param instance
     * @returns {number}
     * @public
     */
    addService(instance) {
        const id = this.services.push({
            id: null,
            name: instance.constructor.name,
            instance: instance
        });
        this.services[id-1].id = id;
        return id;
    }

    /**
     * getService from store
     * @param {string|InstanceType} name
     * @returns {{id: Number, name: String, instance: *}}
     * @public
     */
    getService(name) {
        return this.services.find(value =>
            (name instanceof InstanceType && value.instance instanceof name) ||
            (name instanceof String && value.name === name)
        );
    }

    /**
     * deleteService in store.
     * @param {string|InstanceType} name
     * @public
     */
    deleteService(name) {
        const id = this.services.find(value =>
            (name instanceof InstanceType && value.instance instanceof name) ||
            (name instanceof String && value.name === name)
        );
        this.services.splice(id, 1);
    }

    /**
     * Send a message with a content
     * @param {string} messageId
     * @param {*} messageContent
     * @returns {boolean}
     */
    sendMessage(messageId, messageContent) {
        const message = this.messages.find(value => value.id === messageId);
        if(message === undefined) {
            return false;
        }
        message.subject.next(messageContent);
        return true;
    }

    /**
     * Destroy message in/out, all subscribtions are destroyed and Subject object will be delete from messages array.
     * @param {string} messageId
     * @returns {boolean}
     */
    destroyMessage(messageId) {
        const messageI = this.messages.findIndex(value => value.id === messageId);
        if(messageI === undefined) {
            return false;
        }
        this.messages[messageI].subject.unsubscribe();
        this.messages.splice(messageI, 1);
        return true;
    }

    /**
     * Return Subject object associated to messageId for subscription.
     * @param {string} messageId
     * @returns {Subject}
     */
    subscribeToMessage(messageId) {
        let messageI;
        if( ( messageI = this.messages.findIndex((value => value.id === messageId)) ) === undefined) {
            this.messages.push({
                id: messageId,
                subject: new Subject()
            });
        }
        return this.messages[messageI].subject;
    }
}
