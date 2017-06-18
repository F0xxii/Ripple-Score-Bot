const WebSocket = require('ws');
const Discord = require('discord.js');
const https = require('https');
const settings = require('./settings.json');
const client = new Discord.Client();

client.login(settings.token);

// WebSocket handler. Messy? Dunno.

const ws = new WebSocket('wss://api.ripple.moe/api/v1/ws');
ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'subscribe_scores', data: [] }));
});

ws.on('message', (data) => {
  data = JSON.parse(data);
  if (data.type == 'new_score') {
    https.get(`https://ripple.moe/api/v1/users?id=${data.data.user_id}`, (res) => {
      res.on('data', (chunk) => {
        chunk = JSON.parse(chunk);
        let embed = new Discord.RichEmbed()
          .setColor(3447003)
          .setAuthor(client.user.username, client.user.displayAvatarURL)
          .setTitle('New score!')
          .setDescription(`A new score has been set by ${chunk.username}!`)
          .addField('Score ID', data.data.id, true)
          .addField('Beatmap MD5', data.data.beatmap_md5, true)
          .addField('Score', data.data.score, true)
          .addField('Max Combo', data.data.max_combo, true)
          .addField('Mods', data.data.mods, true)
          .addField('300s', data.data.count_300, true)
          .addField('100s', data.data.count_100, true)
          .addField('50s', data.data.count_50, true)
          .addField('Gekis', data.data.count_geki, true)
          .addField('Katus', data.data.count_katu, true)
          .addField('Time Submitted', data.data.time, true)
          .addField('Mode', data.data.play_mode, true)
          .addField('Accuracy', data.data.accuracy, true)
          .addField('PP', data.data.pp, true);
        client.channels.get(settings.scores_channel_id).send({ embed: embed });
      });
    });
   }
});

