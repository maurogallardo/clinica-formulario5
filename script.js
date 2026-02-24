const N8N_WEBHOOK_URL = 'https://n8n-production-0142.up.railway.app/webhook/formulario5';

document.getElementById('formulario5').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.querySelector('.btn-submit');
    const msg = document.getElementById('message');
    const micStatus = document.getElementById('mic-status');

    btn.disabled = true;
    msg.style.display = 'none';
    micStatus.textContent = '';

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
            msg.textContent = '✅ Formulario enviado exitosamente.';
            msg.className = 'message success';
            msg.style.display = 'block';
            setTimeout(() => { msg.style.display = 'none'; }, 3000);
            setTimeout(() => { document.getElementById('formulario5').reset(); }, 3000);
        } else {
            throw new Error('Error en el servidor');
        }
    } catch (error) {
        msg.textContent = '❌ Error al enviar. Verificá la conexión.';
        msg.className = 'message error';
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
    }

    btn.disabled = false;
});

// ─── MICRÓFONO ───────────────────────────────────────────────────────
const btnMic = document.getElementById('btn-mic');
const micStatus = document.getElementById('mic-status');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    btnMic.disabled = true;
    micStatus.textContent = 'Dictado no disponible. Usá Chrome o Edge.';
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.continuous = true;
    recognition.interimResults = false;

    let grabando = false;
    let transcripcionCompleta = '';

    btnMic.addEventListener('click', () => {
        if (grabando) {
            recognition.stop();
        } else {
            transcripcionCompleta = '';
            recognition.start();
        }
    });

    recognition.onstart = () => {
        grabando = true;
        btnMic.classList.add('grabando');
        btnMic.textContent = '⏹';
        micStatus.textContent = '🎤 Escuchando... apretá el botón para terminar.';
    };

    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcripcionCompleta += ' ' + event.results[i][0].transcript;
            }
        }
        micStatus.textContent = '🎤 ' + transcripcionCompleta.trim().slice(-80) + '...';
    };

    recognition.onend = async () => {
        grabando = false;
        btnMic.classList.remove('grabando');
        btnMic.textContent = '🎤';

        if (!transcripcionCompleta.trim()) {
            micStatus.textContent = '⚠️ No se detectó audio.';
            return;
        }

        micStatus.textContent = '⏳ Procesando con IA...';

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcripcion: transcripcionCompleta.trim() })
            });

            if (!response.ok) throw new Error('Error en n8n');

            const data = await response.json();
            Object.keys(data).forEach(key => {
                const classMapped = key.replace('controles_', 'control-').replace(/_/g, '-');
                const el = document.getElementById(key) || document.querySelector('.' + classMapped);
                if (el && data[key] !== null && data[key] !== undefined) {
                    el.value = data[key];
                }
            });
            micStatus.textContent = '✅ Campos completados. Revisá y enviá.';
        } catch (error) {
            micStatus.textContent = '⚠️ Error al procesar. Intentá de nuevo.';
            console.error(error);
        }
    };

    recognition.onerror = (event) => {
        grabando = false;
        btnMic.classList.remove('grabando');
        btnMic.textContent = '🎤';
        micStatus.textContent = '❌ Error: ' + event.error;
    };
}
```

---

Git:
```
git add index.html styles.css script.js
git commit - m "fix: ajustes visuales, grilla horarios, campos sin borde"
git push