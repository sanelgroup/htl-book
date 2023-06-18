# Basisimage
FROM nginx:latest

# Kopiere den React-Build in das Image
COPY dist/ /usr/share/nginx/html

# Kopiere das Favicon in das Image
#COPY build/favicon.ico /usr/share/nginx/html/favicon.ico

# Kopiere die Nginx-Konfigurationsdatei in das Image
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Port 80
EXPOSE 80
