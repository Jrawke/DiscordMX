'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', ()=> {
    console.log('MumbleExpress bot ready');
});

client.on('message', message => {
    if(message.content === "!mumble") {
	message.channel.sendMessage("up and running");
    }
});

client.login(config.token);
