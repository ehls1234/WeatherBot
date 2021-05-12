module.exports = {
    name: "내일날씨",
    async execute(message,args){
        const Discord = require('discord.js')
        const axios = require('axios').default
        const {stripIndents} = require('common-tags')
    
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
                    .addField("사용법","!오늘날씨 이름이 아닌 정확한 주소를 입력해 주세요.")
                )
            }
        
            cityname = naverAxios.data.addresses[0].roadAddress
            latitude = naverAxios.data.addresses[0].y
            longitude = naverAxios.data.addresses[0].x
            }
        catch(naverAxiosErr){
            console.log(naverAxiosErr)
            return message.reply("naverMaps API를 받아 올 수 없습니다.")
        }

        const API_KEY = "c13f40978e5aeaf76792cac87a6b3de6"
        const API_URL = `https://api.openweathermap.org/data/2.5/onecall`
        // ?lat=${lat}&lon=${lon}&exclude=${part}&appid=${API_KEY}`
        let nextDay = null        
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
            //console.log(openWeatherMapAxios.data.daily[1])
            nextDay = openWeatherMapAxios.data.daily[1]
        }
        catch(openWeatherMapAxiosErr){
            console.log(openWeatherMapAxiosErr)
            return message.reply("openWeatherMap API를 받아 올 수 없습니다.")
        }

        let iconcode = nextDay.weather[0].icon;
        let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        
        let rainValue = null
        let snowValue = null
        if(nextDay.rain == null){
            rainValue = "0"
        }
        else{
            rainValue = nextDay.rain
        }
    
        if(nextDay.snow == null){
            snowValue = "0"
        }
        else{
            snowValue = nextDay.snow
        }
    
        const embed = new Discord.MessageEmbed()
            .setTitle(`${cityname}`)
            .setColor("#4682b4")
            .setAuthor('SEDY Weather Bot','https://www.pinclipart.com/picdir/big/83-837011_image-result-for-coffee-icon-coffee-icon-png.png')
            .setDescription('사용 후 "❌"이모지를 눌러주세요.')
            .setThumbnail(`${iconurl}`)
            .addFields(
            {name:"🌡온도",value: `${stripIndents`
            최소 :  ${nextDay.temp.min}°C  ,  최대 :  ${nextDay.temp.max}°C
            아침 평균 :  ${nextDay.temp.morn}°C  ,  아침 체감 :  ${nextDay.feels_like.morn}°C
            낮 평균 :  ${nextDay.temp.day}°C  ,  낮 체감 :  ${nextDay.feels_like.day}°C
            밤 평균 :  ${nextDay.temp.night}°C  ,  밤 체감 :  ${nextDay.feels_like.night}°C
            `}`,inline: false},
            
            {name:"🌦날씨",value: `${stripIndents`
            습도 : ${nextDay.humidity}%
            강수 확률 : ${nextDay.pop*100}%
            강수량 : ${rainValue}mm
            `}`,inline: false},
            
            {name:"🚨자외선 지수", value:`${nextDay.uvi} UVI`, inline: false},
            {name:"🌬바람",value: `${stripIndents`
            풍속 : ${nextDay.wind_speed}m/s
            `}`,inline: false}
            )
            .setTimestamp()
            .setFooter('Openweathermap By SEDY', 'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
            
            
        const sendEmbed = await message.channel.send(embed)
        sendEmbed.react("❌")
            
        const stopFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id
        const stop = sendEmbed.createReactionCollector(stopFilter, {time: 900000, dispose: true})
            
        //stop
        stop.on("collect", r => {
            return sendEmbed.delete(),message.delete()
        })

    }//execute(message,args) 종료
}//module.exports 종료