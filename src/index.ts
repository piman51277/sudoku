import Terminal from "./terminal";
import Supervisor from "./supervisor";

const terminal = new Terminal();
terminal.print();
let supervisor;

terminal.on("solve",(board)=>{
    supervisor = new Supervisor(board);
    const result = supervisor.solve();
    if(result != null){
        console.log("solved!")
    }else{
        console.log("stuck!")
    }
})