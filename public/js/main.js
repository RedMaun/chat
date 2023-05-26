var Arr = new Array()
const filesDisplay = document.getElementById('filesDisplay')
const textspace = document.getElementById('textspace')
const replyDisplay = document.getElementById('replyDisplay')
const headerName = document.getElementById('header-name')
const headerAvatar = document.getElementById('header-avatar')
var userData
var replyDiv, replyId

const cookieData = document.cookie.substring(9)

textspace.addEventListener('paste', e => {
    var upload = document.getElementById('upload')
    upload.files = e.clipboardData.files;
    loadImage()
});

function showReply(e)
{
    e.getElementsByClassName('reply')[0].style.display = "inline"
}

function hideReply(e)
{
    e.getElementsByClassName('reply')[0].style.display = "none"
}

function getDataDiv(div)
{
    let name = div.getElementsByClassName('name')[0].innerText
    let time = div.getElementsByClassName('time')[0].innerText
    let text = div.getElementsByClassName('content')[0].getElementsByClassName('text')
    text = text.length > 1 ? text[1].innerText : text[0].innerText
    let image = div.getElementsByClassName('images')[0]
    image = !(image === undefined)
    
    return {name, time, text, image}
}
async function scrollToDiv(val)
{

    tid = val.divId
    t_id = val.div_Id

    var neededDiv = document.getElementById(t_id)
    if (neededDiv === null)
    {
        let lastid = $('.mess')[0].getElementsByClassName('reply')[0].id
        tid = tid > 20 ? tid - 20 : 0 
        renderMessages(tid, lastid)
        var checkExist = setInterval(function() {
            if ($('#'+t_id).length) {
                neededDiv = document.getElementById(t_id)
                neededDiv.scrollIntoView({behavior: 'auto',
                block: 'center',
                inline: 'center'})
                neededDiv.style.background = "#2a2a2a"
                setTimeout(() => { neededDiv.style.transition = "background-color 1000ms linear"; neededDiv.style.background = "#1a1a1a"; setTimeout(() => { neededDiv.style.transition = "" }, 1000)}, 5000)
                clearInterval(checkExist)
            }
        }, 100);
    }
    else
    {
        neededDiv.scrollIntoView({behavior: 'auto',
                block: 'center'})
        neededDiv.style.background = "#2a2a2a"
        setTimeout(() => { neededDiv.style.transition = "background-color 1000ms linear"; neededDiv.style.background = "#1a1a1a"; setTimeout(() => { neededDiv.style.transition = "" }, 1000)}, 5000)
    }
}

function reply(e)
{
    textspace.focus()
    replyDiv = e.parentElement.parentElement
    replyId = replyDiv.getElementsByClassName('reply')[0].id
    let reply_Id = replyDiv.parentElement.id
    let {name, time, text, image} = getDataDiv(replyDiv)
    replyDisplay.innerHTML = ''
    let butt = document.createElement('button')
    butt.id = 'buttCloseReply'
    butt.type = 'button'
    butt.setAttribute('onclick', 'closeReplyMessage(); textspace.focus()');
    butt.innerHTML = "<i class=\"fa-solid fa-xmark fa-sm\"></i>"
    let replyGenDiv = genReplyMessage(name, time, text, replyId, reply_Id, image, butt)
    replyGenDiv.style.margin = "0px"
    replyGenDiv.style.marginLeft = "20px"
    replyDisplay.style.paddingTop = "10px"
    replyGenDiv.style.marginRight = "35px"
    replyGenDiv.style.cursor = "auto"
    replyDisplay.appendChild(replyGenDiv)
    loaded()
}

function deleteFile(e)
{
    var childs = filesDisplay.children
    for (let i = 0; i < childs.length; i ++)
    {
        if (childs[i].children[0] == e)
        {
            Arr.splice(i, 1);
            break
        }
    }
    e.parentElement.parentElement.removeChild(e.parentElement)
    
}
function equal (buf1, buff)
{
    for (let g = 0; g < buff.length; g++)
    {
        var buf2 = buff[g]
        if (buf1.byteLength != buf2.byteLength) continue;
        var dv1 = new Int8Array(buf1);
        var dv2 = new Int8Array(buf2);
        for (var i = 0 ; i != buf1.byteLength ; i++)
        {
            if (dv1[i] != dv2[i]) continue;
        }
        return true;
    }
    return false
}

function loadImage()
{
    if (Arr.length < 9)
    {
        var files = document.getElementById('upload').files
        for (let i = 0; i < files.length; i++)
        {
            let file = files[i]
            let reader = new FileReader();
            let rawData = new ArrayBuffer();                
            reader.loadend = function() {
            }
            reader.onload = function(e) {
                rawData = e.target.result;
                if (!equal(rawData, Arr))
                {
                    Arr.push(rawData)
                    var li = document.createElement('div')
                    li.className = 'loaded'
                    var butt = document.createElement('button')
                    butt.className = 'buttClose'
                    butt.value = file.name
                    butt.type = 'button'
                    butt.setAttribute('onclick', 'deleteFile(this); textspace.focus()');
                    butt.innerHTML = "<i class=\"fa-solid centered fa-xmark\"></i>"
                    li.innerText = file.name
                    li.appendChild(butt)
                    filesDisplay.appendChild(li)
                    loaded()
                }
            }
            reader.readAsArrayBuffer(file)
        }
    }   
}

var messages = document.getElementById('messages');
var form = document.getElementById('trigger');
var input = document.getElementById('textspace');
input.focus()
var upload = document.getElementById('upload')
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value || Arr.length > 0) {
        let author = cookieData
        if (replyDisplay.childElementCount === 1)
        {
            let {name, time, text, image} = getDataDiv(replyDiv)
            if (text == '' && image)
            {
                text = 'Фотография'
            }
            else if (text == '')
            {
                text = 'Пусто'
            }
            var replyObj = {'name': name, 'time': time, 'text': text, 'id': replyId, '_id': replyDiv.parentElement.id}
        }
        else
        {
            var replyObj = {}
        }
        socket.emit('chat message', {'message': input.value, 'author': author, 'images': Arr, 'replyObj': replyObj})
        input.value = ''
        upload.value = ''
        filesDisplay.innerHTML = ''
        Arr = []
        closeReplyMessage()
    }
});
socket.on('message callback', function(msg) {
    let previousDiv = $('.mess')[$('.mess').length - 1]
    if ( previousDiv.getElementsByClassName('name')[0].id == msg.author._id )
    {
        previousDiv.style.paddingBottom = "0px"
        renderMessage(genMessage(msg, true))
    }
    else
    {
        renderMessage(genMessage(msg))
    }
});

$( document ).ready(function() {
    socket.emit('userData', cookieData)
})

socket.on('userData', function(msg) {
    token = msg.token
    if (token == cookieData)
    {
        userData = msg
        headerName.innerText = msg.name
        let imgDiv = '<img src="">'
        headerAvatar.innerHTML = imgDiv
        headerAvatar.getElementsByTagName('img')[0].setAttribute('src', msg.avatar)
    }
});

