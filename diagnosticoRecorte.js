import { calcularRecorte } from './geometria.js';

// ----Função que exibi retangulo de corte ----

export async function mostrarRecorteDiagnostico({video, moldura, imagem}) {
    if (!imagem.naturalWidth) {
        await imagem.decode();
    }

    const videoRect = video.getBoundingClientRect();
    const molduraRect = moldura.getBoundingClientRect();

    const recorte = calcularRecorte({
        video: {
            esquerda: videoRect.left,
            topo: videoRect.top,
            largura: videoRect.width,
            altura: videoRect.height
        },

        moldura: {
            esquerda: molduraRect.left,
            topo: molduraRect.top,
            largura: molduraRect.width,
            altura: molduraRect.height
        },

        imagem: {
            largura: imagem.naturalWidth,
            altura: imagem.naturalHeight
        }
    });

    // Cria um canvas exclusivo para o diagnóstico.
    let canvasDiagnostico =
        document.querySelector('#canvas-diagnostico');

    if (!canvasDiagnostico) {
        canvasDiagnostico = document.createElement('canvas');
        canvasDiagnostico.id = 'canvas-diagnostico';

        Object.assign(canvasDiagnostico.style, {
            display: 'block',
            width: '100%',
            maxWidth: '640px',
            height: 'auto',
            margin: '12px auto',
            border: '1px solid #2373F4'
        });

        imagem.insertAdjacentElement(
            'afterend',
            canvasDiagnostico
        );
    }

    // Mantém a resolução original da fotografia.
    canvasDiagnostico.width = imagem.naturalWidth;
    canvasDiagnostico.height = imagem.naturalHeight;

    const contexto = canvasDiagnostico.getContext('2d');

    // Desenha a fotografia sem modificar o arquivo original.
    contexto.drawImage(
        imagem,
        0,
        0,
        canvasDiagnostico.width,
        canvasDiagnostico.height
    );

    // Desenha o retângulo calculado sobre a cópia.
    contexto.strokeStyle = '#00FF00';
    contexto.lineWidth = Math.max(
        3,
        Math.round(canvasDiagnostico.width / 300)
    );

    contexto.strokeRect(
        recorte.x,
        recorte.y,
        recorte.largura,
        recorte.altura
    );

    console.log('Recorte visual de diagnóstico:', recorte);
}