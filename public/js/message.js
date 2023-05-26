const socket = io();
const OFFSET = 50

function loaded() {
    window.scrollTo(0, document.body.scrollHeight);
}

function sleep (ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms))
}

function appendChildren (elem, children) 
{
    const appender = (res, child) => 
    {
        res.appendChild(child)
        return res
    }
    return children.reduce(appender, elem)
}

function appendAttrs (elem, attrs) 
{
    const appender = (res, attr) => 
    {
        res.setAttribute(attr[0], attr[1])
        return res
    }
    return Object.entries(attrs).reduce(appender, elem)
}

function createElem (tag, classes = [], children = [], attrs = {}) 
{
    let elem = document.createElement(tag)
    elem.classList = classes
    elem = appendAttrs(elem, attrs)
    return appendChildren(elem, children)
}

function updateGalleries (yesnt = false) 
{
    [...document.getElementsByClassName('images')]
        .forEach((gallery) => {
            const images = gallery.getAttribute('data').split(',')
            $(gallery).imagesGrid({
                images: images,
                align: true,
                cells: 5
            })
            if (yesnt){
                [gallery.getElementsByTagName('img')].forEach((image) => {
                    for (let i = 0; i < image.length; i ++)
                    {
                        image[i].setAttribute('onload', 'loaded()')
                    }
                })
            }
    })    
}

function genMessage(msg, isChildMessage = false)
{
    if (isChildMessage)
    {

        const name = createElem('div', ['name'])
        name.innerText = msg.author.name
        name.id = msg.author._id
        name.style.display = "none"

        const time = createElem('div', ['time'])
        var today = new Date(msg.time)
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        var timeDate = today.toLocaleTimeString('ru-RU', { hour12: false, 
            hour: "numeric", 
            minute: "numeric"});
        today = timeDate + ' ' + dd + '.' + mm + '.' + yyyy;
        time.innerText = today
        time.style.display = "none"

        const reply = createElem('button', ['reply'], [], {id: msg.id, onclick: "reply(this)"})
        reply.innerHTML = '<i style="font-size:14px" class="fa">&#xf112;</i>'
        const title = createElem('div', ['title'], [name, time, reply])
                
        const text = createElem('div', ['text'])
        text.innerText = msg.msg
        var images, content, replyMes
        if (msg.reply && msg.reply != {})
        {
            replyMes = genReplyMessage(msg.reply.name, msg.reply.time, msg.reply.text, msg.reply.id, msg.reply._id)
        }
        else
        {
            replyMes = ''
        }

        if (msg.images.length > 0)
        {
            images = createElem('div', ['images'], [], {data: msg.images})
            images.style.marginTop = "0px"
            if (replyMes != '')
            {
                content = createElem('div', ['content'], [replyMes, text, images])
            }
            else
            {
                content = createElem('div', ['content'], [text, images])
            }
        }
        else
        {
            if (replyMes != '')
            {
                content = createElem('div', ['content'], [replyMes, text])
            }
            else
            {
                content = createElem('div', ['content'], [text])
            }
        }
        const right = createElem('div', ['rightCont'], [title, content])
        
        const mess = createElem('div', ['mess'], [right], {onmouseover: "showReply(this)", onmouseout: "hideReply(this)"})
        mess.id = msg._id
        if (images != undefined)
        {
            mess.style.paddingTop = "1px"
            mess.style.paddingBottom = "6px"
        }
        else
        {
            mess.style.paddingTop = "0px"
            mess.style.paddingBottom = "0px"
        }
        mess.style.paddingLeft = "80px"

        return mess
    }
    else
    {
        const avatarImg = createElem('img', [], [], {src: msg.author.avatar})
        const avatar = createElem('div', ['avatar'], [avatarImg])

        const name = createElem('div', ['name'])
        name.innerText = msg.author.name
        name.id = msg.author._id

        const time = createElem('div', ['time'])
        var today = new Date(msg.time)
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        var timeDate = today.toLocaleTimeString('ru-RU', { hour12: false, 
            hour: "numeric", 
            minute: "numeric"});
        today = timeDate + ' ' + dd + '.' + mm + '.' + yyyy;
        time.innerText = today

        const reply = createElem('button', ['reply'], [], {id: msg.id, onclick: "reply(this)"})
        reply.innerHTML = '<i style="font-size:14px" class="fa">&#xf112;</i>'
        const title = createElem('div', ['title'], [name, time, reply])

        const text = createElem('div', ['text'])
        text.innerText = msg.msg
        var images, content, replyMes
        if (msg.reply && msg.reply != {})
        {
            replyMes = genReplyMessage(msg.reply.name, msg.reply.time, msg.reply.text, msg.reply.id, msg.reply._id)
        }
        else
        {
            replyMes = ''
        }

        if (msg.images.length > 0)
        {
            images = createElem('div', ['images'], [], {data: msg.images})
            if (replyMes != '')
            {
                content = createElem('div', ['content'], [replyMes, text, images])
            }
            else
            {
                content = createElem('div', ['content'], [text, images])
            }
        }
        else
        {
            if (replyMes != '')
            {
                content = createElem('div', ['content'], [replyMes, text])
            }
            else
            {
                content = createElem('div', ['content'], [text])
            }
        }
        const right = createElem('div', ['rightCont'], [title, content])
        
        const mess = createElem('div', ['mess'], [avatar, right], {onmouseover: "showReply(this)", onmouseout: "hideReply(this)"})
        mess.id = msg._id

        return mess

    }
}

function genReplyMessage(divName, divTime, divText, divId, div_Id, divImage = false, divClose = false)
{
    const name = createElem('div', ['nameReply'])
    name.innerText = divName
    name.style.display = "inline-block"

    const time = createElem('div', ['timeReply'])
    time.innerText = divTime
    time.style.display = "inline-block"
    time.style.marginLeft = "5px"

    const titleReply = divClose ? createElem('div', ['titleReply'], [name, time, divClose]) : createElem('div', ['titleReply'], [name, time])

    const text = createElem('div', ['textReply'])
    if (divText == '' && divImage)
    {
        text.innerText = 'Фотография'
    }
    else if (divText != '')
    {
        text.innerText = divText
    }
    else
    {
        text.innerText = 'Пусто'
    }
    const content = createElem('div', ['contentReply'], [text])
    content.style.marginLeft = "0px"
    const mess = divClose ? createElem('div', ['messReply'], [titleReply, content]) : createElem('div', ['messReply'], [titleReply, content], {onclick: "scrollToDiv(this.value)"})
    mess.value = {divId, div_Id}

    return mess
}

function closeReplyMessage()
{
    replyDiv = ''
    replyId = ''
    replyDisplay.innerHTML = ''
    replyDisplay.style.paddingTop = "0px"
    textspace.focus()
}

async function renderMessage(data, insert = false)
{
    const messages = document.getElementById('messages')
    if (insert)
    {
        messages.prepend(data)
        updateGalleries() 
    }
    else
    {
        await messages.appendChild(data)
        updateGalleries(true) 
        loaded()
    }
}

function loadLastMessages(token)
{
    socket.emit('lastMessages', {token: token, count: OFFSET});
}

socket.on('lastMessages callback', function(dataMes) 
{
    let token = dataMes.token
    if (token == cookieData)
    {
        var data = dataMes.list
        for (let i = 0; i < data.length; i++)
        {            
            if (i > 0 && JSON.stringify(data[i].author) === JSON.stringify(data[i - 1].author))
            {
                if (i > 1 && !(JSON.stringify(data[i - 1].author) === JSON.stringify(data[i - 2].author)))
                {
                    let elem = document.getElementById(data[i - 1]._id)
                    elem.style.paddingBottom = "0px"
                }
                renderMessage(genMessage(data[i], true))
            }
            else if (i == 0 && JSON.stringify(data[i].author) === JSON.stringify(data[i + 1].author))
            {
                let elem = genMessage(data[i])
                elem.style.paddingBottom = "0px"
                renderMessage(elem)
            }
            else
            {
                renderMessage(genMessage(data[i]))
            }
            
        }
        updateGalleries(true) 
        lever(OFFSET)
        loaded()
    }
});

function lever (offset) 
{
    $(window).scroll(function () 
    {
        const 
        {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement

        const percent = scrollTop / (scrollHeight - clientHeight)
        if (percent <= 0.05) 
        {
            $(window).unbind('scroll')
            let lastid = Number($('.mess')[0].getElementsByClassName('reply')[0].id)
            let firstid = lastid - offset
            if (firstid < 0) { firstid = 0 }
            if (firstid > -1 && lastid > 0)
            {
                renderMessages(firstid, lastid)
            }
        }
    })
}

function renderMessages(firstid, lastid)
{
    socket.emit('loadMessages', firstid, lastid, cookieData);
}

socket.on('loadMessages callback', function(data, token) 
{
    if (token == cookieData)
    {
        var oldHeight = $(document).height()
        var oldScroll = $(window).scrollTop()
        for (let i = 0; i < data.length; i++)
        {
            if (i < data.length - 1 && JSON.stringify(data[i].author) === JSON.stringify(data[i + 1].author))
            {
                renderMessage(genMessage(data[i], true), true)
            }
            else if (i < data.length - 1 && JSON.stringify(data[i].author) !== JSON.stringify(data[i + 1].author))
            {
                if (i < data.length - 1 && i > 0 && JSON.stringify(data[i].author) === JSON.stringify(data[i - 1].author))
                {
                    let elem = genMessage(data[i])
                    elem.style.paddingBottom = "0px"
                    renderMessage(elem, true)
                }
                else
                {
                    renderMessage(genMessage(data[i]), true)
                }
            }
            else if (i == data.length - 1 && JSON.stringify(data[i].author) === JSON.stringify(data[i - 1].author))
            {
                let elem = genMessage(data[i])
                elem.style.paddingBottom = "0px"
                renderMessage(elem, true)
            }
            else
            {
                renderMessage(genMessage(data[i]), true)
            }
        }
        async function bounce () 
        {
            await sleep(1000)
            lever(OFFSET)
        }
        
        bounce()
        updateGalleries()
        $(document).scrollTop(oldScroll + $(document).height() - oldHeight);
    }
});
