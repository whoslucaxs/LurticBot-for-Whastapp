const {
    MessageType,
    WAMessage,
    ReconnectMode,
    WAProto,
    useSingleFileAuthState,
    MediaType,
    MessageOptions,
    Mimetype,
    DisconnectReason,
    downloadContentFromMessage
} = require('@adiwajshing/baileys')

var pino = require("pino");
var makeWASocket = require("@adiwajshing/baileys");
const fs = require('fs')
const CFonts = require('cfonts')

const { RandomName } = require('./getRandomName');
RandomName()

var getRandomImg = '';
var groupPassed = '';

const { saveState, state } = useSingleFileAuthState('./database/auth.json');

(async () => {
    CFonts.say('LURTIC', {
        font: 'block',
        align: 'center',
        gradient: ['green', 'magenta']
    })
    CFonts.say('Bot', {
        font: 'block',
        align: 'center',
        gradient: ['green', 'magenta']
    })
    CFonts.say('Por @ny.lucax', {
        font: 'console',
        align: 'center',
        gradient: ['red', 'magenta']
    })

    prefix = [
        '$'
    ]
    var nyx = undefined;

    var startSock = () => {
        const nyx = makeWASocket["default"]({
            printQRInTerminal: true,
            defaultQueryTimeoutMs: undefined,
            browser: ['NyxBot Multi-Device', "Safari", "3.0"],
            logger: pino({
                level: 'error'
            }),
            auth: state
        })

        nyx.ev.on('messages.upsert',
            async m => {
                try {
                    const msg = m.messages[0]
                    if (!msg.message) return
                    msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
                    if (!msg.message) return
                    if (msg.key && msg.key.remoteJid == 'status@broadcast') return
                    if (msg.key.fromMe) return
                    global.prefix

                    const from = msg.key.remoteJid
                    var fromId = msg.key.remoteJid
                    const type = Object.keys(msg.message)[0]

                    var body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ?
                        msg.message.imageMessage.caption : (type == 'videoMessage') ?
                            msg.message.videoMessage.caption : (type == 'extendedTextMessage') ?
                                msg.message.extendedTextMessage.text : (type == 'messageContextInfo') || (type == 'buttonsResponseMessage') ?
                                    msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') ?
                                        msg.message.templateButtonReplyMessage.selectedId : (type == 'listResponseMessage') ?
                                            msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''

                    const command = body.trim().split(/ +/).shift().toLowerCase()
                    const isGroup = from.endsWith('@g.us')

                    const getName = msg.pushName || "undefined"

                    const groupMetadata = isGroup ? await nyx.groupMetadata(from) : ''
                    const groupName = isGroup ? groupMetadata.subject : 'Indefinido'
                    const groupId = isGroup ? groupMetadata.id : 'Indefinido'

                    const reply = (mensagem) => {
                        nyx.sendMessage(from, {
                            text: mensagem
                        });
                    }

                    function passed(from, emoji) {

                        const reactionEmoji = {
                            react: {
                                text: emoji,
                                key: msg.key
                            }
                        }
                        nyx.sendMessage(from, reactionEmoji)
                        nyx.sendMessage(from, { text: `🎯 ${getName} acertou!!` })

                    }

                    switch (command) {


                        case '$lb.iniciar':

                            eval(`getRandomImg${fromId.split('@')[0]} = '${RandomName().toString()}'`);
                            eval(`oldImg${fromId.split('@')[0]} = getRandomImg${fromId.split('@')[0]}`);
                            eval(`groupPassed${fromId.split('@')[0]} = false`);

                            if (eval(`getRandomImg${fromId.split('@')[0]}`) == eval(`oldImg${from.split("@")[0]}`)) {

                                eval(`getRandomImg${fromId.split('@')[0]} = '${RandomName().toString()}'`);

                            }

                            const buttons = [
                                { buttonId: '$lb.dica', buttonText: { displayText: '💡 DICA' }, type: 1 },
                                { buttonId: '$lb.pular', buttonText: { displayText: '🔁 PULAR' }, type: 1 }
                            ]

                            const buttonMessage = {
                                image: { url: `./database/data/${eval(`getRandomImg${fromId.split('@')[0]}`)}.png` },
                                caption: "🎨 Acerte o desenho acima digitando sua resposta no chat!",
                                buttons: buttons,
                                headerType: 4
                            }

                            nyx.sendMessage(from, buttonMessage)

                            break

                        case '$lb.dica':
                            console.log(getRandomImg)

                            reply('💡Dica (' + eval(`getRandomImg${fromId.split('@')[0]}`).length + '): ' + eval(`getRandomImg${fromId.split('@')[0]}`).toUpperCase().substring(0, 1) + "_".repeat(eval(`getRandomImg${fromId.split('@')[0]}`).length - 1))

                            break

                        case '$lb.pular':

                            eval(`groupPassed${fromId.split('@')[0]} = true`);
                            reply('🔁 ' + getName + ' pulou o desenho!')

                            break

                    }

                    if (command == '$lb.pular') {

                        eval(`groupPassed${fromId.split('@')[0]} = true`);

                    } else {

                        eval(`groupPassed${fromId.split('@')[0]} = false`);

                    }

                    if (eval(`groupPassed${fromId.split('@')[0]}`) == true) {

                        eval(`getRandomImg${fromId.split('@')[0]} = '${RandomName().toString()}'`);
                        eval(`oldImg${fromId.split('@')[0]} = getRandomImg${fromId.split('@')[0]}`);
                        eval(`groupPassed${fromId.split('@')[0]} = false`);

                        if (eval(`getRandomImg${fromId.split('@')[0]}`) == eval(`oldImg${from.split("@")[0]}`)) {

                            eval(`getRandomImg${fromId.split('@')[0]} = '${RandomName().toString()}'`);

                        }

                        const buttons = [
                            { buttonId: '$lb.dica', buttonText: { displayText: '💡 DICA' }, type: 1 },
                            { buttonId: '$lb.pular', buttonText: { displayText: '🔁 PULAR' }, type: 1 }
                        ]

                        const buttonMessage = {
                            image: { url: `./database/data/${eval(`getRandomImg${fromId.split('@')[0]}`)}.png` },
                            caption: "🎨 Acerte o desenho acima digitando sua resposta no chat!",
                            buttons: buttons,
                            headerType: 4
                        }

                        nyx.sendMessage(from, buttonMessage)

                    } else {

                        if (eval(`getRandomImg${fromId.split('@')[0]}`) == command) {

                            passed(from, '⭐')

                            eval(`groupPassed${fromId.split('@')[0]} = false`);

                            eval(`getRandomImg${fromId.split('@')[0]} = '${RandomName().toString()}'`);
                            eval(`oldImg${fromId.split('@')[0]} = getRandomImg${fromId.split('@')[0]}`);
                            eval(`groupPassed${fromId.split('@')[0]} = false`);

                            if (eval(`getRandomImg${fromId.split('@')[0]}`) == eval(`oldImg${from.split("@")[0]}`)) {

                                eval(`getRandomImg${fromId.split('@')[0]} = '${RandomName().toString()}'`);

                            }

                            const buttons = [
                                { buttonId: '$lb.dica', buttonText: { displayText: '💡 DICA' }, type: 1 },
                                { buttonId: '$lb.pular', buttonText: { displayText: '🔁 PULAR' }, type: 1 }
                            ]

                            const buttonMessage = {
                                image: { url: `./database/data/${eval(`getRandomImg${fromId.split('@')[0]}`)}.png` },
                                caption: "🎨 Acerte o desenho acima digitando sua resposta no chat!",
                                buttons: buttons,
                                headerType: 4
                            }

                            nyx.sendMessage(from, buttonMessage)

                        }

                    }

                } catch (err) {
                    console.log(err)
                }
            })
        nyx.ev.on('group-participants.update',
            async (update) => {
                try {
                    console.log(update)
                } catch (error) {
                    console.log(error)
                }
            })
        return nyx
    }

    nyx = startSock()
    nyx.ev.on('connection.update',
        async (update) => {
            const {
                connection,
                lastDisconnect
            } = update
            if (connection === 'close') {

                const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
                lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? startSock() : console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            }

            console.log('Update', update)

        })

    nyx.ev.on('creds.update',
        saveState);

    return nyx;


})()

