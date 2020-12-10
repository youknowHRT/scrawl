var kobe = document.getElementById('biubiu')
var ctx = kobe.getContext('2d')

fullpage()
// bgcWhite()
window.onresize = function () {
  // 在resize页面时重绘当前页面图像
  // var imgData=ctx.getImageData(0,0,kobe.width,kobe.height)
  location.reload()
  fullpage()
  // ctx.putImageData(imgData,0,0)
}

var using = false
var lastPoint = { x: undefined, y: undefined }
var eraserEnable = false
// 特性检测
if (kobe.ontouchstart !== undefined) {
  kobe.ontouchstart = function (a) {
    a.preventDefault()
    using = true
    if (using) {
      x = a.touches[0].clientX
      y = a.touches[0].clientY
      decidePaintOrErase()
    }
  }

  kobe.ontouchmove = function (a) {
    x = a.touches[0].clientX
    y = a.touches[0].clientY
    if (!using) return
    paintOrErase()
  }
  kobe.ontouchend = function () {
    using = false
  }
} else {
  kobe.onmousedown = function (a) {
    using = true
    if (using) {
      x = a.clientX
      y = a.clientY
      decidePaintOrErase()
    }
  }
  kobe.onmousemove = function (a) {
    x = a.clientX
    y = a.clientY
    if (!using) {
      return
    }
    paintOrErase()
  }
  kobe.onmouseup = function () {
    using = false
  }
}

// 功能
eraser.onclick = function () {
  eraserEnable = true
  $('.icon').removeClass('active')
  eraser.classList.add('active')
}
pen.onclick = function () {
  eraserEnable = false
  $('.icon').removeClass('active')
  pen.classList.add('active')
}
save.onclick = function () {
  $('.icon').removeClass('active')
  save.classList.add('active')
  setTimeout(function () {
    if (confirm('Are U sure?')) {
      var url = kobe.toDataURL()
      var a = document.createElement('a')
      document.body.append(a)
      a.href = url
      a.download = '我的涂鸦'
      a.click()
    }
  }, 250)
  setTimeout(function () {
    $('.icon').removeClass('active')
    pen.classList.add('active')
    eraserEnable = false
    // ctx.lineWidth=aaa[bbb]
  }, 300)
}
bin.onclick = function () {
  $('.icon').removeClass('active')
  bin.classList.add('active')
  setTimeout(function () {
    if (confirm('Are U sure?')) {
      ctx.clearRect(0, 0, kobe.width, kobe.height)
    }
  }, 250)
  setTimeout(function () {
    $('.icon').removeClass('active')
    pen.classList.add('active')
    eraserEnable = false
  }, 300)
}

// 画笔颜色+当前颜色
$('.color>ul>li').on('click', function () {
  var color = $(this).css('background-color')
  $('.level>ul>li').css({ 'border-color': color })
  ctx.strokeStyle = color
  ctx.fillStyle = color
})
// 画笔粗细
$('.level>ul>li').on('click', function () {
  var aaa = [2, 4, 8]
  var bbb = $(this).index()
  ctx.lineWidth = aaa[bbb]
})

function fullpage() {
  var pageWidth = document.documentElement.clientWidth
  var pageHeight = document.documentElement.clientHeight
  kobe.width = pageWidth
  kobe.height = pageHeight
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function drawCircle(x, y, r) {
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
}

function decidePaintOrErase() {
  if (eraserEnable) {
    //用以下属性取代clearRect作为橡皮擦方法
    ctx.globalCompositeOperation = 'destination-out'
  } else {
    drawCircle(x, y, ctx.lineWidth / 2)
    ctx.globalCompositeOperation = 'source-over'
  }
  lastPoint = { x: x, y: y }
}

function paintOrErase() {
  var newPoint = { x: x, y: y }
  drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
  drawCircle(x, y, ctx.lineWidth / 2)
  lastPoint = newPoint
}

// 设置背景为白色
// function bgcWhite(){
//     // ctx.fillStyle='#dfefca'
//     ctx.fillStyle='white'
//     ctx.fillRect(0,0,kobe.width,kobe.height)
//     ctx.fillStyle='black'
// }
