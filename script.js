const N8N_WEBHOOK_URL = 'https://TU-N8N-URL/webhook/formulario5';

// ─── ENVÍO FORMULARIO ───────────────────────────────────────────────
document.getElementById('formulario5').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.querySelector('.btn-submit');
    const msg = document.getElementById('message');
    btn.disabled = true;
    msg.style.display = 'none';

    const tramites = document.querySelectorAll('input[name="tramite"]:checked');
    const tramiteValor = Array.from(tramites).map(t => t.value).join(', ');

    const datos = {
        fecha: document.getElementById('fecha').value,
        hab: document.getElementById('hab').value,
        mutual: document.getElementById('mutual').value,
        dr: document.getElementById('dr').value,
        pte: document.getElementById('pte').value,
        diagnostico: document.getElementById('diagnostico').value,
        tramite: tramiteValor,
        csv: document.getElementById('csv').value,
        tomografia: document.getElementById('tomografia').value,
        electrocardiograma: document.getElementById('electrocardiograma').value,
        laboratorio: document.getElementById('laboratorio').value,
        medicacion: document.getElementById('medicacion').value,
        dieta: document.getElementById('dieta').value,
        hidratacion: document.getElementById('hidratacion').value,
        diuresis_manana: document.getElementById('diuresis_manana').value,
        diuresis_tarde: document.getElementById('diuresis_tarde').value,
        diuresis_noche: document.getElementById('diuresis_noche').value,
        drenajes: document.getElementById('drenajes').value,
        sng_vomitos: document.getElementById('sng_vomitos').value,
        deposiciones: document.getElementById('deposiciones').value,
        controles_manana_fr: document.querySelector('.control-manana-fr').value,
        controles_manana_te: document.querySelector('.control-manana-te').value,
        controles_manana_p: document.querySelector('.control-manana-p').value,
        controles_manana_ta: document.querySelector('.control-manana-ta').value,
        controles_manana_o2: document.querySelector('.control-manana-o2').value,
        controles_tarde_fr: document.querySelector('.control-tarde-fr').value,
        controles_tarde_te: document.querySelector('.control-tarde-te').value,
        controles_tarde_p: document.querySelector('.control-tarde-p').value,
        controles_tarde_ta: document.querySelector('.control-tarde-ta').value,
        controles_tarde_o2: document.querySelector('.control-tarde-o2').value,
        controles_noche_fr: document.querySelector('.control-noche-fr').value,
        controles_noche_te: document.querySelector('.control-noche-te').value,
        controles_noche_p: document.querySelector('.control-noche-p').value,
        controles_noche_ta: document.querySelector('.control-noche-ta').value,
        controles_noche_o2: document.querySelector('.control-noche-o2').value,
    };

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            msg.textContent = '✅ Formulario enviado correctamente.';
            msg.className = 'message success';
        } else {
            throw new Error('Error en el servidor');
        }
    } catch (error) {
        msg.textContent = '❌ Error al enviar. Verificá la conexión.';
        msg.className = 'message error';
    }

    msg.style.display = 'block';
    btn.disabled = false;
});

// ─── MICRÓFONO / DICTADO POR VOZ ────────────────────────────────────
const btnMic = document.getElementById('btn-mic');
const micStatus = document.getElementById('mic-status');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    btnMic.disabled = true;
    btnMic.title = 'Tu navegador no soporta dictado por voz';
    micStatus.textContent = 'Dictado no disponible en este navegador';
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.continuous = false;
    recognition.interimResults = false;

    let campoActivo = null;
    let grabando = false;

    // Al hacer foco en cualquier campo, lo guardamos como activo
    document.querySelectorAll('input[type="text"], textarea').forEach(campo => {
        campo.addEventListener('focus', () => {
            campoActivo = campo;
            micStatus.textContent = `Campo seleccionado: ${campo.id || campo.className.split(' ')[1] || 'campo'}`;
        });
    });

    btnMic.addEventListener('click', () => {
        if (!campoActivo) {
            micStatus.textContent = '⚠️ Primero hacé clic en el campo donde querés dictar';
            return;
        }

        if (grabando) {
            recognition.stop();
            return;
        }

        recognition.start();
        grabando = true;
        btnMic.classList.add('grabando');
        micStatus.textContent = '🎤 Escuchando...';
    });

    recognition.onresult = (event) => {
        const texto = event.results[0][0].transcript;
        if (campoActivo) {
            campoActivo.value += (campoActivo.value ? ' ' : '') + texto;
        }
        micStatus.textContent = '✅ Dictado guardado';
    };

    recognition.onend = () => {
        grabando = false;
        btnMic.classList.remove('grabando');
    };

    recognition.onerror = (event) => {
        grabando = false;
        btnMic.classList.remove('grabando');
        micStatus.textContent = '❌ Error: ' + event.error;
    };
}