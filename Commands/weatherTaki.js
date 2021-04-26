module.exports = {
    name: "내일날씨",
    execute(message,args){
        const weatherjs = require('weather-js')
        const Discord = require('discord.js')
        const fs = require('fs')
        const axios = require('axios')

        if(args[0] == null) return message.reply(new Discord.MessageEmbed().setTitle("올바른 시를 입력해주세요").setColor("#ff5858")
        .addField("사용법","!내일날씨 <시/도>"))

        weatherjs.find({search: args.join(" "), degreeType: 'C'},function(err,result){
            if (err) {
                return message.reply (
                    new Discord.MessageEmbed()
                        .setTitle("올바른 시를 입력해주세요")
                        .setColor("#ff5858")
                        .addField("사용법","!내일날씨 <시/도>")
                )
            }
            console.log(result[0])

            const API_KEY = "c13f40978e5aeaf76792cac87a6b3de6"
            const API_URL = `https://api.openweathermap.org/data/2.5/onecall`
            // ?lat=${lat}&lon=${lon}&exclude=${part}&appid=${API_KEY}`

            let cityname = result[0].location.name
            let latitude = result[0].location.lat
            let longitude = result[0].location.long

            if (cityname == null) {
                return message.reply (
                    new Discord.MessageEmbed()
                        .setTitle("올바른 시를 입력해주세요")
                        .setColor("#ff5858")
                        .addField("사용법","!내일날씨 <시/도>")
                )
            }

            axios.get(API_URL, {
                params: {
                   lat: latitude,
                   lon: longitude,
                   excludes: 'hourly',
                   appid: API_KEY,
                   units: 'metric'
                }
            })
            .then(res => {
                // 호출이 성공적으로 되면 res
                console.log(res.data.daily[1])
                const nextDay = res.data.daily[1]
                let iconcode = nextDay.weather[0].icon;
                let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                return message.reply (
                    new Discord.MessageEmbed()
                        .setTitle(`${cityname}`)
                        .setColor("#BFFF00")
                        .setAuthor('Openweathermap', 'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png', 'https://openweathermap.org/')
                        .setThumbnail(`${iconurl}`)
                        .addFields(
                        {name:"최소 온도",value: `${nextDay.temp.min}°C`,inline: true},
                        {name:"최대 온도", value:`${nextDay.temp.max}°C`, inline: true}
                        )
                        .addField("습도", `${nextDay.humidity}%`)
                        .addField("강수 확률", `${nextDay.pop}%`)
                        .addField("자외선 지수",`${nextDay.uvi} UVI`)
                        .setTimestamp()
                        .setFooter('Openweathermap By SEDY', 'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
                )
            })
            .catch(err => {
                // 호출이 실패하면 err
                console.error(err)
            })
        })
    }
}
