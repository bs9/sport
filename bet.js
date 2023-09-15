import puppeteer from "puppeteer";

const args = process.argv;

(async () => {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();

    // 创建 CDP 对象
    const client = await page.target().createCDPSession()

    // 打开网络跟踪，允许网络事件通知到浏览器
    await client.send('Network.enable')

    client.on('Network.webSocketCreated',
        function(params){
            console.log(`创建 WebSocket 连接：${params.url}`)
        }
    )
    client.on('Network.webSocketClosed',
        function(params){
            console.log(`WebSocket 连接关闭`)
        }
    )
    client.on('Network.webSocketFrameSent',
        function(params){
            console.log(`发送 WebSocket 消息：${params.response.payloadData}`)
        }
    )
    client.on('Network.webSocketFrameReceived',
        function(params){
            console.log(`收到 WebSocket 消息：${params.response.payloadData}`)
        }
    )
    client.on('Network.webSocketWillSendHandshakeRequest',
        function(params){
            console.log(`准备发送 WebSocket 握手消息`)
        }
    )
    client.on('Network.webSocketHandshakeResponseReceived',
        function(params){
            console.log(`接收到 WebSocket 握手消息`)
        }
    )

    // 开始浏览
    await page.goto(args[2])

})()