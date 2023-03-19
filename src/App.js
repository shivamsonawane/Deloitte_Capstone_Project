import './App.css';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './App.css';

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
            image: data.data.urlToImage,
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
      <Container>
        <h1 className="heading">Hacker News Dashboard</h1>
        <Row>
          {news.map((newsItem) => (
            <Col md={4} key={newsItem.title}>
              <Card className="mb-4">
                <Card.Img variant="top" src={newsItem.image} alt={newsItem.title} className="card-img" />
                <Card.Body>
                  <Card.Title className="card-title">{newsItem.title}</Card.Title>
                  <Card.Text>
                    <span className="card-author">{newsItem.author}</span> |{' '}
                    <span className="card-date">{new Date(newsItem.time * 1000).toLocaleString()}</span>
                  </Card.Text>
                  <Button href={newsItem.url} target="_blank" variant="primary" className="card-button">
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
