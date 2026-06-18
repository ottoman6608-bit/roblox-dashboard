const express = require('express');
const app = express();
app.use(express.json());

let playerCash = "0";
let playerUsername = "กำลังรอข้อมูล...";

app.post('/update-cash', (req, res) => {
    const { username, cash } = req.body;
    playerCash = cash;
    playerUsername = username;
    console.log(`[ROBLOX] อัปเดตข้อมูล: ${username} -> $${cash}`);
    res.send("OK");
});

app.get('/get-current-cash', (req, res) => {
    res.json({ username: playerUsername, cash: playerCash });
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <title>Roblox Cash Dashboard</title>
            <style>
                body {
                    font-family: 'Segoe UI', sans-serif;
                    background-color: #0f111a;
                    color: #ffffff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .dashboard-card {
                    background: linear-gradient(145deg, #151824, #1b1f32);
                    padding: 40px;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
                    text-align: center;
                    min-width: 360px;
                    border: 1px solid #282e48;
                }
                h1 {
                    font-size: 16px;
                    color: #8f9cae;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin: 0 0 10px 0;
                }
                .username {
                    font-size: 20px;
                    color: #38ef7d;
                    font-weight: 500;
                    margin-bottom: 25px;
                }
                .cash-box {
                    background-color: #0b0d14;
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid #1f2438;
                }
                .cash-amount {
                    font-size: 56px;
                    font-weight: 800;
                    color: #00ff87;
                    text-shadow: 0 0 20px rgba(0, 255, 135, 0.4);
                    margin: 0;
                }
                .status {
                    font-size: 12px;
                    color: #525f77;
                    margin-top: 20px;
                }
            </style>
            <script>
                setInterval(async () => {
                    try {
                        const res = await fetch('/get-current-cash');
                        const data = await res.json();
                        document.getElementById('user').innerText = data.username;
                        document.getElementById('money').innerText = data.cash;
                    } catch (e) {}
                }, 1500);
            </script>
        </head>
        <body>
            <div class="dashboard-card">
                <h1>Fix It Up - Live Status</h1>
                <div id="user" class="username">กำลังรอผู้เล่นเข้าเกม...</div>
                <div class="cash-box">
                    <p id="money" class="cash-amount">$0</p>
                </div>
                <div class="status">สถานะ: เชื่อมต่อสำเร็จ</div>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Dashboard running on port ' + PORT));
