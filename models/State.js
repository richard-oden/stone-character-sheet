class State {
    constructor(name, isActive, activate, deactivate) {
        this.name = name;
        this.isActive = isActive;
        this._activate = activate;
        this._deactivate = deactivate;
        this.toggle = () => {
            if (this.isActive) {
                this._deactivate();
                this.isActive = false;
            } else {
                this._activate();
                this.isActive = true;
            }
        }
    }
}

module.exports = State;