!function() {
  var citys = [{
    "CountryId": 1,
    "CountryName": "中国",
    "Province": [{
      "ProvinceId": 1,
      "ProvinceName": "北京市",
      "City": [{
        "CityId": 1,
        "CityName": "市辖区",
        "CountyList": [{
          "CountyId": 1,
          "CountyName": "东城区"
        },
        {
          "CountyId": 2,
          "CountyName": "西城区"
        }]
      }]
    },
    {
      "ProvinceId": 2,
      "ProvinceName": "天津市",
      "City": [{
        "CityId": 2,
        "CityName": "市辖区",
        "CountyList": [{
          "CountyId": 17,
          "CountyName": "和平区"
        },
        {
          "CountyId": 18,
          "CountyName": "河东区"
        },
        {
          "CountyId": 19,
          "CountyName": "河西区"
        }]
      }]
    }]
},{
        "CountryId": 2,
        "CountryName": "护理",
        "Province": [{
            "ProvinceId": 21,
            "ProvinceName": "中级主管护师",
//          "City": []
        },{
            "ProvinceId": 22,
            "ProvinceName": "副高",
            "City": [{
                "CityId": 221,
                "CityName": "副高(急救护理)",
                "CountyList": []
            },{
                "CityId": 222,
                "CityName": "副高(内科护理)",
                "CountyList": []
            },{
                "CityId": 223,
                "CityName": "副高(外科护理)",
                "CountyList": []
            }]
        },{
            "ProvinceId": 23,
            "ProvinceName": "医学正高",
            "City": [
                {
                    "CityId": 231,
                    "CityName": "正高(中医)",
                    "CountyList": [{
                            "CountyId": 2311,
                            "CountyName": "正高(推拿学)"
                    },{
                        "CountyId": 2312,
                        "CountyName": "正高(中医骨伤科学)"
                    },{
                        "CountyId": 2312,
                        "CountyName": "正高(中医骨伤科学)"
                    }]
                },{
                    "CityId": 232,
                    "CityName": "正高(西医)",
                    "CountyList": []
                },{
                    "CityId": 233,
                    "CityName": "正高(中西医)",
                    "CountyList": []
                }
            ]
        }]
    }];
  if (typeof define === "function") {
    define(citys)
  } else {
    window.YDUI_CITYS = citys
  }
} ();