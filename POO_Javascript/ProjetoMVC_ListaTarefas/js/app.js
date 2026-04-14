// Adicionar imports

import { TarefaController } from "./Controller/TarefaController.js";
import { TarefaModel } from "./Model/TarefaModel.js";
import { TarefaView } from "./View/TarefaView.js";

const model = new TarefaModel();
const view = new TarefaView();
const controller = new TarefaController(model, view);

controller.init(); // Inicia o sistema
