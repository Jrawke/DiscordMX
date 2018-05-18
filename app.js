'use strict';

const fs = require('fs');

// load discord JS libs
const Discord = require('discord.js');

// load mumble JS libs
const Mumble = require('mumble');

// load config
const DiscordConfig = require('./config.json');
const MumbleConfig = {
    key: fs.readFileSync( 'ssl/mumble/private.key' ),
    cert: fs.readFileSync( 'ssl/mumble/cert.crt' )
};

function CMumble() {
    this.connect = function(server_address, message_callback) {
	Mumble.connect( server_address, MumbleConfig, function ( error, client ) {
	    try {
		if( error ) {
		    io.sockets.connected[socket].emit("errorMessage","Could not connect");
		    throw new Error( error );
		}

		client.authenticate( 'DiscordMX' );

		client.on('textMessage', function(data) {message_callback(data.message)});
		client.on('ready', function() {
		    message_callback('connected to ' + server_address);
		});
	    }
	    catch(e) {
		message_callback('could not connect: ' + e.toString());
	    }
	});
    }
}

function CDiscord(config) {
    this.discord_client = new Discord.Client();
    this.config = config;
    this.channel_id;

    this.message_callback = (function(message) {
	var channel = this.discord_client.channels.find("id", this.channel_id)
	channel.sendMessage(message)
    }).bind(this);

    this.discord_client.on('ready', ()=> {
	console.log('MumbleExpress bot ready');
    });

    this.discord_client.on('message', message => {
	var command = message.content.split(" ");
	if(command[0] !== '!mumble')
	{
	    // this message was not meant for the bot
	    return;
	}

	if(command.length === 1)
	{
	    message.channel.sendMessage("DiscordMX is up and running");
	    return;
	}

	if(command[1] === 'join')
	{
	    if(command.length === 2)
	    {
		message.channel.sendMessage("missing mumble server URL");
		return;
	    }

	    var url = command[2];
	    this.channel_id = message.channel.id;
	    this.mumble = new CMumble();
	    this.mumble.connect(url, this.message_callback);
	}

    });

    this.discord_client.login(config.token);
}

var oDiscord = new CDiscord(DiscordConfig);
