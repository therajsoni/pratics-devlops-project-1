FROM node:latest as build
WORKDIR /app
ARG VITE_BACKEND
ENV VITE_BACKEND=$VITE_BACKEND
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ["ls"]
EXPOSE 5173

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
 
