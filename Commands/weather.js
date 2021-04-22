module.exports = {
    name: "오늘날씨",
    execute(message,args){
        const Discord = require('discord.js')
        const fs = require('fs')
        const date = new Date()
        var time = 0200
        const nowyear = date.getFullYear()
        const nowmonth = ("0" + (date.getMonth() + 1)).slice(-2)
        const nowdate = ("0" + date.getDate()).slice(-2)
        const format = nowyear+""+nowmonth+""+nowdate
        var request = require('request');
        var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=zoALXhvtGbPAtIKDwmsVk5KDDsO%2BaA7Y1CkDwLfdoxYk%2F3WHjJ68bvl27cvh%2BNOscS%2FuYHVspUWS%2BVgoIvr%2FAw%3D%3D';
        queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); 
        if(date.getHours() > 1){
            time = "0200"
            if(date.getHours() > 4){
                time = "0500"
                if(date.getHours() > 7){
                    time = "0800"
                    if(date.getHours() > 10){
                        time = "1100"
                        if(date.getHours() > 13){
                            time = "1400"
                            if(date.getHours() > 16){
                                time = "1700"
                                if(date.getHours() > 19){
                                    time = "2000"
                                    if(date.getHours() > 22){
                                        time = "2300"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if(args[0] == null) return message.reply(new Discord.MessageEmbed().setTitle("올바른 시 또는 도를 입력해주세요").setColor("#ff5858")
        .addField("사용법","!오늘날씨 <시/도> <선택:시/구/군> <선택:읍/면/동>"))
        fs.readFile("./Data.json",function(err,result){
            const json = JSON.parse(result)
            var typeA = false
            var typeB = false
            for(var i = 0; i<json.length; i++){
                if(args[0] == json[i][0]){
                    if(args[1] == null && args[2] == null){
                        if(json[i][1] == "" && json[i][2] == ""){
                            queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
                            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('30'); /* */
                            queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(format); /* */
                            queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(time); /* */
                            queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(json[i][3]); /* */
                            queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(json[i][4]); /* */
                            break
                        }
                    }else if(args[1] != null){
                        if(args[2] != null){
                            if(args[1] == json[i][1]){
                                if(args[2] == json[i][2]){
                                    typeA = true
                                    typeB = true
                                    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
                                    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('30'); /* */
                                    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(format); /* */
                                    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(time); /* */
                                    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(json[i][3]); /* */
                                    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(json[i][4]); /* */
                                    break
                                }
                            }
                        }else{
                            if(args[1] == json[i][1]){
                                typeA = true
                                queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
                                queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('30'); /* */
                                queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(format); /* */
                                queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(time); /* */
                                queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(json[i][3]); /* */
                                queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(json[i][4]); /* */
                                break
                            }
                        }
                    }
                }
            }
            request({
                url: url + queryParams,
                method: 'GET'
            }, function (error, response, body) {
              const jsondata = JSON.parse(body)
              console.log(body)
              if(jsondata.response.header.resultCode == "01"){
                  return message.reply(new Discord.MessageEmbed().setTitle("오류").setDescription("알 수 없는 시/도 또는 시/구/군 또는 읍/면/동 입니다").setColor("#ff5858"))
              }
              var SKY = ""
              var REH = ""
              var TMN = ""
              var TMX = ""
              var PTY = ""
              var POP = false
              for(var x = 0; x < jsondata.response.body.items.item.length; x++){
                  switch(jsondata.response.body.items.item[x].category){
                    case "SKY":
                        switch(jsondata.response.body.items.item[x].fcstValue){
                        case "1":
                            SKY = "오늘은 구름하나 없이 좋은 날이에요!"
                            break
                        case "3":
                            SKY = "오늘은 구름이 조금 많은 날이네요."
                            break
                        case "4":
                            SKY = "오늘은 흐린 날이에요."
                            break
                        }
                        break  
                    case "REH":
                        REH = jsondata.response.body.items.item[x].fcstValue
                        break
                    case "TMN":
                        TMN = jsondata.response.body.items.item[x].fcstValue+"℃"
                        break
                    case "TMX":
                        TMX = jsondata.response.body.items.item[x].fcstValue+"℃"
                        break
                    case "PTY":
                        switch(jsondata.response.body.items.item[x].fcstValue){
                            case "1":
                                PTY = "오늘은 비가 내릴 수도 있어요, 외출시 우산을 챙겨야겠네요."
                                break
                            case "2":
                                PTY = "오늘은 비와 눈이 섞여서 올 수 있어요, 외출시 우산을 챙겨야겠네요."
                                break
                            case "3":
                                PTY = "오늘은 새하얀 눈이 내릴 예정이에요"
                                break
                            case "4":
                                PTY = "오늘은 소나기가 내릴 예정이에요, 외출 시 우산을 꼭 챙겨야겠어요."
                                break
                            case "5":
                                PTY = "오늘은 빗방울이 조금씩 내릴 에정이에요, 외출 시 우산을 챙겨야겠어요."
                                break
                            case "6":
                                PTY = "오늘은 빗방울이나 눈이 조금씩 날릴 예정이에요"
                                break
                            case "7":
                                PTY = "오늘은 눈이 조금씩 날릴 예정이에요"
                                break
                        }
                        break
                        case "POP":
                            if(jsondata.response.body.items.item[x].fcstValue == "0"){
                                POP = false
                            }else{
                                POP = true
                            }
                            break
                        }


              }
            if(REH == ""){
                REH = "조회된 데이터가 없습니다"
            }
            if(TMN == ""){
                TMN = "조회된 데이터가 없습니다"
            }
            if(TMX == ""){
                TMX = "조회된 데이터가 없습니다"
            }
            if(PTY == ""){
                PTY = "조회된 데이터가 없습니다"
            }
            if(SKY == ""){
                SKY = "조회된 데이터가 없습니다"
            }
            var description = ""
            var embed = new Discord.MessageEmbed().setTitle("오늘의 날씨")
            if(POP){
                if(!typeA && !typeB){
                    embed.addFields({name:"오늘의 하늘",value:SKY},{name:"오늘의 습도",value:REH+"%"},{name:"아침 최저기온",value:TMN},{name:"낮 최고기온",value:TMX},{name:"오늘의 강수 형태",value:PTY})
                    description = json[i][0]+"의 "
                }else if(typeA){
                    embed.addFields({name:"오늘의 하늘",value:SKY},{name:"오늘의 습도",value:REH+"%"},{name:"아침 최저기온",value:TMN},{name:"낮 최고기온",value:TMX},{name:"오늘의 강수 형태",value:PTY})
                    description = json[i][0]+" "+json[i][1]+"의 "
                }else if(typeA && typeB){
                    embed.addFields({name:"오늘의 하늘",value:SKY},{name:"오늘의 습도",value:REH+"%"},{name:"아침 최저기온",value:TMN},{name:"낮 최고기온",value:TMX},{name:"오늘의 강수 형태",value:PTY})
                    description = json[i][0]+" "+json[i][1]+" "+json[i][2]+"의 "
                }
            }else{
                if(!typeA && !typeB){
                    embed.addFields({name:"오늘의 하늘",value:SKY},{name:"오늘의 습도",value:REH+"%"},{name:"아침 최저기온",value:TMN},{name:"낮 최고기온",value:TMX})
                    description = json[i][0]+"의 "
                }else if(typeA){
                    embed.addFields({name:"오늘의 하늘",value:SKY},{name:"오늘의 습도",value:REH+"%"},{name:"아침 최저기온",value:TMN},{name:"낮 최고기온",value:TMX})
                    description = json[i][0]+" "+json[i][1]+"의 "
                }else if(typeA && typeB){
                    embed.addFields({name:"오늘의 하늘",value:SKY},{name:"오늘의 습도",value:REH+"%"},{name:"아침 최저기온",value:TMN},{name:"낮 최고기온",value:TMX})
                    description = json[i][0]+" "+json[i][1]+" "+json[i][2]+"의 "
                }
            }

            return message.reply(embed.setDescription(description+nowyear+"년 "+nowmonth+"월 "+nowdate+"일의 날씨에요").setColor("#83ff88"))
            })

        })
    }
}