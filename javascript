import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get('https://hacker-news.firebaseio.com/v0/newstories.json')
      .then((response) => {
        const latestNews = response.data.slice(0, 10);
        const newsPromises = latestNews.map((newsId) =>
          axios.get(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`)
        );
        Promise.all(newsPromises).then((newsData) => {
          const newsItems = newsData.map((data) => ({
            title: data.data.title,
            url: data.data.url,
            author: data.data.by,
            time: data.data.time,
          }));
          setNews(newsItems);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Cybersecurity News</h1>
      <ul>
        {news.map((newsItem) => (
          <li key={newsItem.title}>
            <a href={newsItem.url} target="_blank" rel="noreferrer">
              {newsItem.title}
            </a>{' '}
            by {newsItem.author} ({new Date(newsItem.time * 1000).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
