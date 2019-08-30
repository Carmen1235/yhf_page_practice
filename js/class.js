! function() {
	var citys = [{
			"name": "医学",
			"provance": [{
				"name": "一级人力资源师",
				"city": [{
						"name": "城区",
						"area":[{
							"name": "股份大股东",
							"tj":[""]
							},{
							"name": "fdsf",
							}]
					},{
						"name": "城外",
						"area":["股份大股东","fdsf"]
					}],
			}, {
				"name": "二级人力资源师",
				"city": [{
						"name": "四环到五环之间",
					},{
						"name": "五环到六环之间",
					},{
						"name": "管庄",
					},{
						"name": "北苑",
					},{
						"name": "定福庄",
					},{
						"name":"三环以内",
					} ],
			}]
		}, {
			"name": "护理",
			"provance": [{
				"city": ["城区"],
				"name": "中级主管护师",
			}, {
				"city": ["城区"],
				"name": "初级护师",
			}]
		}

	];
	if (typeof define === "function "){define(citys)}else{window.YDUI_CITYS=citys}}();