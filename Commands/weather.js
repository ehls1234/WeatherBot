module.exports = {
    name: "오늘날씨",
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
            
        const naverAxios = await axios
            .get("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode", naverGeo)

        const API_KEY = "c13f40978e5aeaf76792cac87a6b3de6"
        const API_URL = `https://api.openweathermap.org/data/2.5/onecall`
        // ?lat=${lat}&lon=${lon}&exclude=${part}&appid=${API_KEY}`
        if (naverAxios.data.addresses[0] == null) {
            return message.reply (
                new Discord.MessageEmbed()
                .setTitle("알수없는 주소 입니다.")
                .setColor("#ff5858")
                .addField("사용법","!오늘날씨 이름이 아닌 정확한 주소를 입력해 주세요.")
            )
        }

        let cityname = naverAxios.data.addresses[0].roadAddress
        let latitude = naverAxios.data.addresses[0].y
        let longitude = naverAxios.data.addresses[0].x
        let guName = cityname.slice().trim().split(/ +/)   //args[1]

        let concentration10 = null, concentration25 = null, pm10Value = null, pm25Value = null, isDustProcessed = false

        const dustAxios = await axios 
            .get(`http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty`,{
                params: {
                    serviceKey: "zoALXhvtGbPAtIKDwmsVk5KDDsO+aA7Y1CkDwLfdoxYk/3WHjJ68bvl27cvh+NOscS/uYHVspUWS+VgoIvr/Aw==",
                    stationName: guName[1],
                    returnType: "json",
                    dataTerm : "DAILY",
                    ver: "1.3"

                }
            })
        if (
            guName != null && guName.length > 1 &&
            dustAxios.data.response.header.resultCode === '00' &&
            dustAxios.data.response.body.totalCount > 0
        ) {
            const dustData = dustAxios.data.response.body.items.shift()
            const { pm10Grade, pm25Grade } = dustData
            pm10Value = dustData.pm10Value
            pm25Value = dustData.pm25Value
            console.log([pm10Value, pm25Value, pm10Grade, pm25Grade])
            const grades = ['좋음', '보통', '나쁨', '매우나쁨']
            // 1 : 좋음, 2: 보통, 3: 나쁨, 4: 매우나쁨
        
            if(pm25Value <= 15){
                concentration25 = grades[0]}
            else if(pm25Value <= 35){
                concentration25 = grades[1]
            }else if(pm25Value <= 75){
                concentration25 = grades[2]
            }else{
                concentration25 = grades[3]
            }

            if(pm10Value <= 30){
                concentration10 = grades[0]
            }else if(pm10Value <= 80) {
                concentration10 = grades[1]
            }else if(pm10Value <= 150) {
                concentration10 = grades[2]
            }else{
                concentration10 = grades[3]
            }

            console.log([concentration10, concentration25])
            isDustProcessed = true
        }
        
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
        const nextDay = openWeatherMapAxios.data.daily[1]
        const toDay = openWeatherMapAxios.data.current
        const toDayDaily = openWeatherMapAxios.data.daily[0]
        let iconcode = toDay.weather[0].icon;
        let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
       
        let rainValue = null
        let snowValue = null
        if(toDayDaily.rain == null){
            rainValue = "0"
        }
        else{
            rainValue = toDayDaily.rain
        }

        if(toDayDaily.snow == null){
            snowValue = "0"
        }
        else{
            snowValue = toDayDaily.snow
        }

        const fields = [
            {name:"🌡온도",value: `${stripIndents`
            최소 :  ${toDayDaily.temp.min}°C  ,  최대 :  ${toDayDaily.temp.max}°C
            현재 :  ${toDay.temp}°C  ,  체감 :  ${toDay.feels_like}°C
            `}`,inline: false},

            {name:"🌦날씨",value: `${stripIndents`
            습도 : ${toDay.humidity}%
            강수 확률 : ${toDayDaily.pop*100}%
            강수량 : ${rainValue}mm
            `}`,inline: false},

            {name:"🚨자외선 지수", value:`${toDay.uvi} UVI`, inline: false},
            {name:"🌬바람",value: `${stripIndents`
            풍속 : ${toDay.wind_speed}m/s
            `}`,inline: false}
        ]
        
        if (isDustProcessed === true ) {
            fields.push({name:"🌫미세먼지", value:`${stripIndents`
            초미세먼지(PM 2.5) : ${pm25Value} ㎍/㎥ , ${concentration25}
            미세먼지(PM 10) : ${pm10Value} ㎍/㎥ , ${concentration10}
            `}`,inline: false})
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`${cityname}`)
            .setColor("#4682b4")
            .setAuthor('SEDY Weather Bot','https://www.pinclipart.com/picdir/big/83-837011_image-result-for-coffee-icon-coffee-icon-png.png')
            .setDescription('사용후 "❌"이모지를 눌러주세요.')
            .setThumbnail(`${iconurl}`)
            .addFields(fields)

            .setTimestamp()
            .setFooter('Openweathermap By SEDY', 'https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')

        const sendEmbed = await message.channel.send(embed)
        sendEmbed.react("❌")

        const stopFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id
        const stop = sendEmbed.createReactionCollector(stopFilter, {time: 900000, dispose: true})
        
        //stop
        stop.on("collect", r => {
            return sendEmbed.delete()
        })
    }//execute(message,args) 종료
}//module.exports 종료