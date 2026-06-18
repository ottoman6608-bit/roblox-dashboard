const express = require('express');
const app = express();
app.use(express.json());

// ตัวแปรเก็บข้อมูลสถิติทั้งหมด
let currentData = {
    username: "กำลังรอข้อมูล...",
    cash: "0 €",
    carsSold: "0 คัน",
    kms: "0.0 KMs",
    lastUpdated: "--:--:--"
};

// 1. Endpoint รับข้อมูล 3 ค่าจากเกม
app.post('/update-cash', (req, res) => {
    const { username, cash, carsSold, kms } = req.body;
    
    currentData = {
        username: username || "ไม่ระบุชื่อ",
        cash: cash || "0 €",
        carsSold: carsSold || "0 คัน",
        kms: kms || "0.0 KMs",
        lastUpdated: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    
    console.log(`[ROBLOX] อัปเดตสำเร็จสำหรับคุณ ${username}`);
    res.send("OK");
});

// 2. Endpoint ส่งข้อมูลไปหน้าเว็บ
app.get('/get-current-cash', (req, res) => {
    res.json(currentData);
});

// 3. หน้าตาแดชบอร์ดแบบในรูปภาพ (Dark UI สายเกมมิ่ง)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <title>Fix It Up - Dashboard</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #0b0c10;
                    color: #ffffff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .dashboard-box {
                    background-color: #141722;
                    width: 480px;
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.5);
                    border: 1px solid #1f2336;
                }
                .user-status {
                    display: flex;
                    align-items: center;
                    font-size: 22px;
                    font-weight: bold;
                    color: #5b86e5;
                    margin-bottom: 25px;
                }
                .online-dot {
                    width: 14px;
                    height: 14px;
                    background-color: #00e676;
                    border-radius: 50%;
                    margin-right: 12px;
                    box-shadow: 0 0 10px #00e676;
                }
                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 18px;
                    font-size: 16px;
                }
                .stat-label {
                    color: #a0a5b5;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .stat-value {
                    font-weight: bold;
                    font-size: 18px;
                }
                .cash-style { color: #52c2ff; font-size: 20px; }
                .car-style { color: #b388ff; }
                .km-style { color: #00e676; }
                
                .footer-text {
                    text-align: right;
                    font-size: 11px;
                    color: #4f5366;
                    margin-top: 25px;
                    border-top: 1px solid #1f2336;
                    padding-top: 10px;
                }
            </style>
            <script>
                setInterval(async () => {
                    try {
                        const res = await fetch('/get-current-cash');
                        const data = await res.json();
                        document.getElementById('username').innerText = data.username;
                        document.getElementById('cash').innerText = data.cash;
                        document.getElementById('carsSold').innerText = data.carsSold;
                        document.getElementById('kms').innerText = data.kms;
                        document.getElementById('timestamp').innerText = data.lastUpdated;
                    } catch(e) {}
                }, 1500);
            </script>
        </head>
        <body>
            <div class="dashboard-box">
                <div class="user-status">
                    <div class="online-dot"></div>
                    <span id="username">กำลังโหลด...</span>
                </div>
                
                <div class="stat-row">
                    <div class="stat-label">💰 เงินในตัว:</div>
                    <div id="cash" class="stat-value cash-style">กำลังรอ...</div>
                </div>
                
                <div class="stat-row">
                    <div class="stat-label">🚗 ขายรถแล้ว:</div>
                    <div id="carsSold" class="stat-value car-style">กำลังรอ...</div>
                </div>
                
                <div class="stat-row">
                    <div class="stat-label">🏠 ระยะทางขับ:</div>
                    <div id="kms" class="stat-value km-style">กำลังรอ...</div>
                </div>
                
                <div id="time-container" class="footer-text">
                    ข้อมูลส่งล่าสุด: <span id="timestamp">--:--:--</span>
                </div>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Gaming Dashboard is running!'));
