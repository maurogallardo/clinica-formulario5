const WEBHOOK_URL = 'https://n8n-production-0142.up.railway.app/webhook/formulario5';

// Poner fecha de hoy por defecto
document.getElementById('fecha').valueAsDate = new Date();

// Manejar envío del formulario
document.getElementById('formulario5').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn-submit');
    const msg = document.getElementById('message');

    btn.disabled = true;
    btn.textContent = 'ENVIANDO...';

    const formData = {
        fecha: document.getElementById('fecha').value,
        hab: document.getElementById('hab').value,
        mutual: document.getElementById('mutual').value,
        dr: document.getElementById('dr').value,
        pte: document.getElementById('pte').value,
        tramite_adm: document.querySelector('input[name="tramite"]:checked')?.value || "",
        dieta: document.getElementById('dieta').value,
        hidratacion: document.getElementById('hidratacion').value,
        diuresis_manana: document.getElementById('diuresis_manana').value,
        diuresis_tarde: document.getElementById('diuresis_tarde').value,
        diuresis_noche: document.getElementById('diuresis_noche').value,
        drenajes: document.getElementById('drenajes').value,
        sng_vomitos: document.getElementById('sng_vomitos').value,
        deposiciones: document.getElementById('deposiciones').value,
        observaciones_enfermeria: document.getElementById('observaciones_enfermeria').value,
        turno: "No especificado",
        profesional: "No especificado",
        indicaciones_medicas: "",
        diagnostico: "",
        controles_enfermeria: ""
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            msg.className = 'message success';
            msg.style.display = 'block';
            msg.textContent = '✓ FORMULARIO ENVIADO CORRECTAMENTE';
            document.getElementById('formulario5').reset();
            document.getElementById('fecha').valueAsDate = new Date();

            setTimeout(() => {
                msg.style.display = 'none';
            }, 5000);
        } else {
            throw new Error('Error en el servidor');
        }
    } catch (error) {
        msg.className = 'message error';
        msg.style.display = 'block';
        msg.textContent = '✗ ERROR AL ENVIAR EL FORMULARIO';
        console.error('Error:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'ENVIAR FORMULARIO';
    }
});