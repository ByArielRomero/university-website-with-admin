# Manual de Usuario y Funcionalidades - Complejo Universitario Exaltación de la Cruz

Este documento detalla todas las características, funcionalidades y capacidades tanto de la **web pública** como del **panel de administración** del sitio web del Complejo Universitario Municipal de Exaltación de la Cruz, además de proveer una guía práctica para compartir información con clientes o estudiantes vía WhatsApp y Correo Electrónico.

---

## 🗺️ Estructura y Vistas de la Web Pública

La web pública ha sido diseñada con una estética moderna, fluida y adaptable (responsiva) para dispositivos móviles, tablets y computadoras.

### 1. Banner Principal (Hero Section)
* **Imagen de Fondo:** Imagen representativa del Complejo Universitario con degradados oscuros para una lectura óptima del texto.
* **Información Principal:** Título llamativo institucional y descripción de la oferta académica superior.
* **Acciones Rápidas:** Botones para navegar a las carreras o conocer la historia.
* **Banner de Inscripciones:** Un aviso flotante dinámico con el texto `✨ INSCRIPCIONES 2026 ABIERTAS` que se activa o desactiva automáticamente según la configuración del administrador.

### 2. Sección Historia
* Muestra el crecimiento de la institución, resaltando el compromiso con la comunidad de Exaltación de la Cruz.
* Incluye imágenes representativas y frases destacadas sobre el acceso a la educación superior pública.

### 3. Oferta Académica (Carreras y Cursos)
* **Buscador/Filtro Rápido:** Botones para filtrar y ver:
  * **Ver Todo**
  * **Carreras** (Estudios de grado/tecnicaturas)
  * **Cursos** (Formaciones más cortas o talleres)
* **Tarjetas Informativas:** Cada carrera/curso cuenta con:
  * Imagen de portada o miniatura de video.
  * Título y descripción breve.
  * Etiqueta de tipo (Carrera o Curso) y modalidad (Presencial, Virtual, Semipresencial).
* **Modal de Detalle Completo:** Al hacer clic en una tarjeta, se abre una ventana con:
  * **Galería Multimedia:** Visor de múltiples imágenes y videos (soporta videos locales y enlaces de YouTube).
  * Duración y estado de inscripción.
  * Plan de estudios o descripción detallada.
  * Botón directo para iniciar la pre-inscripción online.

### 4. Novedades y Prensa
* Espacio dedicado a comunicar las últimas actividades.
* **Filtros por Categoría:** Permite filtrar rápidamente entre:
  * **Todas** las novedades.
  * **Eventos** (charlas, exposiciones).
  * **Noticias** institucionales.
  * **Convocatorias** (inscripciones, becas).
* **Noticias Destacadas:** El administrador puede marcar noticias importantes. Estas aparecen en la parte superior con un diseño exclusivo, una estrella de destacado, y un borde/sombra de color personalizado seleccionado por el administrador.
* **Modal de Lectura:** Permite leer la noticia completa en un formato limpio y cómodo, visualizando imágenes y videos vinculados.

### 5. Galería Institucional
* Feed de fotos y videos tomados en el complejo universitario.
* Permite a los usuarios navegar de forma interactiva por los álbumes y reproducciones de video en pantalla completa (Lightbox).

### 6. Canales de Contacto e Integración
* Tarjetas interactivas con enlaces directos a:
  * **Email:** Enlace directo para redactar un correo a `info@complejouniversitario.edu.ar`.
  * **WhatsApp:** Enlace directo para chatear con soporte.
  * **Instagram:** Acceso al perfil institucional `@complejouniversitario`.
  * **Ubicación:** Enlace a Google Maps para llegar a la sede (Carlos Lemée s/n).

### 7. Botón Flotante de WhatsApp
* Visible en la esquina inferior derecha de toda la web.
* Al posicionar el cursor sobre él, muestra el mensaje *"Chateá con nosotros"*.
* Al hacer clic, redirige al chat de WhatsApp oficial del Complejo (`+54 11 2363-5027`) para facilitar consultas inmediatas de manera ágil.

---

## 🔐 Panel de Administración (CMS)

Ubicado de forma segura en la ruta `/admin`, este panel permite gestionar todo el contenido dinámico del sitio.

### 🛡️ Seguridad y Autenticación
* **Acceso Protegido:** Requiere credenciales de usuario y contraseña administrados de forma segura mediante **NextAuth.js**.
* **Contraseñas Encriptadas:** Almacenamiento seguro en base de datos utilizando el algoritmo de hasheo `bcrypt`.
* **Protección contra ataques:** Control automático contra intentos fallidos de inicio de sesión.

---

### 🛠️ Capacidades de Gestión (¿Qué se puede hacer?)

El panel se divide en tres áreas principales mediante pestañas:

#### A. Gestión de Carreras y Cursos
1. **Crear / Editar / Eliminar:** Formulario completo para registrar las propuestas académicas.
2. **Clasificación:** Permite categorizar el elemento como **"Carrera"** o **"Curso"** (lo que actualiza automáticamente los filtros del sitio público).
3. **Campos Disponibles:**
   * Nombre de la propuesta.
   * Facultad o Departamento.
   * Duración (Ej: "3 años", "6 meses").
   * Modalidad (Presencial, Virtual, Semipresencial).
   * Descripción completa.
4. **Subida de Archivos Multimedia:**
   * **Imágenes:** Subida de imágenes locales (arrastrar y soltar/examinar con límite de 5MB) o inserción mediante URLs web. Admite múltiples imágenes por carrera para formar una galería interna.
   * **Videos:** Subida de archivos de video locales (hasta 50MB y 2 minutos de duración límite) o vinculación directa de enlaces de YouTube.

#### B. Gestión de Novedades y Prensa
1. **Crear / Editar / Eliminar:** Publicar y gestionar avisos del complejo.
2. **Categorización:** Clasificación de noticias en: *Noticia, Evento, Convocatoria, Académico, Galería*.
3. **Herramientas de Destacado:**
   * Interruptor para **"Destacar esta publicación"**.
   * **Selector de Color:** Paleta de colores predefinidos o selector personalizado hexadecimal para pintar la tarjeta y su sombra en la landing page pública.
4. **Archivos Adjuntos:** Soporta múltiples imágenes de alta resolución y reproducción de videos adjuntos.

#### C. Pestaña de Configuración General
* **Modo Inscripciones Abiertas:** Interruptor rápido (Switch On/Off) que activa o desactiva la campaña de inscripciones a nivel global.
* **Efecto:** Al activarse, la landing page pública muestra de forma inmediata el cartel dinámico de inscripciones en el banner principal, motivando la pre-inscripción online de los aspirantes.

---

## ✉️ Guía para Compartir y Enviar Información al Cliente (WhatsApp y Email)

Para facilitar la comunicación con futuros estudiantes o interesados, a continuación se presentan plantillas e instrucciones sobre cómo enviar la información del sitio de forma profesional.

### 📱 Compartir por WhatsApp

Para compartir un enlace de forma interactiva y atractiva en WhatsApp, puedes estructurar los mensajes con negritas (`*texto*`) y emojis.

#### Plantilla 1: Información General e Inscripciones
> Hola, ¡qué tal! 👋 Te escribo desde el *Complejo Universitario Municipal de Exaltación de la Cruz*.
> 
> Te comparto nuestro sitio web oficial donde vas a poder ver toda nuestra oferta académica, noticias y requisitos de inscripción:
> 🔗 https://complejouniversitarioexaltacion.edu.ar
> 
> *(Actualmente las inscripciones 2026 se encuentran abiertas. Podés completar tu pre-inscripción online desde la sección de Carreras).* 🎓
> 
> Si tenés alguna duda, quedamos a tu entera disposición. ¡Saludos! 😊

#### Plantilla 2: Detalle de una Carrera o Curso Específico
> Hola! 🎓 Te adjunto la información de la carrera/curso por la que nos consultaste:
> 
> *[Nombre de la Carrera/Curso]*
> 🏢 Modalidad: [Presencial / Virtual]
> ⏳ Duración: [Ej: 3 años]
> 
> Podés ver todos los detalles ingresando a nuestra web:
> 🔗 https://complejouniversitarioexaltacion.edu.ar#carreras
> 
> *(Hacé clic en la tarjeta de la carrera para ver el plan de estudios, fotos y videos informativos).* 🔍

---

### 📧 Compartir por Correo Electrónico

El correo electrónico permite enviar respuestas más formales y completas. Puedes utilizar la siguiente estructura:

**Asunto:** Información sobre Oferta Académica - Complejo Universitario Municipal

> Estimado/a [Nombre del Interesado/a],
>
> Agradecemos su interés en el **Complejo Universitario Municipal de Exaltación de la Cruz**.
>
> Le informamos que a través de nuestro sitio web oficial puede acceder a toda la información detallada sobre nuestras propuestas académicas vigentes (carreras de grado, tecnicaturas y cursos rápidos), así como también noticias institucionales, eventos y convocatorias.
>
> 🌐 **Visite nuestro sitio web:** [https://complejouniversitarioexaltacion.edu.ar](https://complejouniversitarioexaltacion.edu.ar)
>
> **¿Qué podrá encontrar en el sitio?**
> * **Oferta Académica:** Detalle de materias, modalidad y duración de cada carrera o curso filtrando entre ambas opciones.
> * **Galería Multimedia:** Fotos y videos de nuestras instalaciones y eventos.
> * **Pre-inscripción en Línea:** En caso de que las inscripciones estén abiertas, podrá realizar el trámite de pre-ingreso de forma 100% virtual.
>
> Si prefiere comunicarse directamente con el departamento de administración, puede hacerlo haciendo clic en el botón de **WhatsApp** flotante que se encuentra en la esquina inferior derecha de la página, o respondiendo directamente a este correo.
>
> Quedamos a su disposición para cualquier consulta.
>
> Atentamente,
>
> **Administración**
> *Complejo Universitario Municipal de Exaltación de la Cruz*
> 📞 Teléfono / WhatsApp: +54 11 2363-5027
> 📍 Dirección: Carlos Lemée s/n, Exaltación de la Cruz
