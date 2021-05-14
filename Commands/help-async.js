module.exports = {
    name: "날씨",
    async execute(message){
        const Discord = require('discord.js')
        const {stripIndents} = require("common-tags")

        let list1 = stripIndents`
        1️⃣ - 현재 날씨와 예보

        2️⃣ - 내일 날씨 예보

        3️⃣ - 내일부터 7일간 날씨 예보

        ❌ - 삭제

        -PS : 모든 주소는 네이버 주소를 참조합니다.
        `

        let list2 = stripIndents`
        **명령어 :  !오늘날씨 <시/도>**

        **페이지 설명**
        오늘 날씨 입니다. 미세먼지 경보까지 확인 할 수 있습니다.

        **이모지**
        "🌫" : 미세먼지 페이지.
        "❌" : 메세지를 삭제 합니다.

        Ⓜ - 메인으로 , ❌ - 삭제
        `

        let list3 = stripIndents`
        **명령어 :  !내일날씨 <시/도>**

        **페이지 설명**
        내일 날씨 입니다.
        평균 온도와 체감 온도에 대해 아침, 낮, 밤을 볼 수 있습니다.

        **이모지**
        "❌" : 메세지를 삭제 합니다.

        Ⓜ - 메인으로 , ❌ - 삭제
        `

        let list4 = stripIndents`
        **명령어 :  !7일날씨 <시/도>**

        **페이지 설명**
        내일(1일차) ~ 다음주 오늘까지 7일 입니다.

        **이모지**
        "⏪" : 맨 뒤 페이지로 갑니다.
        "◀" : 한 페이지 뒤로 갑니다.
        "❌" : 메세지를 삭제 합니다.
        "▶" : 한 페이지 앞으로 갑니다.
        "⏩" : 맨 앞 페이지로 갑니다.

        Ⓜ - 메인으로 , ❌ - 삭제
        `

        let pages = [list1,list2,list3,list4]
        let page = 1

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
	        .setAuthor('SEDY Weather bot Help', 'https://www.pinclipart.com/picdir/big/83-837011_image-result-for-coffee-icon-coffee-icon-png.png')
	        .setTitle('어떤 걸 알고 싶으세요?')
            .setDescription(pages[page - 1])
	        .setThumbnail('https://www.pinclipart.com/picdir/big/83-837011_image-result-for-coffee-icon-coffee-icon-png.png')
            .setImage("")
	        .setTimestamp()
	        .setFooter('SEDY Weather bot', 'https://www.pinclipart.com/picdir/big/83-837011_image-result-for-coffee-icon-coffee-icon-png.png')
        
        const sendEmbed = await message.channel.send(embed)
            
        if (pages.length === 1) return

        const emojiBox = ["1️⃣","2️⃣","3️⃣","❌","Ⓜ"]

        for(let i = 0; i < 4; i++){
            sendEmbed.react(emojiBox[i])
        }

        const stopFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id
        const oneFilter = (reaction, user) => reaction.emoji.name === "1️⃣" && user.id === message.author.id
        const twoFilter = (reaction, user) => reaction.emoji.name === "2️⃣" && user.id === message.author.id
        const threeFilter = (reaction, user) => reaction.emoji.name === "3️⃣" && user.id === message.author.id
        const mainFilter = (reaction, user) => reaction.emoji.name === "Ⓜ" && user.id === message.author.id


        const stop = sendEmbed.createReactionCollector(stopFilter, {time: 900000, dispose: true})
        const oneEmoji = sendEmbed.createReactionCollector(oneFilter, {time: 900000, dispose: true})
        const twoEmoji = sendEmbed.createReactionCollector(twoFilter, {time: 900000, dispose: true})
        const threeEmoji = sendEmbed.createReactionCollector(threeFilter, {time: 900000, dispose: true})
        const mainEmoji = sendEmbed.createReactionCollector(mainFilter, {time: 900000, dispose: true})
    
        stop.on("collect", r => {
            return sendEmbed.delete(),message.delete()
        })

        mainEmoji.on("collect", async r => {
            r.users.remove(message.author.id)
            if (pages[page-1] === 1) return
            page = 1
            embed.setDescription(pages[page-1]).setImage("")
            await sendEmbed.reactions.removeAll()
            sendEmbed.react("1️⃣")
            sendEmbed.react("2️⃣")
            sendEmbed.react("3️⃣")
            sendEmbed.react("❌")
            sendEmbed.edit(embed)
        })

        oneEmoji.on("collect", async r => {
            r.users.remove(message.author.id)
            if (pages[page-1] === 2) return
            page = 2
            embed.setDescription(pages[page-1]).setTitle('현재 날씨와 예보').setImage("https://www.who.int/images/default-source/imported/radiation/uv-ultraviolet-index.jpg?sfvrsn=8cd288e_5")
            // twoTest.remove()
            // threeTest.remove()
            await sendEmbed.reactions.removeAll()
            sendEmbed.react("Ⓜ")
            sendEmbed.react("❌")
            sendEmbed.edit(embed)
        })

        twoEmoji.on("collect", async r => {
            r.users.remove(message.author.id)
            if (pages[page-1] === 3) return
            page = 3
            embed.setDescription(pages[page-1]).setTitle('내일 날씨 예보').setImage("https://www.who.int/images/default-source/imported/radiation/uv-ultraviolet-index.jpg?sfvrsn=8cd288e_5")
            await sendEmbed.reactions.removeAll()
            sendEmbed.react("Ⓜ")
            sendEmbed.react("❌")
            sendEmbed.edit(embed)
        })

        threeEmoji.on("collect", async r => {
            r.users.remove(message.author.id)
            if (pages[page-1] === 4) return
            page = 4
            embed.setDescription(pages[page-1]).setTitle('내일부터 7일간 날씨 예보').setImage("https://www.who.int/images/default-source/imported/radiation/uv-ultraviolet-index.jpg?sfvrsn=8cd288e_5")
            await sendEmbed.reactions.removeAll()
            sendEmbed.react("Ⓜ")
            sendEmbed.react("❌")
            sendEmbed.edit(embed)
        })
    }
}