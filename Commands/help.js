module.exports = {
    name: "날씨도움말",
    execute(message){
        const Discord = require('discord.js')

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
	        .setAuthor('SEDY Weather bot Help', 'https://theme.zdassets.com/theme_assets/678183/af1a442f9a25a27837f17805b1c0cfa4d1725f90.png')
	        .setTitle('명령어')
            .setDescription('버튼을 연속으로 누르지 마세요!')
	        .setThumbnail('https://theme.zdassets.com/theme_assets/678183/af1a442f9a25a27837f17805b1c0cfa4d1725f90.png')
	        .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '!오늘날씨', value: '<시/도>', inline: true },
	        	{ name: '!내일날씨', value: '<시/도>', inline: true },
                { name: '!7일날씨', value: '<시/도>', inline: true },
                { name: '( EX )', value: '!7일날씨 서울', inline: false }
	        )
	        .setTimestamp()
	        .setFooter('SEDY Weather bot', 'https://theme.zdassets.com/theme_assets/678183/af1a442f9a25a27837f17805b1c0cfa4d1725f90.png')
        
        message.channel.send(embed).then(sendEmbed => {
            sendEmbed.react("❌")

            const stopFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id
            const stop = sendEmbed.createReactionCollector(stopFilter, {time: 900000, dispose: true})
        
            stop.on("collect", r => {
                return sendEmbed.delete()
            })

        })
    }
}