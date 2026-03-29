# <p align="center">⚡ 𝗕𝗘𝗟𝗔𝗟 𝗕𝗢𝗧𝗫𝟲𝟲𝟲 : 𝗧𝗛𝗘 𝗖𝗬𝗕𝗘𝗥 𝗢𝗠𝗡𝗜 ⚡</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=soft&color=00FF41&height=320&section=header&text=MASTER%20BELAL&fontSize=100&animation=waving&fontAlignY=35&desc=THE%20CYBER%20EMPEROR%20IS%20HERE!&descSize=25&descAlignY=60&stroke=000000&strokeWidth=2&fontStack=Orbitron" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=900&size=34&duration=1800&pause=200&color=00FF41&center=true&vCenter=true&width=1100&lines=>>>+ACCESSING+MESSENGER+MATRIX...;>>>+MASTER+BELAL+AUTHENTICATED+✅;>>>+BYPASSING+SYSTEM+FIREWALLS...;>>>+DEPLOYING+HACKER+PROTOCOL...;>>>+GOD+MODE+ACTIVATED!;>>>+[!]ERROR:++UNAUTHORIZED+ACCESS+DETECTED+(!);>>>+LEVELING+UP:+LEVEL_OVERLORD..." />
</p>

<p align="center">
  <img src="https://i.imgur.com/qyewZ9R.jpeg" width="550" style="border: 8px solid #00FF41; box-shadow: 0 0 80px #00FF41, inset 0 0 20px #00FF41; border-radius: 30px;">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Anmol-Baranwal/Cool-GIFs-for-GitHub/master/GIFs/hacker-cat.gif" width="600" style="border: 6px solid #00FF41; box-shadow: 0 0 80px #00FF41; border-radius: 20px;" alt="Hacking Gaming Scene">
</p>

<div align="center">
  <img src="https://img.shields.io/badge/IDENTITY-CYBER%20GHOST-00FF41?style=for-the-badge&logo=ghost&logoColor=black">
  <img src="https://img.shields.io/badge/RANK-PREMIUM%20DEV-red?style=for-the-badge&logo=hackerone&logoColor=white">
  <img src="https://img.shields.io/badge/GAMING-MODE%20ON-blue?style=for-the-badge&logo=gamepass&logoColor=white">
</div>

---

## ☣️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗞𝗘𝗥𝗡𝗘𝗟 (𝗡𝗢𝗗𝗘.𝗝𝗦 𝗖𝗜 / 𝗖𝗗)
আপনার বটের মেইন ইঞ্জিন কনফিগারেশন, যা আপনার রিপোজিটরির অটোমেটিক ডিপ্লয়মেন্ট নিশ্চিত করে:

```yaml
# 🧪 BELAL BOTX666 AUTOMATED WORKFLOW
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}
    - name: Install dependencies
      run: npm install
    - name: Start the bot
      env:
        PORT: 8080
      run: npm start
