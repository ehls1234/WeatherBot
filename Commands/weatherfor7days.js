module.exports = {
    name: "7일날씨",
    async execute(message,args){
        const Discord = require('discord.js')
        const axios = require('axios')
        
        if(args[0] == null) return message.reply(new Discord.MessageEmbed().setTitle("올바른 정보를 입력해 주세요.").setColor("#ff5858")
        .addField("사용법","!7일날씨 <시/도>"))

        const naverGeo = {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': 'oulqcr7gqi',
                'X-NCP-APIGW-API-KEY': 'gywZuBAAs9J1Qo5NzxaMY5N4i0mDMjyregJQlvtM'
            },
            params: {
                "query": args.join(" ")
            }
        }

        let cityname = null
        let latitude = null
        let longitude = null
        try{
            const naverAxios = await axios
            .get("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode", naverGeo)

                if (naverAxios.data.addresses[0] == null) {
                    return message.reply (
                        new Discord.MessageEmbed()
                        .setTitle("알수없는 주소 입니다.")
                        .setColor("#ff5858")
                        .addField("사용법","!7일날씨 이름이 아닌 정확한 주소를 입력해 주세요.")
                    )
                }

            cityname = naverAxios.data.addresses[0].roadAddress
            latitude = naverAxios.data.addresses[0].y
            longitude = naverAxios.data.addresses[0].x
        }
        catch(naverAxiosErr){
            console.log(naverAxiosErr)
            return message.reply("naverMaps API 정보를 받아 올 수 없습니다.")
        }
        const API_KEY = "c13f40978e5aeaf76792cac87a6b3de6"
        const API_URL = `https://api.openweathermap.org/data/2.5/onecall`
        // ?lat=${lat}&lon=${lon}&exclude=${part}&appid=${API_KEY}`
        
        let toDay = null, toDayDaily1 = null, toDayDaily2 = null, toDayDaily3 = null, toDayDaily4 = null, toDayDaily5 = null, toDayDaily6 = null, toDayDaily7 = null
        
        try{
            const openWeatherMapAxios = await axios
            .get(API_URL, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    excludes: 'hourly',
                    appid: API_KEY,
                    units: 'metric'
                }
            })
            // 호출이 성공적으로 되면 openWeatherMapAxios
            //console.log(openWeatherMapAxios.data.daily[1]은 다음날 '예보')
            toDay = openWeatherMapAxios.data.current
            toDayDaily1 = openWeatherMapAxios.data.daily[1]
            toDayDaily2 = openWeatherMapAxios.data.daily[2]
            toDayDaily3 = openWeatherMapAxios.data.daily[3]
            toDayDaily4 = openWeatherMapAxios.data.daily[4]
            toDayDaily5 = openWeatherMapAxios.data.daily[5]
            toDayDaily6 = openWeatherMapAxios.data.daily[6]
            toDayDaily7 = openWeatherMapAxios.data.daily[7]
        }
        catch(openWeatherMapAxiosErr){
            console.log(openWeatherMapAxiosErr)
            return message.reply("openWeatherMap API 정보를 받아 올 수 없습니다.")
        }

        let list1 = 
        [toDayDaily1.temp.min+"°C",
        toDayDaily1.temp.max+"°C",
        toDayDaily1.uvi+" UVI",
        toDayDaily1.temp.day+"°C",
        toDayDaily1.feels_like.day+"°C",
        toDayDaily1.humidity+"%",
        Math.floor(toDayDaily1.pop*100)+"%",
        toDayDaily1.rain+"mm",
        toDayDaily1.snow+"mm",
        toDayDaily1.weather[0].icon]

        let list2 =           
        [toDayDaily2.temp.min+"°C",
        toDayDaily2.temp.max+"°C",
        toDayDaily2.uvi+" UVI",
        toDayDaily2.temp.day+"°C",
        toDayDaily2.feels_like.day+"°C",
        toDayDaily2.humidity+"%",
        Math.floor(toDayDaily2.pop*100)+"%",
        toDayDaily2.rain+"mm",
        toDayDaily2.snow+"mm",
        toDayDaily2.weather[0].icon]

        let list3 =             
        [toDayDaily3.temp.min+"°C",
        toDayDaily3.temp.max+"°C",
        toDayDaily3.uvi+" UVI",
        toDayDaily3.temp.day+"°C",
        toDayDaily3.feels_like.day+"°C",
        toDayDaily3.humidity+"%",
        Math.floor(toDayDaily3.pop*100)+"%",
        toDayDaily3.rain+"mm",
        toDayDaily3.snow+"mm",
        toDayDaily3.weather[0].icon]

        let list4 =             
        [toDayDaily4.temp.min+"°C",
        toDayDaily4.temp.max+"°C",
        toDayDaily4.uvi+" UVI",
        toDayDaily4.temp.day+"°C",
        toDayDaily4.feels_like.day+"°C",
        toDayDaily4.humidity+"%",
        Math.floor(toDayDaily4.pop*100)+"%",
        toDayDaily4.rain+"mm",
        toDayDaily4.snow+"mm",
        toDayDaily4.weather[0].icon]

        let list5 =             
        [toDayDaily5.temp.min+"°C",
        toDayDaily5.temp.max+"°C",
        toDayDaily5.uvi+" UVI",
        toDayDaily5.temp.day+"°C",
        toDayDaily5.feels_like.day+"°C",
        toDayDaily5.humidity+"%",
        Math.floor(toDayDaily5.pop*100)+"%",
        toDayDaily5.rain+"mm",
        toDayDaily5.snow+"mm",
        toDayDaily5.weather[0].icon]

        let list6 =             
        [toDayDaily6.temp.min+"°C",
        toDayDaily6.temp.max+"°C",
        toDayDaily6.uvi+" UVI",
        toDayDaily6.temp.day+"°C",
        toDayDaily6.feels_like.day+"°C",
        toDayDaily6.humidity+"%",
        Math.floor(toDayDaily6.pop*100)+"%",
        toDayDaily6.rain+"mm",
        toDayDaily6.snow+"mm",
        toDayDaily6.weather[0].icon]

        let list7 =             
        [toDayDaily7.temp.min+"°C",
        toDayDaily7.temp.max+"°C",
        toDayDaily7.uvi+" UVI",
        toDayDaily7.temp.day+"°C",
        toDayDaily7.feels_like.day+"°C",
        toDayDaily7.humidity+"%",
        Math.floor(toDayDaily7.pop*100)+"%",
        toDayDaily7.rain+"mm",
        toDayDaily7.snow+"mm",
        toDayDaily7.weather[0].icon]
            

        let pages = [list1,list2,list3,list4,list5,list6,list7]
        let page = 1
    
        const embed = new Discord.MessageEmbed()
            .setTitle(`${cityname}`)
            .setDescription(`${page}일차 예보 날씨`)
            .setColor("#BFFF00")
            .setAuthor('Openweathermap', 'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png', 'https://openweathermap.org/')
            .setThumbnail(`${"http://openweathermap.org/img/w/" + pages[page - 1][9] + ".png"}`)
            .addFields(
                {name:"최소 온도",value: `${pages[page - 1][0]}`,inline: true},
                {name:"최대 온도", value:`${pages[page - 1][1]}`, inline: true},
                {name:"자외선 지수", value:`${pages[page - 1][2]}`, inline: true},
                {name:"평균 온도",value: `${pages[page - 1][3]}`,inline: true},
                {name:"체감 온도", value:`${pages[page - 1][4]}`, inline: true},
                {name:"습도",value: `${pages[page - 1][5]}`,inline: true},
                {name:"강수 확률", value:`${pages[page - 1][6]}`, inline: true},
                {name:"강수량", value:`${pages[page - 1][7]}`, inline: true},
                {name:"적설량", value:`${pages[page - 1][8]}`, inline: true}
                )
            .setTimestamp()
            .setFooter(`SEDY Weather Page: ${page} / ${pages.length}`,'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
        
        const weatherFields = embed.fields.map(v => v)

        if(pages[page - 1][7] === undefined+"mm"){
            weatherFields[7].value = "0mm"
        }
        if(pages[page - 1][8] === undefined+"mm"){
            weatherFields[8].value = "0mm"
        }

        const sendEmbed = await message.channel.send(embed)

        const emojiBox = ["⏪","◀","⏺","▶","⏩"]
    
        if (pages.length === 1) return

        for(let i = 0; i < 5; i++){
            sendEmbed.react(emojiBox[i])
        }
    
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
            embed.setDescription(`${page}일차 예보 날씨`).setFooter(`SEDY Weather page: ${page} / ${pages.length}`,'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
            embed.setThumbnail(`${"http://openweathermap.org/img/w/" + pages[page - 1][9] + ".png"}`)
            for(let v = 0; v < 9; v++){
                weatherFields[v].value = pages[page - 1][v]
            }
            if(pages[page - 1][7] === undefined+"mm"){
                weatherFields[7].value = "0mm"
            }
            if(pages[page - 1][8] === undefined+"mm"){
                weatherFields[8].value = "0mm"
            }
            sendEmbed.edit(embed)
        })

    //Forward
        forward.on("collect", r => {
            r.users.remove(message.author.id)
            if (page === pages.length) return
            page++
            embed.setDescription(`${page}일차 예보 날씨`).setFooter(`SEDY Weather page: ${page} / ${pages.length}`,'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
            embed.setThumbnail(`${"http://openweathermap.org/img/w/" + pages[page - 1][9] + ".png"}`)
            for(let v = 0; v < 9; v++){
                weatherFields[v].value = pages[page - 1][v]
            }
            if(pages[page - 1][7] === undefined+"mm"){
                weatherFields[7].value = "0mm"
            }
            if(pages[page - 1][8] === undefined+"mm"){
                weatherFields[8].value = "0mm"
            }
            sendEmbed.edit(embed)
        })

    //stop
        stop.on("collect", r => {
            return sendEmbed.delete(),message.delete()
        })

    //Skip Forward
        fastForward.on("collect", r => {
            r.users.remove(message.author.id)
            if (page === pages.length) return
            page = pages.length
            embed.setDescription(`${page}일차 예보 날씨`).setFooter(`SEDY Weather page: ${page} / ${pages.length}`,'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
            embed.setThumbnail(`${"http://openweathermap.org/img/w/" + pages[page - 1][9] + ".png"}`)
            for(let v = 0; v < 9; v++){
                weatherFields[v].value = pages[page - 1][v]
            }
            if(pages[page - 1][7] === undefined+"mm"){
                weatherFields[7].value = "0mm"
            }
            if(pages[page - 1][8] === undefined+"mm"){
                weatherFields[8].value = "0mm"
            }
            sendEmbed.edit(embed)
        })

    //Skip Reverse
        fastReverse.on("collect", r => {
            r.users.remove(message.author.id)
            if (page === 1) return
            page = 1
            embed.setDescription(`${page}일차 예보 날씨`).setFooter(`SEDY Weather page: ${page} / ${pages.length}`,'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
            embed.setThumbnail(`${"http://openweathermap.org/img/w/" + pages[page - 1][9] + ".png"}`)
            for(let v = 0; v < 9; v++){
                weatherFields[v].value = pages[page - 1][v]
            }
            if(pages[page - 1][7] === undefined+"mm"){
                weatherFields[7].value = "0mm"
            }
            if(pages[page - 1][8] === undefined+"mm"){
                weatherFields[8].value = "0mm"
            }
            sendEmbed.edit(embed)
        })
    }
}