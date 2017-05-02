(function($){
    $.fn.appCalendar = function(option){
        var _this = this;
        var _calendarEvent = {
            drawCalendar:function(){
                var title = '<div class="calendar-head"><span class="ico-back"> < </span><span>选择日期</span></div>';
                var weekStr = '<div class="calendar-week"><span class="weekend">日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span class="weekend">六</span></div>';
                var _year = $.date(opt.startDate).getFullYear();
                var _month = opt.isScroll ? $.date(opt.startDate).getMonth() : $.date(opt.startDate).getMonth()+1;
                var _calendarBodyArr = [];
                for(var i=0;i<opt.display;i++){
                    if(i> 0){
                        _year = _year + Math.floor((_month+1)/12);
                        _month = (_month+1)%12;
                    }
                    _calendarBodyArr.push(this.getBody(_year,_month));
                }
                if(_this.find('.calendar_container').length){
                    _this.find('.calendar_container').remove();
                }
                _this.append('<div class="calendar-container">'+title + weekStr+'<div class="calendar-body">'+_calendarBodyArr.join('')+'</div></div>');
            },
            getBody:function(y,m){
                var _days = $.date(y + '-' + m + '-1').daysInMonth(),
                    _startWeek = $.date(y + '-' + m + '-1').getDay(),
                    _data = '<div class="cn-calendar"><h3 data-date="'+y+'-'+(m<10 ? '0'+m:m)+'">'+y +'年'+(m<10 ? '0'+m:m)+'月</h3><ul>';
                for(var i = 1-_startWeek ; i<= _days;i++){
                    if(i<= 0){
                        _data += '<li class="disabled" rel=""></li>';
                    }else{
                        var _d = y + '-' + (m < 10 ? '0' + m : m) + '-' + (i < 10 ? '0' + i : i),_className = 'animated';
                        if(_d >= opt.startDate && _d <= opt.endDate){
                            // debugger;
                            _className ='animated ' + (_d == opt.startDate || _d == opt.endDate) ? 'selected':(this.dateCompare(_d,opt.endDate) <0 ? 'beselected':'');
                        }
                        if(_d < $.date().format('yyyy-MM-dd')){
                            _className = 'disabled';
                        }
                        _data += '<li class="'+_className+'" rel="'+ _d +'">'+ i +'</li>';
                    }
                }
                _data +='</ul></div>';
                return _data;
            },
            dateCompare:function(date,oldDate){
                return +$.date(date) - (+$.date(oldDate) || 0);
            },
            getNextMonth: function (_currDate) {
                //console.log(_currDate);
                var year = _currDate.getFullYear(),
                    month = _currDate.getMonth();
                return {year: year, month: month + 1};
            },
            getPrevMonth: function (_currDate) {
                //console.log(_currDate);
                var year = _currDate.getFullYear(),
                    month = _currDate.getMonth();
                return {year: year, month: month - 1};
            },
            getSelectedDate:function(){
                var _selected = _this.find('.selected'),
                    arr = [];
                _selected.each(function(i,item){
                    arr.push($(item).attr('rel'));
                });
                return arr;
            },
            setSelectedDate:function(start,end){
                if(opt.type == 'single'){
                    _this.find('[rel="' + start + '"]').addClass('selected');
                }else if(opt.type == 'multiple'){
                    _this.find('[rel="' + start + '"]').addClass('selected');
                    _this.find('[rel="' + end + '"]').addClass('selected');
                    var temp = $.date(start),arr = [];
                    while(this.dateCompare(temp,end)<0){
                        temp = temp.addDays(1);
                        arr.push(temp.format('yyyy-MM-dd'));
                    }
                    arr.forEach(function (item) {
                        _this.find('[rel="' + item + '"]').not('.disabled').not('.selected').addClass('beselected');
                    });
                }

            }
        };
        var defaults = {
            startDate: $.date(),
            type:'multiple',
            display:3,
            currScrollTop: 0,
        }
        var opt = $.extend({},defaults,option);
        //构建日历
        _calendarEvent.drawCalendar();

        _this.find('.dateArea').on('click',function(){
            _this.find('.calendar-container').fadeIn();
            console.log('aaa');
            console.log(opt.currentTop);
            $(window).scrollTop(opt.currentTop);
        })
        _this.find('.calendar-head span:eq(0)').on('click',function(){
            _this.find('.calendar-container').fadeOut();
            var len = _this.find('.selected').length;
            if(opt.type == 'multiple' && len != 2){
                _this.find('.selected').removeClass('swing selected');
                _calendarEvent.setSelectedDate(opt.startDate,opt.endDate);
            }
        })
        _this.off('click').on( 'click','li',function(){
            var _type = opt.type;
            if($(this).hasClass('disabled')){
                return;
            }
            if(_type == 'single'){
                _this.find('.selected').removeClass('swing selected');
            }else if(_type == 'multiple'){
                var _selected = _this.find('.selected'),
                    _days = _calendarEvent.dateCompare($(this).attr('rel'),_selected.attr('rel')) / 24 / 60 / 60 / 1000;
                opt.startDate = _selected.eq(0).attr('rel');
                opt.endDate = _selected.eq(1).attr('rel');

                if(_selected.length == 2 || (_selected.length == 1 && _days <0) ){
                    _this.find('.selected').removeClass('swing selected');
                }
            }
            _this.find('.beselected').removeClass('beselected');
            $(this).addClass('swing selected');
            var _beSelected = _calendarEvent.getSelectedDate();
            if(_type == 'multiple' && _beSelected.length == 2){
                var min = _beSelected[0],
                    max = _beSelected[1];
                _calendarEvent.setSelectedDate(min,max);
            }

            if((_type == 'single' && _beSelected.length == 1) || (_type=='multiple' && _beSelected.length == 2)){
                _this.find('.calendar-container').fadeOut();
                opt.callback(_beSelected);
            }else{
                opt.currentTop = $(window).scrollTop();
            }
        })
        //滚动加载
        var timerTop = null;
         var timerBottom = null;
         $(window).scroll(function () {
             var curHeight = _this.height(),
                 scrollHeight = $(this).scrollTop(),
                 screenHeight = window.innerHeight;

             var result = curHeight - scrollHeight - screenHeight; // 134
             if(result < 100){
                 clearTimeout(timerBottom);
                 timerBottom = setTimeout(function () {
                     var last = _this.find("h3:last").attr("data-date");
                     var _t = _calendarEvent.getNextMonth($.date(last).addMonths(1)),
                         _html = _calendarEvent.getBody(_t.year, _t.month);
                     _this.find('.calendar-body').append(_html);
                 }, 100);
             }
         });
    }
})(jQuery)