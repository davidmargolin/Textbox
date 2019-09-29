import React, { useState, useRef } from "react";
import {Container, Row, Col} from 'react-amazing-grid'

const Posts = () => {
    const [images, setImages] = useState([]);
    const [texts, setTexts] = useState([]);

    return (
      <div>
        <Container>
          <Row height="1*">
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
            <Col width="auto">
              <img src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
            </Col>
          </Row>
        </Container>
      </div>
    )
};

export default Posts;
