## 사용한 JVM

openjdk version "17.0.2" 2022-01-18
OpenJDK Runtime Environment (build 17.0.2+8-86)
OpenJDK 64-Bit Server VM (build 17.0.2+8-86, mixed mode, sharing)

## WS

ec2내 Nginx로 서빙

## WAS

tomcat

'org.springframework.boot' version '3.4.4'



## Backend application.yml

~~~yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
  data:
    redis:
      host: 3.34.196.188
      port: 6379
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://database-1.c9iu488cmrdq.ap-northeast-2.rds.amazonaws.com:3306/hang?&characterEncoding=UTF-8
    username: admin
    password: admin4321
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        show_sql: true
        dialect: org.hibernate.dialect.MySQLDialect
  security:
    oauth2:
      client:
        registration:
          naver:
            client-id: i7ONapjdFhCga0jQTd4k
            client-secret: rp7WrOMHfg
            redirect-uri: http://localhost:3000/login/callback
        provider:
          naver:
            authorization-uri: https://nid.naver.com/oauth2.0/authorize
            token-uri: http://nid.naver.com/oauth2.0/token
            user-info-uri: https://openapi.naver.com/v1/nid/me
  auth:
    jwt:
      secret-key: hangbokdoghangbokdoghangbokdoghangbokdoghangbokdoghangbokdoghangbokdoghangbokdog
      access-token-expiry: 1000000000
      refresh-token-expiry: 1000000000

cloud:
  aws:
    credentials:
      access-key: AKIA6PBGC3B35AUMAEIJ
      secret-key: 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
    s3:
      bucket: palgona
      base:
        url: https://palgona.s3.ap-northeast-2.amazonaws.com/
    region:
      static: ap-northeast-2
    stack:
      auto: false

iamport:
  key: 5321268324862584
  secret: VzCu1xxHNeY2hOoupf6sMZHej9xuFK2GthB35cAVKB1BjIN6qVetpdh9IUSe6z7VXhwKVg6eWHVxjj0H

fcm:
  token:
    uri: https://fcm.googleapis.com/v1/projects/hangbokfog/messages:send
  config:
    path: hangbokfog-firebase-adminsdk-fbsvc-86cdf23c75.json


~~~



## BE - resources/hangbokfog-firebase-adminsdk-fbsvc-86cdf23c75.json

~~~json
{
  "type": "service_account",
  "project_id": "hangbokfog",
  "private_key_id": "86cdf23c750e00f4f852fcedb65bc8af64975aa6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDGG/SZZ65hU/57\nkz2untuzSnieXwWkIogmDp15B5xvXotwdFVHThjbcarZjxIogQDzMA6PdzXoUS+L\nA75WmZ+vWsfr7b0ZVkgmh5Sy1+UzDtGu19RVYqOknz2q11VN/y9hbwfdKT7VBHO/\nZO/adq9WZYfRsIJPeGjceaBFS3hfwEvYReTFEeT0S01E/aGmkXxq8iCmqDXayDB6\n4vMyhjG39WnWy9q9VKRPScFjiLpw64l2QWkwR6cIZr3ii0xpPmB7cMAj8aB9SFDF\n4BON8bUsPJSRHpvGj0p3OSiXQs9qBJEIcyrzXsjNtIrwbjvFzISgxJRUctisYxf3\npzGltX7RAgMBAAECggEAUZ/yE4TbHgHoEA12NC0C86fi88nN/rc1poyOCHCA3Yg0\nZqSgAG2moz/9t38R6bthY1GxJh5liS9uKdZkhbTtTOhYCBbfu4FH4Awr0dZPes6H\nyYTm2Tl3mFv+IhZv8N+MK5Z+RHr6hvU7JahWhQoyqyPRJq4Vut2vQuwgA30Zf0V3\nxjCAtIPoMlrfevCSNNUE7lqGnD9SgLZcqFaTHO1R9TNiCd1ubUplFINIqncHRBdF\nz7LYKU1NESZoZ8SFZnUtdVnWjSGOf+3BgD/ZEt3dEY5wjWm9EI6wxj4Y7RaO/rf7\n6OmsEg7uzCy6cZ+1hzqLsuw9UCOWI+SifT/w7Q+5IwKBgQDiHYdMoJ8Lz/hOusW/\nDoJuOd+/eCilFMG+Tq7eRlbcKz/eJQgLX85bPXxymWS+zeftPJqJgfkUKoToFEAl\nitlFGoan//Q0LVXcBd5Syh6xQFFqRFbDxitnP2yX+4gJbneyQW/5SynKPgI2mamR\nAq8eReOS05Xb2tJ4TRAXW12HUwKBgQDgSttGLXpTjsWRpve+IyHkEhDeKDfRlSYy\noITOBtEJVIOvVtAglpqt7z8Y1n8mp2TOa6fjtqerPegdlPIyz0vdmknJpqVWar8P\n92dITp29W7Hh5KlxxPVm9z8yr9yeS0+QC/Rj4hOa5Twvj3JSYnMtIClRIwje4kDA\nL5laSNIQywKBgQCd9rMGvU9fGTMHDUQIbUKBbrz5LiB280FGigFwFwOnXC+KKaSt\nDYlEBHhkNvVCtuZHvgbX+YzgobOnzj3h/FY9CIL56r3XlbRduVvPypQWkDBQZN2Y\nd2DrCEv9ASPQMvQ7+6sWJYRUXW1+Z2smexGLvJd3g4k1xnEyyeNr7dAxMQKBgQCq\nI96mI4VxsRHp5RB1aU0iJxooi7WcBFoPeXiEmOMlArlJ3r7OmbAIVT415zBY8A4m\nD8AxmrMh0ToshnobVOil1441q3YsUZlR0UjFru01YUNUqhJnPRMy4kdMed8PLO3T\nxV3EDxD0JQQ8x8HfANOB3a254Kuv901K/FCGDktbdQKBgQCvTCUldHf7Nr7OEA2B\nsX73486oDjhf+jLwipLBboUmfqvLz+Jnqe82/9dX+OgBSe9u5wgkx2IcAGD5FEvN\nACPyP6BfFePG23iJuQ6GIVN70QjQB3ud+Oj/eelyqEvcUdHbdLZkDUUEZoix+JAO\nAQIsGEnpaUUamc4+U4cXXn9HeQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@hangbokfog.iam.gserviceaccount.com",
  "client_id": "117640785854817873788",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40hangbokfog.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

~~~



## FE - .env

```xml
// .env.development
VITE_NAVER_CLIENT_ID=i7ONapjdFhCga0jQTd4k
VITE_NAVER_REDIRECT_URI=http://localhost:5173/login/callback
VITE_ORIGIN_URI=http://localhost:5173
VITE_API_URI=https://k12a103.p.ssafy.io/api/v1/
VITE_AI_URI=http://localhost:8000
VITE_FIREBASE_API_KEY=AIzaSyDX9iqhdjLkY9nxhtJMonnakBtDDse9daM
VITE_FIREBASE_AUTH_DOMAIN=hangbokfog.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hangbokfog
VITE_FIREBASE_STORAGE_BUCKET=hangbokfog.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=637266081407
VITE_FIREBASE_APP_ID=1:637266081407:web:b3be546fc999261dd3714a
VITE_FIREBASE_MEASUREMENT_ID=G-QXHW83KLBW
VITE_AI_URL_PRODUCT=http://k12a103.p.ssafy.io:8010


// .env.production
VITE_NAVER_CLIENT_ID=i7ONapjdFhCga0jQTd4k
VITE_NAVER_REDIRECT_URI=https://hangbokdog.co.kr/login/callback
VITE_ORIGIN_URI=https://hangbokdog.co.kr
VITE_API_URI=https://k12a103.p.ssafy.io/api/v1/
VITE_AI_URI=http://localhost:8000
VITE_FIREBASE_API_KEY=AIzaSyDX9iqhdjLkY9nxhtJMonnakBtDDse9daM
VITE_FIREBASE_AUTH_DOMAIN=hangbokfog.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hangbokfog
VITE_FIREBASE_STORAGE_BUCKET=hangbokfog.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=637266081407
VITE_FIREBASE_APP_ID=1:637266081407:web:b3be546fc999261dd3714a
VITE_FIREBASE_MEASUREMENT_ID=G-QXHW83KLBW
VITE_AI_URL_PRODUCT=https://k12a103.p.ssafy.io


const firebaseConfig = {
  apiKey: "AIzaSyDX9iqhdjLkY9nxhtJMonnakBtDDse9daM",
  authDomain: "hangbokfog.firebaseapp.com",
  projectId: "hangbokfog",
  storageBucket: "hangbokfog.firebasestorage.app",
  messagingSenderId: "637266081407",
  appId: "1:637266081407:web:b3be546fc999261dd3714a",
  measurementId: "G-QXHW83KLBW"
};
vapid_key = BO49kou3WZ4toKfR7gvn3xs4F_5nPoqRn-DUOf7DfNNWZh4WDGcz22Zrk2fCfp8jctY6mmCSZUeWxz-nqTpEqfs
```



## Nginx 설정



### SSAFY 제공 서버에 올라간 Nginx conf

~~~nginx
server {
    listen 80;
    server_name k12a103.p.ssafy.io;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name k12a103.p.ssafy.io;

    ssl_certificate /etc/letsencrypt/live/k12a103.p.ssafy.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/k12a103.p.ssafy.io/privkey.pem;

    client_max_body_size 10M;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://127.0.0.1:8010;
	proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
}

    location /api/ {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

upstream backend_servers {
    server 127.0.0.1:8084;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}
~~~



### Front 배포 서버에 올라간 Nginx conf

~~~nginx
upstream backend_servers {
    server k12a103.p.ssafy.io;
}

server {
    listen 80;
    server_name hangbokdog.co.kr;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name hangbokdog.co.kr;

    ssl_certificate /etc/letsencrypt/live/hangbokdog.co.kr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hangbokdog.co.kr/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    client_max_body_size 10M;

    root /home/ubuntu/S12P31A103/FE/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass https://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
~~~



## DB 접속 정보

~~~mark
mysql -u admin -h database-1.c9iu488cmrdq.ap-northeast-2.rds.amazonaws.com -p
password = admin4321
~~~

