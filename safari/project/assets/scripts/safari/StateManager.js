class StateManager{
    constructor(){
        this.m_pCurrentState = null;
        this.m_pPreState = null;
    }

    getCurrentState(){
        return this.m_pCurrentState;
    }

    getPreState(){
        return this.m_pPreState;
    }

    printState(){
        console.log(this.m_pCurrentState.getName());
    }

    setState(){

    }

    update(delta){

    }
}

let instance = new StateManager();

export {instance};