class MessageTracker {
    constructor(limit) {
        this.limit = limit ?? 100;
        this.trackedMsgs = new Map();
    }

    addMsg(msg, trigger_id) {
        if(this.trackedMsgs.size >= this.trackLimit) {
            const [key] = this.trackedMsgs.keys();
            this.trackedMsgs.delete(key);
        }
    
        this.trackedMsgs.set(trigger_id, msg);
    }
    
    deleteMsg(trigger_id) {
        const sentMsg = this.trackedMsgs.get(trigger_id);
        
        if(typeof sentMsg === "undefined") {
            return;
        }
    
        return sentMsg;
    }

    getMsg(trigger_id) {
        return this.trackedMsgs.get(trigger_id) ?? false;
    }
}

export default MessageTracker;