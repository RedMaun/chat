const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
var zero = document.getElementById('0')
var one = document.getElementById('1')
var two = document.getElementById('2')
var three = document.getElementById('3')
var dot = document.getElementsByClassName('dot')
var crop = document.getElementById('crop-box')
var field = document.getElementById('field')
var offsets
var image = field.getElementsByTagName('img')[0]
var croppingImage = document.getElementById('croppingImage')
image.crossOrigin="anonymous"
var uploadAvatar = document.getElementById('uploadAvatar')
var closePreAvatar = document.getElementById('closePreAvatar')
var fieldButton = document.getElementById('fieldButton')
var originalW, originalH

function result()
{
    var dx = 0
    var dy = 0
    var dWidth = 500
    var dHeight = 500
    var wMultiply = originalW / croppingImage.clientWidth
    var hMultiply = originalH / croppingImage.clientHeight

    var sx = deletePx(crop.style.left) * wMultiply
    var sy = deletePx(crop.style.top) * hMultiply
    var sWidth = crop.clientWidth * wMultiply
    var sHeight = crop.clientHeight * hMultiply
    
    ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    field.style.display = 'none'
    canvas.style.display = 'block'
    closePreAvatar.setAttribute('onclick', 'closeAva()')
    fieldButton.setAttribute('onclick', 'cropImage()')
    fieldButton.innerText = 'Подтвердить'
}

async function cropImage()
{

    async function dataUrlToBuffer(dataURL) 
    {
        return (fetch(dataURL)
            .then(function (result) {
                return result.arrayBuffer();
            }));
    }

    var url = canvas.toDataURL();
    var buffer = await dataUrlToBuffer(url)

    socket.emit('avatar', buffer, cookieData)
    closeChange()
    closePreAvatar.setAttribute('onclick', 'closeChange()')
    fieldButton.setAttribute('onclick', 'result()')
    fieldButton.innerText = 'Сохранить и продолжить'
}

socket.on('update', function(token) {
    if (cookieData == token)
    {
        socket.emit('userData', cookieData)
    }
})

function closeAva()
{
    field.style.display = 'block'
    canvas.style.display = 'none'
    closePreAvatar.setAttribute('onclick', 'closeChange()')
    fieldButton.setAttribute('onclick', 'result()')
    fieldButton.innerText = 'Сохранить и продолжить'
}

function closeChange()
{
    avatarChange.style.display = 'none'
    ctx.clearRect(0, 0, 500, 500);
    uploadAvatar.value = ''
    canvas.style.display = 'none'   
    zero.style.left = "0px"
    one.style.left = "200px"
    two.style.left = "0px"
    three.style.left = "200px"

    zero.style.top = "0px"
    one.style.top = "0px"
    two.style.top = "200px"
    three.style.top = "200px"

    crop.style.left = "0px"
    crop.style.top = "0px"
    crop.style.width = "210px"
    crop.style.height = "210px"
}

function loadAvatar(elem)
{
    avatarChange.style.display = 'block'
    field.style.display = 'block'
    offsets = document.getElementById('field').getBoundingClientRect();
    if (elem.files && elem.files[0]) 
    {
        var reader = new FileReader();
    
        reader.onload = function (e) {
            var image = new Image()
            image.src = e.target.result;
            image.onload = function () {
                originalH = this.height;
                originalW = this.width;
            };
            $('#croppingImage').attr('src', e.target.result)

        };
    
        reader.readAsDataURL(elem.files[0]);
    }
}

function change(div)
{
    let id = Number(div.id)
    if (id === 0)
    {
        one.style.top = div.style.top
        two.style.left = div.style.left
    }
    else if (id === 1)
    {
        zero.style.top = div.style.top
        three.style.left = div.style.left
    }
    else if (id === 2)
    {
        zero.style.left = div.style.left
        three.style.top = div.style.top
    }
    else if (id === 3)
    {
        one.style.left = div.style.left
        two.style.top = div.style.top
    }
    if (deletePx(zero.style.left) < deletePx(three.style.left))
    {
        crop.style.left = zero.style.left
        crop.style.top = zero.style.top
        crop.style.width = Math.abs(deletePx(one.style.left) - deletePx(zero.style.left)) + 10 + 'px'
        crop.style.height = Math.abs(deletePx(one.style.left) - deletePx(zero.style.left)) + 10 + 'px'
    }
    else
    {
        crop.style.left = three.style.left
        crop.style.top = three.style.top
        crop.style.width = Math.abs(deletePx(one.style.left) - deletePx(zero.style.left)) + 10 + 'px'
        crop.style.height = Math.abs(deletePx(one.style.left) - deletePx(zero.style.left)) + 10 + 'px'
    }
    
}

function deletePx(str)
{
    return Number(str.substring(0, str.indexOf('px')))
}

function onMouseDown()
{
    var div = this
    function moveAt(pageX, pageY) 
    {
        pageX -= offsets.left
        pageY -= (offsets.top + window.scrollY)
        if (div.id == '0' || div.id == '3')
        {
            var diff = (pageX+pageY)/2 - ((deletePx(div.style.left) + deletePx(div.style.top))/2)
            
            let left = deletePx(div.style.left) + diff
            let top = deletePx(div.style.top) + diff

            if (left < 0)
            {
                top = top - left
                left = 0
            }

            if (left > field.clientWidth - 10)
            {
                top = top - (left - (field.clientWidth - 10))
                left = field.clientWidth - 10
            }

            if (top < 0)
            {
                left = left - top
                top = 0
            }

            if (top > field.clientHeight - 10)
            {
                left = left - (top - (field.clientHeight - 10))
                top = field.clientHeight - 10
            }
            
            div.style.left = left + 'px'
            div.style.top = top + 'px'

        }
        else
        {
            var diff = (-pageX+pageY)/2 - ((-deletePx(div.style.left) + deletePx(div.style.top))/2)

            let left = deletePx(div.style.left) - diff
            let top = deletePx(div.style.top) + diff

            if (left < 0)
            {
                top = top + left
                left = 0
            }

            if (left > field.clientWidth - 10)
            {
                top = top + (left - (field.clientWidth - 10))
                left = field.clientWidth - 10
            }

            if (top < 0)
            {
                left = left + top
                top = 0
            }

            if (top > field.clientHeight - 10)
            {
                left = left + (top - (field.clientHeight - 10))
                top = field.clientHeight - 10
            }

            
            div.style.left = left + 'px'
            div.style.top = top + 'px'

        }
    }
    function onMouseMove(event) 
    {
        moveAt(event.pageX, event.pageY);
        change(div)
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function()
    {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
    }

    document.oncontextmenu = function()
    {
        document.removeEventListener('mousemove', onMouseMove);
        document.oncontextmenu = null;
    }
    
}

function cropMove()
{
    var div = this
    var shiftX = event.clientX - div.getBoundingClientRect().left;
    var shiftY = event.clientY - div.getBoundingClientRect().top;

    function moveAt(pageX, pageY)
    {
        pageX -= offsets.left
        pageY -= (offsets.top + window.scrollY)
        let left = pageX - shiftX
        let top = pageY - shiftY 

        if (left < 0)
        {
            left = 0
        }
        if (top < 0)
        {
            top = 0
        }

        var divW = div.clientWidth
        var fieldW = field.clientWidth

        if (left + divW > fieldW)
        {
            left = fieldW - divW
        }

        var divH = div.clientHeight
        var fieldH = field.clientHeight

        if (top + divH > fieldH)
        {
            top = fieldH - divH
        }

        div.style.left = left + 'px';
        div.style.top = top + 'px';

        zero.style.left = div.style.left
        zero.style.top = div.style.top

        one.style.left = deletePx(div.style.left) + div.clientWidth - 10 + 'px'
        one.style.top = div.style.top

        two.style.left = div.style.left
        two.style.top = deletePx(div.style.top) + div.clientHeight - 10 + 'px'

        three.style.left = deletePx(div.style.left) + div.clientWidth - 10 + 'px'
        three.style.top = deletePx(div.style.top) + div.clientHeight - 10 + 'px'

    }

    function onMouseMove(event) 
    {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function()
    {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
    }

    document.oncontextmenu = function()
    {
        document.removeEventListener('mousemove', onMouseMove);
        document.oncontextmenu = null;
    }
}

for (let i = 0; i < dot.length; i++)
{
    dot[i].addEventListener("mousedown", onMouseDown)
    dot[i].ondragstart = function() { return false }
}
crop.addEventListener("mousedown", cropMove)
crop.ondragstart = function() { return false }