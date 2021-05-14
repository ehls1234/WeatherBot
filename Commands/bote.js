module.exports = {
    name: "모집",
    async execute(message,args){
        const Discord = require('discord.js')
        const {stripIndents} = require('common-tags')

        const embed = new Discord.MessageEmbed()

        return message.reply("점검중 입니다.")
    
        let mentions = []
        let userFields = []
        let userIdSet = new Set()
        let boteCount = args[1]

        try{
            if(args[0] == null){
                return message.reply("모집할 항목을 입력해주세요 !모집 <항목> <숫자(명수)>")
            }else if(boteCount == null || isNaN(args[1]) === true){
                return message.reply("모집할 명수를 입력해주세요 !모집 <항목> <숫자(명수)>")
            }else if(args[1] >= 16){
                return message.reply("현재 15명 까지만 지원 됩니다. 'SEDY'에게 문의해 주세요.")
            }
            else{
            embed.setColor("#4682b4")
            embed.setTitle(`"${args[0]}" ${args[1]}명 모집을 시작 합니다.`)
            embed.addFields(userFields)
            embed.setTimestamp()
            embed.setDescription(`${stripIndents`
            🖐 = 저요!
            💌 = 인원 호출(모집시작자)
            ❌ = 종료`}`)
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
            console.log(message.author)
            r.users.remove(message.author.id)
            if(userIdSet.has((message.author)) === true){
                message.reply("여러번 누르지 마세요!")
            }else if(mentions.length == boteCount){
                return message.reply("인원이 다차서 마감 되었습니다.")
            }
            else{
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
            for(let u = 0; u <= boteCount; u++){
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