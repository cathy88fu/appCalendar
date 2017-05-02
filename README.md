appCalendar
============

appCalendar是一款简单的移动端日历组件，提供单个日期和日期范围选择。


## 文件引入

### CSS 引入

appCalendar组件使用了animate动画库。

	<link rel="stylesheet" href="css/animate.min.css" type="text/css"/>
    <link rel="stylesheet" href="css/appCalendar.css" type="text/css"/>

### Javascript 引入

	<script src="js/jquery-3.2.1.min.js"></script>
    <script src="js/jsfunction.min.js"></script>
    <script src="js/appCalendar.js"></script>


## api文档
<div>
    <table border="0">
	  <tr>
	    <th>参数</th>
	    <th>类型</th>
	    <th>默认值</th>
	    <th>描述</th>
	  </tr>
	  <tr>
	    <td>type</td>
	    <td>string</td>
	    <td>multiple</td>
	    <td>日期选择类型，multiple：日期范围选择；single:单个日期选择</td>
	  </tr>
	  <tr>
	    <td>display</td>
	    <td>number</td>
	    <td>3</td>
	    <td>日历初始化月的个数</td>
	  </tr>
	  <tr>
	    <td>startDate</td>
	    <td>date</td>
	    <td>当前日期</td>
	    <td>开始日期</td>
	  </tr>
	  <tr>
	    <td>endDate</td>
	    <td>date</td>
	    <td></td>
	    <td>结束日期</td>
	  </tr>
	  <tr>
	    <td>callback</td>
	    <td>function</td>
	    <td></td>
	    <td>回调函数，返回参数为用户所选择的单个日期或日期范围</td>
	  </tr>
    </table>
</div>

## 方法

	.appCalendar(option)
初始化日历组件，参数接受可选参数	object

