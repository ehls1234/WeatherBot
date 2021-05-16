module.exports = {
    name: "변환",
    async execute(message,args){
        const Discord = require('discord.js')
        const {stripIndents} = require('common-tags')

        const conversionData = new Set(["미터","화씨","온스","파운드"])
        let translatedData = null
        let transResult = null
        let transUnit = null

        try{
            if(args[0] == null || isNaN(args[1]) === true || 
               args[1] == null || conversionData.has(args[0]) === false){
                return message.reply(new Discord.MessageEmbed()
                .setTitle("올바른 정보를 입력해주세요")
                .setColor("#ff5858")
                .addField("사용법",`${stripIndents`
                !변환 미터 <숫자>
                !변환 화씨 <숫자>
                !변환 온스 <숫자>
                !변환 파운드 <숫자>
                `}`))
            }
            if(args[0] == "미터" && isNaN(args[1]) === false){
                let metric = args[1]
                const peungCalculation = 3.306
                let peung = metric / peungCalculation

                transResult = peung.toFixed(2)
                transUnit = "평"
                translatedData = "m2 - > 평"
            }else if(args[0] == "화씨" && isNaN(args[1]) === false){
                let fahrenheit = args[1]
                let celsius = (fahrenheit-32) * 5/9

                transResult = celsius.toFixed(2)
                transUnit = "℃"
                translatedData = "℉ - > ℃"
            }else if(args[0] == "온스" && isNaN(args[1]) === false){
                let oz = args[1]
                let ozGram = oz * 28.35

                transResult = ozGram.toFixed(2)
                transUnit  =  "g"
                translatedData = "oz ->  g"
            }else if(args[0] == "파운드" && isNaN(args[1]) === false){
                let pound = args[1]
                let poundGram = pound * 453.592

                transResult = poundGram.toFixed(2)
                transUnit = "g"
                translatedData = "lb -> g"
            }
        }    
        catch(err){
            console.error(err)
        }
        const embed = new Discord.MessageEmbed()

            .setTitle(`${translatedData}`)
            .setColor("#4682b4")
            .setDescription(`${transResult} ${transUnit}`)

        const sendEmbed = await message.channel.send(embed)

        sendEmbed.react("❌")

        const stopFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id
        const stop = sendEmbed.createReactionCollector(stopFilter, {time: 900000, dispose: true})
        
        //stop
        stop.on("collect", r => {
            return sendEmbed.delete(),message.delete()
        })
    }
}