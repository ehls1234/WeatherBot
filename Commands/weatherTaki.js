module.exports = {
    name: "내일날씨",
    execute(message,args){
        const Discord = require('discord.js')
        const axios = require('axios').default

        if(args[0] == null) return message.reply(new Discord.MessageEmbed().setTitle("올바른 시를 입력해주세요").setColor("#ff5858")
        .addField("사용법","!내일날씨 <시/도>"))

        const naverGeo = {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': 'oulqcr7gqi',
                'X-NCP-APIGW-API-KEY': 'gywZuBAAs9J1Qo5NzxaMY5N4i0mDMjyregJQlvtM'
            },
            params: {
                "query": args.join(" ")
            }
        }
            
        axios
            .get("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode", naverGeo)
            .then((response) => {
                const API_KEY = "c13f40978e5aeaf76792cac87a6b3de6"
                const API_URL = `https://api.openweathermap.org/data/2.5/onecall`
                // ?lat=${lat}&lon=${lon}&exclude=${part}&appid=${API_KEY}`

                if (response.data.addresses[0] == null) {
                    return message.reply (
                        new Discord.MessageEmbed()
                        .setTitle("알수없는 주소 입니다.")
                        .setColor("#ff5858")
                        .addField("사용법","!오늘날씨 이름이 아닌 정확한 주소를 입력해 주세요.")
                    )
                }

                let cityname = response.data.addresses[0].roadAddress
                let latitude = response.data.addresses[0].y
                let longitude = response.data.addresses[0].x

                axios
                    .get(API_URL, {
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
                        //console.log(res.data.daily[1])
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
                            {name:"최대 온도", value:`${nextDay.temp.max}°C`, inline: true},
                            {name:"평균 온도",value: `${nextDay.temp.day}°C`,inline: false},
                            {name:"체감 온도", value:`${nextDay.feels_like.day}°C`, inline: false}
                            )
                            .addFields(
                            {name:"습도",value: `${nextDay.humidity}%`,inline: true},
                            {name:"강수 확률", value:`${nextDay.pop}%`, inline: true},
                            {name:"자외선 지수", value:`${nextDay.uvi} UVI`, inline: true}
                            )
                            .setTimestamp()
                            .setFooter('Openweathermap By SEDY', 'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
                        )
                    })// openWeatherMap의 .then((response) => 종료
                    .catch(err => {
                        console.error(err)
                        // 오픈웨더 호출이 실패하면 err
                    })
            })// naverGeo의 .then((response) => 종료
            .catch((error) => {
                console.log(error.response)
                // 네이버 호출이 실패하면 err
            })
    }//execute(message,args) 종료
}//module.exports 종료