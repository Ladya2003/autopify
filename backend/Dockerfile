# Устанавливаем базовый образ Node.js
FROM node:16

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Указываем порт, который приложение будет слушать
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start:prod"]
