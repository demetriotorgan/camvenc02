
import { CameraCapture } from './CameraCapture.js';
import {mostrarRecorteDiagnostico} from './diagnosticoRecorte.js'
import { recortarImagem } from './recorte.js';

// Elementos da interface
const video = document.querySelector('#video');
const canvas = document.querySelector('#canvas');
const imagemCapturada = document.querySelector('#foto-capturada');
const container = document.querySelector('#camera-container');
const moldura = document.querySelector('#moldura-validade');
const imagemRecortada = document.querySelector('#foto-recortada');


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

        //executa o recorte real
        const resultado = await recortarImagem({
            video,
            moldura,
            imagem: imagemCapturada
        });

        //Libera URL do recorte anterior se existir
        const urlRecorteAnterior = imagemRecortada.dataset.urlFoto;

        if(urlRecorteAnterior){
            URL.revokeObjectURL(urlRecorteAnterior);
        }

        //Exibi nova imagem recortada
        const urlRecorte = URL.createObjectURL(resultado.blob);

        imagemRecortada.src = urlRecorte;
        imagemRecortada.dataset.urlFoto = urlRecorte;
        imagemRecortada.hidden = false;


        console.log('------>Recorte realizado:', {
            coordenadas: resultado.coordenadas,
            largura: resultado.largura,
            altura: resultado.altura,
            tamanho: resultado.blob.size,
            tipo: resultado.blob.type
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
    imagemRecortada.hidden = true;
    const diagnostico = canvasDiagnostico();
    if(diagnostico){
        diagnostico.hidden = true;
    }
});

