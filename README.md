# Monitoring Dashboard Platform

## Overview
This project is a simple Monitoring Dashboard Platform with a Node.js backend exposing mock metrics and a React frontend visualizing real-time metrics. It is containerized using Docker, deployed on a local k3s Kubernetes cluster, and automated with a GitLab CI pipeline..

## System Architecture
![Architecture Diagram](architecture.png)

The system consists of:
- **Backend**: Node.js with Express, exposing a `/metrics` endpoint.
- **Frontend**: React with Chart.js, polling metrics every 10 seconds.
- **Containerization**: Docker with multi-stage builds for small images.
- **Orchestration**: k3s for local Kubernetes deployment.
- **CI/CD**: GitLab CI for testing, linting, building, and deploying.

## Tech Stack Choices
- **Node.js/Express**: Lightweight, fast, and widely used for microservices.
- **React/Chart.js**: React for modern UI, Chart.js for simple and responsive charts.
- **Docker**: Ensures consistent environments and small image sizes (<200MB).
- **k3s**: Lightweight Kubernetes distribution, ideal for local development.
- **GitLab CI**: Free-tier, integrates well with GitLab for CI/CD automation.

## Local Deployment Guide
### Prerequisites
- Docker
- k3s (`curl -sfL https://get.k3s.io | sh -`)
- kubectl
- GitLab account and Docker Hub account
- Node.js (for local development)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/bhanusaisuryatejadevops/Infilect-monitoring-dashboard.git
   cd Infilect-monitoring-dashboard
