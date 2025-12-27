const API_KEY = 'f4c2a72d043e4027b1cc63b53f7e6d4d';
// 確実性を高めるため、まずは一番シンプルな「日本のトップヘッドライン」に戻します
// 中継サーバーを頭につける魔法（これでlocalhost制限を回避！）
const NEWS_URL = `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?country=jp&apiKey=${API_KEY}`;

async function fetchNews() {
    const newsContent = document.getElementById('news-content');
    const apiStatus = document.getElementById('api-status');
    
    console.log("Fetching from:", NEWS_URL);

    try {
        const response = await fetch(NEWS_URL);
        
        // 通信自体が失敗した場合（401や426エラーなど）
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`APIエラー: ${errorData.message} (コード: ${response.status})`);
        }

        const data = await response.json();
        console.log("Data received:", data);

        if (data.status === "ok") {
            newsContent.innerHTML = ''; 
            
            if (data.articles.length === 0) {
                newsContent.innerHTML = '<div class="news-card">記事が1件も見つかりませんでした。</div>';
                return;
            }

            data.articles.forEach(article => {
                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <div style="font-size: 0.8rem; color: var(--accent); font-weight: bold;">
                        ${article.source.name}
                    </div>
                    <div style="font-size: 1.4rem; margin-top: 5px;">
                        <a href="${article.url}" target="_blank" style="color: white; text-decoration: none;">
                            ${article.title}
                        </a>
                    </div>
                `;
                newsContent.appendChild(card);
            });
            apiStatus.textContent = `NewsAPI: Online (${data.articles.length}件)`;
        }
    } catch (e) {
        console.error("Fetch Error details:", e);
        // 画面に具体的な原因を表示させる
        newsContent.innerHTML = `
            <div class="news-card" style="border: 1px solid red;">
                <p style="color: #ff4444; font-weight: bold;">⚠️ ニュース読み込み失敗</p>
                <p style="font-size: 0.9rem;">${e.message}</p>
                <p style="font-size: 0.8rem; opacity: 0.6;">
                    ※ローカル環境(file://)での実行制限の可能性があります。<br>
                    iPadで開く前にMacで一度確認してみてください！
                </p>
            </div>
        `;
        apiStatus.textContent = "NewsAPI: Connection Failed";
    }
}

// 初回実行
updateTime(); // 時計の関数
fetchNews();
setInterval(updateTime, 1000); // 1秒ごとに時計を更新
setInterval(fetchNews, 10 * 60 * 1000); // 10分ごとにニュースを更新
