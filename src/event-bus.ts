import EventEmitter from "events";
import { properties } from "./properties.js";

class EventBus {
    private readonly eventEmitter = new EventEmitter()
    private readonly map = new Map<string, {timeoutCallback: () => any}>()
     

    public on(event: string, callback: any, timeoutCallback?: () => void): Date {
        this.eventEmitter.on(event, callback)
        if(timeoutCallback !== undefined)
            this.map.set(event, { timeoutCallback: timeoutCallback })
        const delay = properties.buttonExpiration
        const date = new Date(Date.now())
        date.setSeconds(date.getSeconds() + delay)
        setTimeout(() => this.timeoutFunction(event), delay * 1000)
        return date
    }

    public emit(event: string, ...args: any[]): boolean {
        return this.eventEmitter.emit(event, ...args)
    }

    private timeoutFunction(event: string) {
        this.eventEmitter.removeAllListeners(event)
        const callback = this.map.get(event)
        if(callback !== undefined) {
            this.map.delete(event)
            callback.timeoutCallback.apply(undefined)
        }
    }
}

export const eventBus = new EventBus()