module.exports = {
    name: "이모지",
    execute(message,args){
        const Discord = require('discord.js')
        const axios = require('axios').default

        const embed = new Discord.MessageEmbed()

            .setTitle("반응하세요")
            .setColor("#6AB048")
            .addField("둘중 하나 반응",'👍  ,  👎')
            
        message.channel.send(embed).then(sendEmbed => {
            sendEmbed.react("👍")
            sendEmbed.react("👎")
            
            const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.bot === false
            sendEmbed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
	        .then(collected => {
		    const reaction = collected.first()

		        if (reaction.emoji.name === '👍') {
			    message.reply('you reacted with a thumbs up.')
		        } else {
			    message.reply('you reacted with a thumbs down.')
		        }
            console.log(collected)
	        })
	    .catch(collected => {
		message.reply('you reacted with neither a thumbs up, nor a thumbs down.')
	    })
    })

        console.log(message.content)
        
    }
}