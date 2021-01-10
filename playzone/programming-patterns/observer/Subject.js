// https://webdevstudios.com/2019/02/19/observable-pattern-in-javascript/

class Subject {
    constructor() {
        this.observers = [];
    }

    // Add an observer to this.observers.
    addObserver(observer) {
        this.observers.push(observer);
    }

    // Remove an observer from this.observers.
    removeObserver(observer) {
        const removeIndex = this.observers.findIndex((obs) => {
            return observer === obs;
        });

        if (removeIndex !== -1) {
            this.observers = this.observers.slice(removeIndex, 1);
        }
    }

    // Loops over this.observers and calls the update method on each observer.
    // The state object will call this method everytime it is updated.
    notify(data) {
        if (this.observers.length > 0) {
            this.observers.forEach((observer) => observer.update(data));
        }
    }
}

export default Subject;
