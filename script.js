// 1. 時計を更新する関数
function updateTime() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // iPadで見やすい形式に整形
    clockElement.innerHTML = `${year}/${month}/${date}(${day}) <span style="font-weight:bold; margin-left:10px;">${hours}:${minutes}:${seconds}</span>`;
}

// 2. ニュースを取得する関数（RSSをJSONに変換する無料サービスを利用）
async function fetchNews() {
    const newsElement = document.getElementById('news-list');
    if (!newsElement) return;

    newsElement.innerHTML = '<p style="color: #aaa;">ニュースを読み込み中...</p>';

    try {
        // GoogleニュースのRSSをJSONに変換して取得（CORS回避用プロキシ利用）
        const rssUrl = 'https://topics.ndtv.com/rss/world-news.xml'; // または日本のニュースRSS
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja`);
        const data = await response.json();

        if (data.status === 'ok') {
            newsElement.innerHTML = ''; // 読み込み中を消す
            data.items.slice(0, 10).forEach(item => {
                const li = document.createElement('li');
                li.style.marginBottom = '15px';
                li.innerHTML = `
                    <a href="${item.link}" target="_blank" style="color: #fff; text-decoration: none; display: block;">
                        <div style="font-size: 0.9em; color: #00d4ff;">${new Date(item.pubDate).toLocaleTimeString()}</div>
                        <div style="font-size: 1.1em; line-height: 1.4;">${item.title}</div>
                    </a>
                `;
                newsElement.appendChild(li);
            });
        } else {
            throw new Error('News fetch failed');
        }
    } catch (error) {
        console.error('News Error:', error);
        newsElement.innerHTML = '<p style="color: #ff4b2b;">ニュースの取得に失敗しました。再読み込みしてください。</p>';
    }
}

// 3. ページが読み込まれた時の全自動起動設定
window.addEventListener('DOMContentLoaded', () => {
    // 最初に1回実行
    updateTime();
    fetchNews();

    // 時計は1秒ごとに更新
    setInterval(updateTime, 1000);

    // ニュースは30分ごとに更新
    setInterval(fetchNews, 1000 * 60 * 30);
});