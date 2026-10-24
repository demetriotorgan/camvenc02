
import { calcularRecorte } from './geometria.js';

/**
 * Recorta uma região da fotografia original.
 *
 * A geometria calcula as coordenadas.
 * Este módulo executa o recorte e gera um novo Blob.
 */
export async function recortarImagem({
    video,
    moldura,
    imagem
}) {
    // Aguarda a fotografia estar disponível.
    if (!imagem.naturalWidth) {
        await imagem.decode();
    }

    // Calcula a região correspondente à moldura.
    const videoRect = video.getBoundingClientRect();
    const molduraRect = moldura.getBoundingClientRect();

    const coordenadas = calcularRecorte({
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

    const { x, y, largura, altura } = coordenadas;

    // Valida as coordenadas antes de recortar.
    if (
        !Number.isInteger(x) ||
        !Number.isInteger(y) ||
        !Number.isInteger(largura) ||
        !Number.isInteger(altura) ||
        x < 0 ||
        y < 0 ||
        largura <= 0 ||
        altura <= 0 ||
        x + largura > imagem.naturalWidth ||
        y + altura > imagem.naturalHeight
    ) {
        throw new Error(
            'As coordenadas do recorte estão fora dos limites da imagem.'
        );
    }

    // Canvas exclusivo para a imagem recortada.
    const canvasRecorte = document.createElement('canvas');

    canvasRecorte.width = largura;
    canvasRecorte.height = altura;

    const contexto = canvasRecorte.getContext('2d');

    if (!contexto) {
        throw new Error(
            'Não foi possível criar o contexto do Canvas.'
        );
    }

    // Copia somente a região selecionada.
    contexto.drawImage(
        imagem,
        x,
        y,
        largura,
        altura,
        0,
        0,
        largura,
        altura
    );

    // Exporta o resultado como uma nova imagem JPEG.
    const blob = await new Promise((resolve, reject) => {
        canvasRecorte.toBlob(
            resultado => {
                if (resultado) {
                    resolve(resultado);
                } else {
                    reject(
                        new Error('Não foi possível gerar o recorte.')
                    );
                }
            },
            'image/jpeg',
            0.95
        );
    });

    return {
        blob,
        coordenadas,
        largura: canvasRecorte.width,
        altura: canvasRecorte.height
    };
}
