FROM python:3.14.8-alpine3.24@sha256:f6a589d43c42b9e7f7dc67a12d37132491f362859a5d750607710cc56da3bc72
WORKDIR /app
RUN addgroup -g 10001 app && adduser -D -u 10001 -G app app && mkdir /data && chown app:app /data
COPY --chown=app:app server.py probe.py ./
ARG APP_VERSION=1.0.0
ENV APP_VERSION=$APP_VERSION PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
USER 10001:10001
EXPOSE 8080
HEALTHCHECK --interval=3s --timeout=2s --retries=3 CMD ["python", "/app/probe.py", "http://127.0.0.1:8080/health", "ok"]
CMD ["python", "/app/server.py"]
