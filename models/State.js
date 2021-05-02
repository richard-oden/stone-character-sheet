class State {
    constructor(name, isActive, activate, deactivate) {
        this.name = name,
        this.isActive = isActive,
        this.activate = activate,
        this.deactivate = deactivate
    }
}

module.exports = State;