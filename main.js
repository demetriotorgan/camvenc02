
import { CameraCapture } from './CameraCapture.js';
import {mostrarRecorteDiagnostico} from './diagnosticoRecorte.js'

// Elementos da interface
const video = document.querySelector('#video');
const canvas = document.querySelector('#canvas');
const imagemCapturada = document.querySelector('#foto-capturada');
const container = document.querySelector('#camera-container');
const moldura = document.querySelector('#moldura-validade');


// Inicializa a câmera
const camera = new CameraCapture({ video, canvas });

// Botão: abrir câmera
document.querySelector('#abrirCamera').addEventListener('click', async () => {
    try {
        await camera.abrirCamera();        
        container.classList.add('camera-ativa');        
    } catch (error) {
        console.error('Erro ao abrir câmera:', error);
    }
});

// Botão: capturar fotografia
document.querySelector('#btn-capturar').addEventListener('click', async () => {
    try {
        const foto = await camera.capturarFoto();

        const urlAnterior = imagemCapturada.dataset.urlFoto;

        if (urlAnterior) {
            URL.revokeObjectURL(urlAnterior);
        }

        const urlFoto = URL.createObjectURL(foto);

        imagemCapturada.src = urlFoto;
        imagemCapturada.dataset.urlFoto = urlFoto;
        imagemCapturada.hidden = false;

        await mostrarRecorteDiagnostico({
            video,
            moldura,
            imagem: imagemCapturada
        });        

    } catch (error) {
        console.error('Erro na captura:', error);
    }
});

const canvasDiagnostico = () =>
    document.querySelector('#canvas-diagnostico');

// Botão: encerrar câmera
document.querySelector('#btn-encerrar').addEventListener('click', () => {
    camera.encerrarCamera();
    container.classList.remove('camera-ativa');
    imagemCapturada.hidden = true;
    const diagnostico = canvasDiagnostico();
    if(diagnostico){
        diagnostico.hidden = true;
    }
});

