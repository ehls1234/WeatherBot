module.exports = {
    name: "모집",
    async execute(message,args){
        const Discord = require('discord.js')
        const {stripIndents} = require('common-tags')

        const embed = new Discord.MessageEmbed()

        let mentions = []
        let userFields = []
        let userIdSet = new Set()
    
        try{
            if(args[0] == null){
               return message.reply("모집할 항목을 입력해주세요 !모집 <항목>")
            }else{
            embed.setColor("#4682b4")
            embed.setTitle(`"${args[0]}" 모집을 시작 합니다.`)
            embed.addFields(userFields)
            embed.setTimestamp()
        }}
        catch(err){
            console.error(err)
        }
        const sendEmbed = await message.channel.send(embed)

        sendEmbed.react("🖐")
        sendEmbed.react("💌")
        sendEmbed.react("❌")

        const meFilter = (reaction, user) => reaction.emoji.name === "🖐" && user.bot === false
        const hereFilter = (reaction, user) => reaction.emoji.name === "💌" && user.id === message.author.id
        const stopFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id
        
        const stop = sendEmbed.createReactionCollector(stopFilter, {time: 900000, dispose: true})
        const me = sendEmbed.createReactionCollector(meFilter, {time: 900000, dispose: true})
        const here = sendEmbed.createReactionCollector(hereFilter, {time: 900000, dispose: true})
    
        //stop
        stop.on("collect",async r => {
            await message.delete()
            embed.setColor("FF0000")
            embed.setTitle(`"${args[0]}" 모집이 종료 되었습니다.`)
            await sendEmbed.reactions.removeAll()
            sendEmbed.edit(embed)
            return message.channel.send(`"${args[0]}"모집이 종료 되었습니다.`)
        })

        me.on("collect",async r => {
            r.users.remove(message.author.id)
            if(userIdSet.has((message.author)) === true){
                message.reply("여러번 누르지 마세요!")
            }else{
                userFields.push(
                {name:"사용자",value: `${stripIndents`
                ${message.author.username}
                `}`,inline: true}
                )
                embed.fields = userFields
                mentions.push(message.author)
                userIdSet.add(message.author)
            }
            sendEmbed.edit(embed)
        })

        here.on("collect",async r => {
            r.users.remove(message.author.id)
            console.log(userIdSet.User)
            for(let u = 0; u <= 20; u++){
                if(mentions.length == 0){
                    return message.channel.send(`모집대상이 없습니다.`)
                }else if(mentions[u] == null){
                    return message.channel.send(`모집대상 ${mentions.length}명 호출 했습니다.`)
                }
                else{
                    message.channel.send(`${mentions[u]}`)
                }
            }
            sendEmbed.edit(embed)
        })
    }
}