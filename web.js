const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
    
});

client.on('ready', () => {
    console.log('Client is ready!');
});

let state = true;
client.on('message', async (msg) => {
    console.log('New message: ',msg.body, '{',msg.from,'}');
    if (msg.body == '!ping') {
        msg.reply('pong');
    }else if (msg.body === '!delete') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                msg.reply('I can only delete my own messages');
            }
        }
    } else{
        if(msg.body){

            if(msg.body.length>=3){
                try {
                    fetch(`http://api.brainshop.ai/get?bid=173036&key= <apikey> &uid=${msg.from}l956235&msg=${msg.body}`)
                    .then((data)=>{
                        return data.json()
                    }).then((data)=>{
                        console.log('BOT: ',data.cnt);
                        msg.reply(data.cnt);
                    })
                } catch (error) {
                    msg.reply("Provide a valid message!");
                }
            }
        }
    }
    // const chat = await msg.getChat();
    // setInterval(()=>{
    //     if(state){
    //         chat.sendStateTyping();
    //     }else{
    //         chat.sendStateRecording();
    //     }
    //     state = !state;
    // },7000)
});

client.initialize();
