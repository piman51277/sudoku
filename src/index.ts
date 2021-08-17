import Terminal from "./terminal";
import Supervisor from "./supervisor";

const terminal = new Terminal();
terminal.print();
let supervisor;

terminal.on("solve", (board) => {
    supervisor = new Supervisor(board);
    const result = supervisor.solve();
    terminal.disableInput();
    terminal.clear();
    console.log("Solving...")
    if (result != null) {
        terminal.cells = result.cells
        terminal.print();
    } else {
        console.log("Stuck, cannot continue!\nMake sure the puzzle was entered correctly!")
    }
})