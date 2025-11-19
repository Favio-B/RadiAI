const API_KEY = 'AIzaSyCe3Q8_QuLykEcLDNIwGsayFCgxq4k3MT4';

const fileInput = document.getElementById('imagen');
const imagePreview = document.getElementById('imagePreview');
const previewContainer = document.getElementById('previewContainer');
const uploadArea = document.getElementById('uploadArea');
const btnRemove = document.getElementById('btnRemove');
const resultsSection = document.getElementById('resultsSection');
const btnAnalyze = document.getElementById('btnAnalyze');

// Función para scroll suave automático
function scrollToResults() {
    setTimeout(() => {
        resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);
}

// Previsualización de imagen
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.style.display = 'block';
            uploadArea.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Botón para cambiar imagen
btnRemove.addEventListener('click', function() {
    fileInput.value = '';
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'block';
    resultsSection.style.display = 'none';
});

// Envío del formulario
document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault();
    const file = fileInput.files[0];
    if (!file) return;

    btnAnalyze.disabled = true;
    btnAnalyze.textContent = '⏳ Analizando...';

    resultsSection.style.display = 'block';
    document.getElementById('resultado').innerHTML = '<p style="color: #C8DDE7; text-align: center;">⏳ Procesando imagen con IA médica avanzada...</p>';
    
    scrollToResults();

    const reader = new FileReader();
    reader.onload = async function(e) {
        const img = new Image();
        img.onload = async function() {
            if (img.width < 600 || img.height < 600) {
                document.getElementById('resultado').innerHTML = 
                    '<div style="text-align: center; padding: 2rem;">' +
                    '<div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>' +
                    '<h3 style="color: #C8DDE7;">Imagen demasiado pequeña</h3>' +
                    '<p style="color: #F2F3F4;">Resolución detectada: ' + img.width + 'x' + img.height + 'px</p>' +
                    '<p style="color: #F2F3F4;">Mínimo requerido: 600x600px</p>' +
                    '<p style="margin-top: 1rem; color: #C8DDE7;"><strong>Usa una radiografía de mayor resolución.</strong></p>' +
                    '</div>';
                btnAnalyze.disabled = false;
                btnAnalyze.textContent = '🔍 Analizar Radiografía';
                return;
            }
            
            document.getElementById('resultado').innerHTML = '<p style="color: #C8DDE7; text-align: center;">⏳ Identificando estructuras óseas y posibles fracturas...</p>';
            
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let maxDim = 2048; // Aumentado para mejor calidad
            let width = img.width;
            let height = img.height;
            
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = (height / width) * maxDim;
                    width = maxDim;
                } else {
                    width = (width / height) * maxDim;
                    height = maxDim;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const optimizedImage = canvas.toDataURL('image/jpeg', 0.97); // Mayor calidad
            const base64Image = optimizedImage.split(',')[1];
            
            await analizarImagen(base64Image, 'image/jpeg');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

async function analizarImagen(base64Image, mimeType) {
    // Prompt optimizado para detección de fracturas
    const medicalPrompt = `Eres un sistema experto en análisis radiológico especializado en detección de fracturas y lesiones óseas. Analiza esta radiografía SOLO si es una imagen médica válida.

Si la imagen NO es una radiografía médica real, tiene calidad inadecuada, está muy borrosa o no puedes identificar estructuras óseas, responde:

**IMAGEN NO VÁLIDA**
Razón: [especifica: no es radiografía / calidad insuficiente / estructuras no identificables]

Si SÍ puedes analizar la imagen, proporciona un reporte estructurado siguiendo EXACTAMENTE este formato:

**IDENTIFICACIÓN ANATÓMICA:**
[Identifica con precisión: 1) Región del cuerpo (mano, pie, antebrazo, pierna, tórax, cráneo, columna), 2) Lateralidad (derecha/izquierda/bilateral), 3) Estructuras óseas específicas visibles con nomenclatura anatómica exacta. Ejemplo: "Radiografía de mano derecha. Se visualizan los cinco huesos metacarpianos (I-V), falanges proximales, mediales y distales, huesos del carpo, articulaciones metacarpofalángicas e interfalángicas"]

**DIAGNÓSTICO:**
[Describe hallazgos patológicos con MÁXIMA ESPECIFICIDAD sobre fracturas o lesiones:
- Si hay FRACTURA: especifica tipo (transversal/oblicua/espiral/conminuta), localización exacta (tercio proximal/medio/distal), hueso específico, presencia de desplazamiento, angulación o fragmentos
- Si NO hay fractura: indica claramente "No se identifican fracturas, fisuras, luxaciones ni lesiones óseas agudas. Estructuras óseas íntegras"
- Menciona también: luxaciones, calcificaciones anormales, erosiones, osteopenia, cuerpos extraños
Máximo 2 oraciones, pero DETALLADAS]

**NIVEL DE CONFIANZA:** [X]%
[Indica tu certeza diagnóstica del 0-100%:
- 90-100%: Estructuras muy claras, imagen de excelente calidad
- 70-89%: Buena visualización con confianza alta
- 50-69%: Calidad aceptable pero con limitaciones
- 0-49%: Imagen ambigua, requiere estudios adicionales]

**OBSERVACIONES:**
[Menciona: calidad técnica de la imagen, tejidos blandos, espacios articulares, densidad ósea, hallazgos incidentales. Máximo 1-2 oraciones o "Sin observaciones adicionales"]

INSTRUCCIONES CRÍTICAS:
- Usa terminología médica precisa y profesional
- Para fracturas, SIEMPRE especifica: tipo, localización anatómica exacta, grado de desplazamiento
- Si hay duda sobre fractura, menciona diagnósticos diferenciales
- Sé conservador: si no estás seguro de una fractura, baja el nivel de confianza

⚠️ ADVERTENCIA: Este análisis automatizado es solo para fines educativos y de investigación. NO sustituye la evaluación de un radiólogo certificado. Todo hallazgo requiere confirmación clínica.`;

    try {
        console.log('🔍 Iniciando análisis con Gemini 2.0 Flash (modelo médico optimizado)...');
        console.log('📊 Tamaño de imagen:', (base64Image.length / 1024).toFixed(2), 'KB');
        
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
            {
                method: 'POST',
                headers: {
                    'x-goog-api-key': API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: base64Image
                                }
                            },
                            {
                                text: medicalPrompt
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.2,  // Muy bajo para máxima precisión diagnóstica
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                        candidateCount: 1
                    },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                    ]
                })
            }
        );
        
        console.log('📡 Status HTTP:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const responseText = await response.text();
        console.log('📄 Respuesta recibida (primeros 200 caracteres):', responseText.substring(0, 200));
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('❌ Error parseando JSON:', e);
            throw new Error('Respuesta inválida del servidor');
        }
        
        console.log('✅ JSON parseado correctamente');
        
        if (result.error) {
            console.error('❌ Error de API:', result.error);
            
            let errorMsg = result.error.message;
            let errorCode = result.error.code || 'N/A';
            let suggestion = '';
            
            if (errorMsg.includes('API key') || errorMsg.includes('API_KEY_INVALID')) {
                suggestion = '<div style="background: rgba(168, 211, 227, 0.1); padding: 1rem; margin-top: 1rem; border-radius: 4px;"><strong>Solución:</strong><ol style="margin-top: 0.5rem; line-height: 1.8;"><li>Ve a <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #C8DDE7;">Google AI Studio</a></li><li>Crea o copia tu API key</li><li>Reemplaza la clave en el código</li></ol></div>';
            } else if (errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
                suggestion = '<div style="background: rgba(168, 211, 227, 0.1); padding: 1rem; margin-top: 1rem; border-radius: 4px;"><strong>Solución:</strong> Has excedido tu cuota gratuita. Espera 24 horas o actualiza tu plan en Google AI Studio.</div>';
            } else if (errorMsg.includes('SAFETY') || errorMsg.includes('blocked')) {
                suggestion = '<div style="background: rgba(168, 211, 227, 0.1); padding: 1rem; margin-top: 1rem; border-radius: 4px;"><strong>Solución:</strong> La imagen fue bloqueada por filtros de seguridad. Intenta con otra radiografía.</div>';
            }
            
            document.getElementById('resultado').innerHTML = 
                `<div style="background: rgba(200, 221, 231, 0.1); padding: 1.5rem; border-left: 4px solid #C8DDE7; border-radius: 4px;">
                    <h3 style="color: #C8DDE7; margin-top: 0;">❌ Error de API</h3>
                    <p style="color: #F2F3F4;"><strong>Código:</strong> ${errorCode}</p>
                    <p style="color: #F2F3F4;"><strong>Mensaje:</strong> ${errorMsg}</p>
                    ${suggestion}
                </div>`;
            return;
        }
        
        if (!result.candidates || result.candidates.length === 0) {
            console.warn('⚠️ No se generaron candidatos de respuesta');
            document.getElementById('resultado').innerHTML = 
                `<div style="background: rgba(168, 211, 227, 0.1); padding: 1.5rem; border-left: 4px solid #A8D3E3; border-radius: 4px;">
                    <h3 style="color: #C8DDE7;">⚠️ Sin respuesta del modelo</h3>
                    <p style="color: #F2F3F4;">El modelo no generó contenido. Posibles causas:</p>
                    <ul style="color: #F2F3F4; margin-top: 0.5rem;">
                        <li>Imagen bloqueada por filtros de seguridad</li>
                        <li>Contenido médico muy complejo</li>
                        <li>Problemas temporales del servidor</li>
                    </ul>
                    <p style="margin-top: 1rem; color: #C8DDE7;"><strong>Intenta con otra imagen o espera unos minutos.</strong></p>
                </div>`;
            return;
        }
        
        const candidate = result.candidates[0];
        
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            console.warn('⚠️ Candidato sin contenido válido');
            document.getElementById('resultado').innerHTML = 
                '<div style="text-align: center; padding: 2rem;"><p style="color: #C8DDE7;">⚠️ La respuesta está vacía. Intenta con otra radiografía.</p></div>';
            return;
        }
        
        let respuesta = candidate.content.parts[0].text;
        console.log('📝 Análisis completado:', respuesta.substring(0, 150));
        
        respuesta = formatearRespuesta(respuesta);
        document.getElementById('resultado').innerHTML = respuesta;
        
    } catch (err) {
        console.error('💥 Error completo:', err);
        document.getElementById('resultado').innerHTML = 
            `<div style="background: rgba(200, 221, 231, 0.1); padding: 1.5rem; border-left: 4px solid #C8DDE7; border-radius: 4px;">
                <h3 style="color: #C8DDE7; margin-top: 0;">💥 Error de Conexión</h3>
                <p style="color: #F2F3F4;"><strong>Tipo:</strong> ${err.name}</p>
                <p style="color: #F2F3F4;"><strong>Mensaje:</strong> ${err.message}</p>
                <div style="background: rgba(57, 67, 70, 0.3); padding: 1rem; margin-top: 1rem; border-radius: 4px;">
                    <strong style="color: #C8DDE7;">Pasos para solucionar:</strong>
                    <ol style="margin-top: 0.5rem; line-height: 1.8; color: #F2F3F4;">
                        <li>Verifica tu conexión a internet</li>
                        <li>Confirma que tu API key sea válida</li>
                        <li>Abre la Consola del navegador (F12) para ver más detalles</li>
                        <li>Intenta con una imagen más pequeña (&lt;1MB)</li>
                        <li>Recarga la página y vuelve a intentar</li>
                    </ol>
                </div>
            </div>`;
    } finally {
        btnAnalyze.disabled = false;
        btnAnalyze.textContent = '🔍 Analizar Radiografía';
    }
}

function formatearRespuesta(texto) {
    if (texto.includes('IMAGEN NO VÁLIDA') || texto.includes('No se puede realizar')) {
        return `<div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <h3 style="color: #C8DDE7; margin-bottom: 1rem;">Imagen no válida para análisis</h3>
            <p style="color: #F2F3F4; margin-bottom: 1.5rem;">${texto.replace(/\*\*/g, '').replace('IMAGEN NO VÁLIDA', '').replace('Razón:', '<strong>Razón:</strong>').trim()}</p>
            <div style="background: rgba(57, 67, 70, 0.3); padding: 1.5rem; border-radius: 8px; text-align: left; max-width: 500px; margin: 0 auto;">
                <strong style="color: #C8DDE7; display: block; margin-bottom: 0.8rem;">📋 Recomendaciones para mejores resultados:</strong>
                <ul style="margin: 0; padding-left: 1.5rem; color: #F2F3F4; line-height: 1.9;">
                    <li>Usa una <strong>radiografía médica real</strong> (rayos X)</li>
                    <li>Resolución mínima: <strong>600x600 píxeles</strong></li>
                    <li>Formato: <strong>PNG o JPG de alta calidad</strong></li>
                    <li>Evita imágenes borrosas, sobreexpuestas o con artefactos</li>
                    <li>Asegúrate de que las estructuras óseas sean claramente visibles</li>
                </ul>
            </div>
        </div>`;
    }
    
    const matchConfianza = texto.match(/(\d+)%/);
    let colorConfianza = '#C8DDE7';
    let nivelTexto = '';
    
    if (matchConfianza) {
        const nivel = parseInt(matchConfianza[1]);
        if (nivel >= 90) {
            colorConfianza = '#A8D3E3';
            nivelTexto = ' (Muy Alta)';
        } else if (nivel >= 70) {
            colorConfianza = '#C8DDE7';
            nivelTexto = ' (Alta)';
        } else if (nivel >= 50) {
            colorConfianza = '#F2F3F4';
            nivelTexto = ' (Moderada)';
        } else {
            colorConfianza = '#A8D3E3';
            nivelTexto = ' (Baja - Requiere confirmación)';
        }
    }
    
    texto = texto.replace(/\*\*IDENTIFICACIÓN ANATÓMICA:\*\*/gi, '<h3 style="color: #A8D3E3; margin-top: 0; padding-bottom: 0.5rem; border-bottom: 2px solid #A8D3E3;">🔍 IDENTIFICACIÓN ANATÓMICA</h3>');
    texto = texto.replace(/\*\*DIAGNÓSTICO:\*\*/gi, '<h3 style="color: #C8DDE7; margin-top: 1.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #C8DDE7;">📋 DIAGNÓSTICO</h3>');
    texto = texto.replace(/\*\*NIVEL DE CONFIANZA:\*\*/gi, `<h3 style="color: ${colorConfianza}; margin-top: 1.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid ${colorConfianza};">🎯 NIVEL DE CONFIANZA${nivelTexto}</h3>`);
    texto = texto.replace(/\*\*OBSERVACIONES:\*\*/gi, '<h3 style="color: #A8D3E3; margin-top: 1.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #A8D3E3;">💡 OBSERVACIONES</h3>');
    texto = texto.replace(/⚠️ ADVERTENCIA:/gi, '<div style="background: rgba(168, 211, 227, 0.15); padding: 1.2rem; border-left: 4px solid #C8DDE7; margin-top: 1.5rem; border-radius: 4px;"><strong style="color: #C8DDE7; font-size: 1.05em;">⚠️ ADVERTENCIA MÉDICA:</strong>');
    
    if (texto.includes('<strong style="color: #C8DDE7; font-size: 1.05em;">⚠️ ADVERTENCIA MÉDICA:</strong>')) {
        texto = texto.replace(/(\n\n|$)/, '</div>$1');
    }
    
    return `<div style="text-align: left; line-height: 1.9; color: #F2F3F4; font-size: 1.02em;">${texto}</div>`;
}
