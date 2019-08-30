var dialog = window.YDUI.dialog;
		// 纠错
        $('#tiku_day_parsing .g-error').click(function() {
            $('#tiku_day_parsing .cuo-alert').removeClass('none');
            var _this = $(this);
            $('#tiku_day_parsing .correction_btn').data('qid', _this.data('qid'));
            $('#tiku_day_parsing .correction_btn').data('subjectid', _this.data('subjectid'));
            $('#tiku_day_parsing .correction_btn').data('cid', _this.data('cid'));
            $('#tiku_day_parsing .cuo-alert').find('textarea').focus();
            setTimeout(function() {
                $(window).scrollTop(4000);
            }, 100)
        });
        // 纠错标签选择
        $('#tiku_day_parsing .area span').click(function() {
            var _this = $(this);
            _this.parent().next().find('.correction_content').removeClass('none');
            _this.toggleClass('active').siblings().removeClass('active');
            var placeholder = '请输入错误内容';
            if (_this.data('errtype') != 3) {
                placeholder += '，大于5个字';
            }
            $('#tiku_day_parsing .cuo-alert').find('textarea').attr('placeholder', placeholder);
            $('#tiku_day_parsing .cuo-alert').find('textarea').focus();
            setTimeout(function() {
                $(window).scrollTop(4000);
            }, 100)
        });
        
          // 点击遮罩隐藏touchstart
        $('#tiku_day_parsing .g-dialog').on('click', function(event) {
            if (event.target == this) {
                $('#tiku_day_parsing .note_content').val('');
                $('#tiku_day_parsing .g-dialog').addClass('none');
                $('#tiku_day_parsing .correction_content').val('').addClass('none');
                $('#tiku_day_parsing  .gconfirm-bd .area span').removeClass('active');
                $('#tiku_day_parsing .cuo-alert .correction_btn').addClass('btn-disabled');
            }
        });
         function isNull(obj){
        	 if(typeof obj == "undefined" || obj == null || obj == ""){
			        return true;
			    }else{
			        return false;
			    }
        }
        //纠错内容判断
        $('body').on('input', '#tiku_day_parsing .cuo-alert .correction_content', function() {
            var _this = $(this);
            if (!isNull(_this.val())) {
                _this.parents('.gconfirm-bd').next().find('.right').removeClass('btn-disabled');
            } else {
                _this.parents('.gconfirm-bd').next().find('.right').addClass('btn-disabled');
            }
        });
       
        // 纠错提交
        $('#tiku_day_parsing .correction_btn').on('click', function() {
            var cuo = $(this).parents('.cuo-alert');
            if (cuo.find('.area span').hasClass('active') == false) {
                dialog.toast('请选择纠错标签', 'none', 2000);
                return false;
            }
            var errtype = $('.cuo-alert .area .active').data('errtype');
            if (isNull($('#tiku_day_parsing .correction_content').val())) {
                dialog.toast('请输入纠错内容', 'none', 2000);
                return false;
            }
            var content = $('#tiku_day_parsing .correction_content').val();
            if (errtype != 3 && content.length < 5) {
                dialog.toast('纠错内容请大于5个字', 'none', 1500);
                $('#tiku_day_parsing .cuo-alert').addClass('none');
                return false;
            }else{
            	dialog.toast('纠错提交成功', 'none', 2000);
            	$('#tiku_day_parsing .cuo-alert').addClass('none');
            	return true;
            }


            $('#tiku_day_parsing .cuo-alert').addClass('none');
        });
        // 笔记
        $('body').on('input', '#tiku_day_parsing .note-alert textarea', function() {
            var _this = $(this);
            if (!isNull(_this.val())) {
                _this.parent().next().removeClass('colrbyt');
            } else {
                _this.parent().next().addClass('colrbyt');
                _this.css('height', '.2em');
            }
            if (_this.get(0).scrollHeight != _this.get(0).clientHeight) {
                _this.css('height', _this.get(0).scrollHeight);
            }
        });
        //笔记的内容滑动#tiku_day_parsing .note-alert.q_reply 
        $('body').on('click', '.g-note .grids-txt', function() {
           $("#tiku_day_parsing .note-alert").removeClass("none");
        });
        $('body').on('click', '.righta', function() {
        	$("#tiku_day_parsing .note-alert").addClass("none");
           dialog.toast('添加笔记成功', 'none', 1500);
        });
        //收藏
        $('body').on('click', '.g-star .grids-txt', function() {
        	var _this = $(this);
           _this.find('i').toggleClass('icon-star').toggleClass('icon-star-outline').toggleClass('green');
        });
        //页面点击滑动显示纠错，笔记，收藏
        $(".id_question_list dd .dd").click(function(){
        	var _this = $(this);
            _this.parents('dd').siblings().find('.m-grids-3').slideUp();
            _this.next('.m-grids-3').slideToggle();
		  }); 
		  
		  $(".mr-1 .again").click(function(){
		  	window.location.href = "timeday.html";
		  })