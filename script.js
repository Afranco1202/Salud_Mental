document.addEventListener('DOMContentLoaded', () => {
    // Datos de enfermedades y sus síntomas
    // ¡IMPORTANTE! ESTOS DATOS SON SIMPLIFICADOS Y PARA FINES DEMOSTRATIVOS.
    // Un diagnóstico real requiere de un profesional de la salud.
    const enfermedadesData = {
        ansiedad: {
            nombre: "Trastornos de Ansiedad",
            sintomas: [
                "Preocupación excesiva y persistente",
                "Sensación de nerviosismo o inquietud",
                "Fatiga y agotamiento",
                "Dificultad para concentrarse",
                "Irritabilidad",
                "Tensión muscular",
                "Problemas para dormir (insomnio)",
                "Sudoración excesiva",
                "Palpitaciones o taquicardia",
                "Falta de aire o sensación de ahogo",
                "Temblores",
                "Dolor de estómago o náuseas"
            ]
        },
        depresion: {
            nombre: "Depresión",
            sintomas: [
                "Tristeza persistente o estado de ánimo deprimido",
                "Pérdida de interés o placer en actividades que antes disfrutaba",
                "Cambios en el apetito o el peso",
                "Problemas para dormir (insomnio o dormir demasiado)",
                "Agitación o lentitud psicomotora",
                "Fatiga o pérdida de energía",
                "Sentimientos de inutilidad o culpa excesiva",
                "Dificultad para pensar, concentrarse o tomar decisiones",
                "Pensamientos de muerte o suicidio (¡BUSCA AYUDA INMEDIATA!)",
                "Irritabilidad"
            ]
        },
        estres: {
            nombre: "Estrés Crónico",
            sintomas: [
                "Dolores de cabeza frecuentes",
                "Tensión muscular o dolor de cuello/espalda",
                "Problemas digestivos (malestar estomacal, diarrea)",
                "Fatiga y falta de energía",
                "Dificultad para dormir",
                "Irritabilidad o cambios de humor",
                "Ansiedad o preocupación constante",
                "Dificultad para concentrarse",
                "Pérdida de interés en actividades",
                "Aumento o disminución del apetito",
                "Sensación de abrumación"
            ]
        },
        bipolar: {
            nombre: "Trastorno Bipolar",
            sintomas: [
                "Períodos de estado de ánimo elevado o eufórico (manía/hipomanía)",
                "Aumento de la energía y actividad",
                "Menor necesidad de dormir",
                "Hablar rápido o de forma incontrolable",
                "Fuga de ideas o pensamientos acelerados",
                "Grandiosidad o autoestima inflada",
                "Comportamiento impulsivo o arriesgado",
                "Períodos de depresión profunda (ver síntomas de depresión)",
                "Cambios drásticos de humor"
            ]
        },
        toc: {
            nombre: "Trastorno Obsesivo-Compulsivo (TOC)",
            sintomas: [
                "Pensamientos, imágenes o impulsos recurrentes e intrusivos (obsesiones)",
                "Compulsiones (comportamientos repetitivos o actos mentales) para reducir la ansiedad",
                "Miedo excesivo a la contaminación o gérmenes",
                "Necesidad de orden y simetría",
                "Dudas excesivas y necesidad de comprobación",
                "Pensamientos agresivos u horribles",
                "Rituales de limpieza o lavado excesivo",
                "Organización y alineación de objetos de forma precisa"
            ]
        }
    };

    // Referencias a elementos del DOM
    const botonInfo = document.getElementById('botonInfo');
    const enfermedadSelector = document.getElementById('enfermedadSelector');
    const sintomasEnfermedadDiv = document.getElementById('sintomasEnfermedad');
    const checkboxSintomasDiv = document.getElementById('checkboxSintomas');
    const analizarSintomasBtn = document.getElementById('analizarSintomas');
    const resultadoAnalisisP = document.getElementById('resultadoAnalisis');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // Inicializar la lista de checkboxes de síntomas con todos los síntomas posibles
    // Se extraen todos los síntomas únicos de todas las enfermedades
    let allSymptoms = new Set();
    for (const key in enfermedadesData) {
        enfermedadesData[key].sintomas.forEach(sintoma => allSymptoms.add(sintoma));
    }
    const sortedSymptoms = Array.from(allSymptoms).sort(); // Opcional: ordenar alfabéticamente

    sortedSymptoms.forEach(sintoma => {
        const checkboxId = 'sintoma-' + sintoma.replace(/\s+/g, '-').toLowerCase();
        const checkboxHtml = `
            <div>
                <input type="checkbox" id="${checkboxId}" value="${sintoma}">
                <label for="${checkboxId}">${sintoma}</label>
            </div>
        `;
        checkboxSintomasDiv.innerHTML += checkboxHtml;
    });

    // --- Event Listeners ---

    // Manejo del botón "Más Información"
    if (botonInfo) {
        botonInfo.addEventListener('click', () => {
            document.getElementById('informacion').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Manejo de la selección de enfermedad
    if (enfermedadSelector) {
        enfermedadSelector.addEventListener('change', (event) => {
            const selectedDiseaseKey = event.target.value;
            sintomasEnfermedadDiv.innerHTML = ''; // Limpiar síntomas anteriores

            if (selectedDiseaseKey && enfermedadesData[selectedDiseaseKey]) {
                const disease = enfermedadesData[selectedDiseaseKey];
                let sintomasHtml = `<h4>Síntomas comunes de ${disease.nombre}:</h4><ul>`;
                disease.sintomas.forEach(sintoma => {
                    sintomasHtml += `<li>${sintoma}</li>`;
                });
                sintomasHtml += `</ul>`;
                sintomasEnfermedadDiv.innerHTML = sintomasHtml;
            } else {
                sintomasEnfermedadDiv.innerHTML = '<p>Selecciona una condición para ver sus síntomas.</p>';
            }
        });
        // Inicializar el display de síntomas al cargar la página
        enfermedadSelector.dispatchEvent(new Event('change'));
    }

    // Manejo del botón "Analizar Mis Síntomas"
    if (analizarSintomasBtn) {
        analizarSintomasBtn.addEventListener('click', () => {
            const selectedSymptoms = [];
            document.querySelectorAll('#checkboxSintomas input[type="checkbox"]:checked').forEach(checkbox => {
                selectedSymptoms.push(checkbox.value);
            });

            if (selectedSymptoms.length === 0) {
                resultadoAnalisisP.textContent = 'Por favor, selecciona al menos un síntoma.';
                resultadoAnalisisP.style.backgroundColor = '#f8d7da'; // Color de error
                resultadoAnalisisP.style.color = '#721c24';
                return;
            }

            // Lógica de "orientación" muy básica
            // Esto es una simplificación extrema. Un sistema real sería mucho más complejo.
            const posiblesCondiciones = {};
            selectedSymptoms.forEach(sintomaElegido => {
                for (const key in enfermedadesData) {
                    if (enfermedadesData[key].sintomas.includes(sintomaElegido)) {
                        if (!posiblesCondiciones[key]) {
                            posiblesCondiciones[key] = 0;
                        }
                        posiblesCondiciones[key]++;
                    }
                }
            });

            let topCondition = null;
            let maxMatches = 0;

            for (const key in posiblesCondiciones) {
                if (posiblesCondiciones[key] > maxMatches) {
                    maxMatches = posiblesCondiciones[key];
                    topCondition = key;
                }
            }

            let resultText = '';
            if (topCondition) {
                const diseaseName = enfermedadesData[topCondition].nombre;
                const percentage = ((maxMatches / selectedSymptoms.length) * 100).toFixed(0);
                resultText = `Basado en tus síntomas, podrías explorar información sobre **${diseaseName}** (coincidencia del ${percentage}% con los síntomas comunes de esa condición).`;
            } else {
                resultText = 'No se encontró una coincidencia clara con las condiciones listadas. Tus síntomas pueden estar relacionados con otros factores o con una combinación. Recuerda que esta herramienta es solo una guía.';
            }

            resultadoAnalisisP.innerHTML = `**Orientación (No es un diagnóstico):**<br>${resultText}<br><br>**Siempre consulta a un profesional de la salud mental para una evaluación adecuada.**`;
            resultadoAnalisisP.style.backgroundColor = '#d4edda'; // Color de éxito
            resultadoAnalisisP.style.color = '#155724';
        });
    }


    // Manejo del formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;

            if (nombre && email && mensaje) {
                formMessage.textContent = '¡Gracias por tu mensaje, ' + nombre + '! Nos pondremos en contacto pronto.';
                formMessage.style.color = 'green';
                contactForm.reset();
            } else {
                formMessage.textContent = 'Por favor, completa todos los campos del formulario.';
                formMessage.style.color = 'red';
            }
        });
    }

    // Ejemplo de animación simple al hacer scroll (opcional)
    const sections = document.querySelectorAll('.content-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Puedes resetear el estilo si quieres que la animación se repita al volver a ver la sección
                // entry.target.style.opacity = 0;
                // entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, {
        threshold: 0.2
    });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
});