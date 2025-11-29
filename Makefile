TAG ?= v0.1.1
REGION ?= eu-west-1
ACCOUNT_ID := 821160991761
REPO := rainbaseai-website
AWS_PROFILE_NAME := rainbase

# Login to ECR
.PHONY: ecr/login
ecr/login:
	@echo 'Login to AWS ECR'
	aws ecr get-login-password \
		--region ${REGION} \
		--profile ${AWS_PROFILE_NAME} \
	| docker login --username AWS --password-stdin \
		${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Build & Push Docker image (ARM64 platform)
.PHONY: run/build/push
run/build/push: ecr/login
	@echo 'Build and Push Image to ECR REPO'
	docker build --no-cache \
		-t ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:${TAG} \
		--platform linux/arm64 .
	@echo 'Push to ECR'
	docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:${TAG}
