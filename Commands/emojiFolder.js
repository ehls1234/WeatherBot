module.exports = {
    name: "이모지",
    execute(message,args){
        const Discord = require('discord.js')
        const {stripIndents} = require('common-tags')
        
        if(args[0] == null) return message.reply(new Discord.MessageEmbed().setTitle("올바른 정보를 입력해 주세요.").setColor("#ff5858")
        .addField("사용법","!이모지 확인"))

            if (args[0] === "확인"){
                let list1 = stripIndents`
                Test number one.

                one.
                `

                let list2 = stripIndents`
                Also, this one.

                Two
                `

                let list3 = stripIndents`
                Also, this one.

                **three**
                `

                let pages = [list1,list2,list3]
                let page = 1

                const embed = new Discord.MessageEmbed()
                .setFooter(`Page: ${page} / ${pages.length}`)
                .setDescription(pages[page - 1])

                message.channel.send(embed).then(sendEmbed => {

                if (pages.length === 1) return

                sendEmbed.react("⏪")
                sendEmbed.react("◀")
                sendEmbed.react("⏺")
                sendEmbed.react("▶")
                sendEmbed.react("⏩")
                
                const backwardFilter = (reaction, user) => reaction.emoji.name === "◀" && user.id === message.author.id
                const forwardFilter = (reaction, user) => reaction.emoji.name === "▶" && user.id === message.author.id
                const stopFilter = (reaction, user) => reaction.emoji.name === "⏺" && user.id === message.author.id
                const fastForwardFilter = (reaction, user) => reaction.emoji.name === "⏩" && user.id === message.author.id
                const fastBackwardFilter = (reaction, user) => reaction.emoji.name === "⏪" && user.id === message.author.id
           
                const backward = sendEmbed.createReactionCollector(backwardFilter, {time: 900000, dispose: true})
                const forward = sendEmbed.createReactionCollector(forwardFilter, {time: 900000, dispose: true})
                const stop = sendEmbed.createReactionCollector(stopFilter, {time: 900000, dispose: true})
                const fastReverse = sendEmbed.createReactionCollector(fastBackwardFilter, {time: 900000, dispose: true})
                const fastForward = sendEmbed.createReactionCollector(fastForwardFilter, {time: 900000, dispose: true})

                //Backward
                backward.on("collect", r => {
                    r.users.remove(message.author.id)
                    if (page === 1) return
                    page--
                    embed.setDescription(pages[page-1]).setFooter(`page: ${page} / ${pages.length}`)
                    sendEmbed.edit(embed)
                })

                //Forward
                forward.on("collect", r => {
                    r.users.remove(message.author.id)
                    if (page === pages.length) return
                    page++
                    embed.setDescription(pages[page-1]).setFooter(`page: ${page} / ${pages.length}`)
                    sendEmbed.edit(embed)
                })

                //stop
                stop.on("collect", r => {
                    return sendEmbed.delete()
                })

                //Skip Forward
                fastForward.on("collect", r => {
                    r.users.remove(message.author.id)
                    if (page === pages.length) return
                    page = pages.length
                    embed.setDescription(pages[page-1]).setFooter(`page: ${page} / ${pages.length}`)
                    sendEmbed.edit(embed)
                })

                //Skip Reverse
                fastReverse.on("collect", r => {
                    r.users.remove(message.author.id)
                    if (page === 1) return
                    page = 1
                    embed.setDescription(pages[page-1]).setFooter(`page: ${page} / ${pages.length}`)
                    sendEmbed.edit(embed)
                })
            }
        )}

        /*const axios = require('axios').default

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
        */
    }
}