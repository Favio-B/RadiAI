# Sistema de Análisis Radiológico Automatizado

## 📋 Descripción del Proyecto
Este es un proyecto de investigación en **Inteligencia Artificial Médica** diseñado para evaluar la capacidad de modelos de lenguaje avanzados en el análisis de imágenes radiológicas. El sistema permite a los usuarios cargar radiografías y recibir un análisis preliminar automatizado sobre posibles hallazgos, como fracturas o anomalías óseas.

> [!IMPORTANT]
> **Aviso Legal:** Este sistema es un prototipo experimental con fines académicos y de investigación. **NO** debe utilizarse para diagnósticos médicos reales. Los resultados deben ser verificados siempre por un profesional de la salud certificado.

## 🚀 Características Principales
- **Análisis Automatizado:** Utiliza la API de Gemini 2.0 Flash para interpretar imágenes médicas.
- **Detección de Fracturas:** Especializado en identificar fracturas, fisuras y lesiones óseas.
- **Interfaz Intuitiva:** Diseño moderno con temática radiológica (modo oscuro, tonos azules).
- **Feedback Visual:** Previsualización de imágenes y estados de carga/análisis.
- **Reportes Estructurados:** Genera informes con:
  - Identificación Anatómica
  - Diagnóstico Presuntivo
  - Nivel de Confianza
  - Observaciones Adicionales

## 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **IA / Backend:** Google Gemini API (`gemini-2.0-flash-exp`).
- **Estilos:** Diseño responsivo con CSS Grid/Flexbox y animaciones suaves.

## 📂 Estructura del Proyecto
- `index.html`: Estructura principal y maquetación de la interfaz.
- `styles.css`: Estilos visuales con paleta de colores "radiográfica" y efectos de negatoscopio.
- `app.js`: Lógica del cliente, manejo del DOM y comunicación con la API de Gemini.

## ⚙️ Configuración
Para que el proyecto funcione correctamente, se requiere una **API Key** válida de Google AI Studio.

1. Abre el archivo `app.js`.
2. Localiza la constante `API_KEY` en la línea 1.
3. Reemplaza el valor con tu propia clave:
   ```javascript
   const API_KEY = 'TU_API_KEY_AQUI';
   ```

## 📝 Uso
1. Abre `index.html` en un navegador web moderno.
2. Haz clic en el área de carga o arrastra una imagen de rayos X (JPG, PNG).
3. Presiona el botón **"Analizar Radiografía"**.
4. Espera unos segundos a que la IA procese la imagen y muestre el reporte.

---
© 2025 - Proyecto de Investigación en IA Médica
