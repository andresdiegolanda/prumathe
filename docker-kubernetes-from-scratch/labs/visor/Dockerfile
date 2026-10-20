FROM python:3.14.8-alpine3.24@sha256:f6a589d43c42b9e7f7dc67a12d37132491f362859a5d750607710cc56da3bc72
WORKDIR /visor
COPY visor.py docker_watch.py kube_watch.py ./
COPY static/ ./static/
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
USER 10001:10001
EXPOSE 18091
CMD ["python", "/visor/visor.py"]
