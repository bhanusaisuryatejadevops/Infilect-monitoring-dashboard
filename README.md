Monitoring Dashboard Platform
Overview
The Monitoring Dashboard Platform is a lightweight application for visualizing real-time metrics. It consists of a Node.js backend exposing a /metrics endpoint and a React frontend displaying dynamic charts. The application is containerized using Docker, orchestrated with a k3s Kubernetes cluster on an AWS EC2 instance (34.235.116.29), and automated via a GitHub Actions CI/CD pipeline.
System Architecture

The system architecture, depicted in architecture.svg (created using draw.io), includes:

GitHub Actions Pipeline: Triggers on pull requests and merges to main, executing tests, linting, Docker image builds, and k3s deployments.
Docker Hub: Hosts images suryatejainfra/monitoring-backend:latest and suryatejainfra/monitoring-frontend:latest.
k3s Cluster: Runs on EC2 (34.235.116.29) in the monitoring namespace, with:
Backend Deployment: Node.js/Express pod serving /metrics on port 3001.
Frontend Deployment: React/Chart.js pod polling the backend.
Services: NodePort services exposing backend (31001) and frontend (31000).


External Access: Backend at http://34.235.116.29:31001/metrics, frontend at http://34.235.116.29:31000.

Tech Stack Choices

Node.js/Express:
Reasoning: Lightweight, fast, and ideal for microservices. Express simplifies API development with robust middleware support, perfect for the /metrics endpoint.


React/Chart.js:
Reasoning: React provides a modern, component-based UI for dynamic updates. Chart.js offers lightweight, responsive charts for metric visualization.


Docker:
Reasoning: Ensures consistent environments across development and production. Multi-stage builds keep images compact (<200MB).


k3s:
Reasoning: A lightweight Kubernetes distribution, optimized for resource-constrained environments like a single EC2 instance.


GitHub Actions:
Reasoning: Free-tier CI/CD, seamlessly integrates with GitHub, and supports Docker and Kubernetes workflows efficiently.



Local Deployment Guide
Prerequisites

Docker: For building and running containers.
k3s: Lightweight Kubernetes (curl -sfL https://get.k3s.io | sh -).
kubectl: For interacting with the k3s cluster.
GitHub Account: For repository access and CI/CD configuration.
Docker Hub Account: For image storage (suryatejainfra).
Node.js: For local development (optional).
EC2 Key Pair: For SSH access to ubuntu@34.235.116.29.

Steps

Clone the Repository:
git clone https://github.com/bhanusaisuryatejadevops/Infilect-monitoring-dashboard.git
cd Infilect-monitoring-dashboard


Run Locally with Docker Compose:
docker-compose up --build


Access:
Backend: http://34.235.116.29:3001/metrics
Frontend: http://34.235.116.29:3000




Set Up k3s on EC2:
ssh -i <path-to-your-ec2-key.pem> ubuntu@34.235.116.29
curl -sfL https://get.k3s.io | sh -
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(whoami):$(whoami) ~/.kube/config
chmod 600 ~/.kube/config


Apply Kubernetes Manifests:
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml


Access:
Backend: http://34.235.116.29:31001/metrics
Frontend: http://34.235.116.29:31000




Set Up GitHub Actions:

Add secrets in GitHub (Settings > Secrets and variables > Actions > Secrets):
DOCKER_USERNAME: suryatejainfra
DOCKER_PASSWORD: Docker Hub access token (from https://hub.docker.com/settings/security)
K3S_TOKEN: Run sudo cat /var/lib/rancher/k3s/server/node-token on EC2.


Push code to trigger the pipeline.



Running the CI/CD Pipeline

Triggers: The pipeline runs on pull requests and merges to the main branch.
Steps:
Test: Executes npm test for backend and frontend (skips if not configured).
Lint: Runs npm run lint for backend and frontend (skips if not configured).
Build: Builds and pushes Docker images (suryatejainfra/monitoring-backend:latest, suryatejainfra/monitoring-frontend:latest) to Docker Hub.
Deploy: Applies Kubernetes manifests to the k3s cluster and restarts deployments.


Monitor: Check pipeline status at https://github.com/bhanusaisuryatejadevops/Infilect-monitoring-dashboard/actions.
Trigger Manually:echo "# Test pipeline" >> README.md
git add README.md
git commit -m "Trigger CI/CD pipeline"
git push origin main



Accessing Services

Local (Docker Compose):
Backend: http://34.235.116.29:3001/metrics
Frontend: http://34.235.116.29:3000


Kubernetes (k3s):
Backend: http://34.235.116.29:31001/metrics
Frontend: http://34.235.116.29:31000



Viewing Logs and Troubleshooting

Docker Compose Logs:docker-compose logs backend
docker-compose logs frontend


Kubernetes Logs:kubectl -n monitoring logs -l app=backend
kubectl -n monitoring logs -l app=frontend


Backend Logs: Check backend/logs/app.log for request and metrics logs (if configured).
Troubleshooting:
Pipeline Failure: Check logs at https://github.com/bhanusaisuryatejadevops/Infilect-monitoring-dashboard/actions.
k3s Issues: Verify k3s is running:ssh -i <path-to-your-ec2-key.pem> ubuntu@34.235.116.29
sudo systemctl status k3s

Restart if needed:sudo systemctl restart k3s


Pod Issues: Check pod status:kubectl -n monitoring get pods


Network Issues: Ensure EC2 security group allows ports 6443 (k3s API), 31000 (frontend), and 31001 (backend).
Docker Hub Issues: Verify images at https://hub.docker.com/u/suryatejainfra.
Secrets Issues: Confirm DOCKER_USERNAME, DOCKER_PASSWORD, and K3S_TOKEN are set in GitHub Secrets.
Dashboard Zeros: Verify frontend/src/App.js uses http://backend:3001/metrics and check frontend logs:kubectl -n monitoring logs -l app=frontend

Test backend from frontend pod:kubectl -n monitoring exec -it pod/frontend-<pod-name> -- sh
apk add curl
curl http://backend:3001/metrics
exit