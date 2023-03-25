import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get("https://hacker-news.firebaseio.com/v0/newstories.json")
      .then((response) => {
        const latestNews = response.data.slice(0, 10);
        const newsPromises = latestNews.map((newsId) =>
          axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${newsId}.json`
          )
        );
        Promise.all(newsPromises).then((newsData) => {
          const newsItems = newsData.map((data) => ({
            title: data.data.title,
            url: data.data.url,
            author: data.data.by,
            time: data.data.time,
            imageUrl: null,
          }));
          setNews(newsItems);
          const imagePromises = newsData.map((data, index) =>
            axios.get(`https://api.unsplash.com/search/photos?page=1&per_page=1&query=${newsItems[index].title}`, {
              headers: {
                Authorization: 'Client-ID ubC6ChWmQEhIaMAU1aLb9jZNAc2K3rXyzs0UDqQXk-E',
              },
            })
          );
          Promise.all(imagePromises).then((imageData) => {
            const updatedNewsItems = newsItems.map((newsItem, index) => ({
              ...newsItem,
              imageUrl: imageData[index].data.results[0].urls.regular,
            }));
            console.log(updatedNewsItems);
            setNews(updatedNewsItems);
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="App">
      <Container>
        <h1 className="heading">Security News Hub</h1>
        <Row>
          {news.map((newsItem) => (
            <Col md={4} key={newsItem.title}>
              <Card className="mb-4">
                {newsItem.imageUrl && (
                  <div className="card-img-container">
                    <Card.Img
                      variant="top"
                      src={newsItem.imageUrl}
                      alt={newsItem.title}
                      className="card-img"
                    />
                  </div>
                )}
                <Card.Body>
                  <Card.Title className="card-title">
                    {newsItem.title}
                  </Card.Title>
                  <Card.Text>
                    <span className="card-author">{newsItem.author}</span> |{" "}
                    <span className="card-date">
                      {new Date(newsItem.time * 1000).toLocaleString()}
                    </span>
                  </Card.Text>
                  <Button
                    href={newsItem.url}
                    target="_blank"
                    variant="primary"
                    className="card-button"
                  >
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
