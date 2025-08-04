TAG ?= v0.1.2
REGION ?= eu-west-1
ACCOUNT_ID := 821160991761
REPO := rainbaseai-ui
AWS_PROFILE_NAME := rainbase

# Auth0 configuration - these will be picked up from environment variables
NEXT_PUBLIC_AUTH0_DOMAIN ?= $(shell echo $NEXT_PUBLIC_AUTH0_DOMAIN)
NEXT_PUBLIC_AUTH0_CLIENT_ID ?= $(shell echo $NEXT_PUBLIC_AUTH0_CLIENT_ID)
NEXT_PUBLIC_AUTH_URL ?= $(shell echo $NEXT_PUBLIC_AUTH_URL)

# Login to ECR
.PHONY: ecr/login
ecr/login:
	echo 'Login to AWS ECR'
	aws ecr get-login-password --region ${REGION} --profile ${AWS_PROFILE_NAME} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Build, TAG and Push Image to AWS ECR for x86 architecture hardware(amd64)
.PHONY: run/build/push
run/build/push: ecr/login
	echo 'Build and Push Image to ECR REPO'
	echo 'Using NEXT_PUBLIC_AUTH0_DOMAIN: ${NEXT_PUBLIC_AUTH0_DOMAIN}'
	echo 'Using NEXT_PUBLIC_AUTH0_CLIENT_ID: ${NEXT_PUBLIC_AUTH0_CLIENT_ID}'
	docker build --no-cache \
		--build-arg NEXT_PUBLIC_AUTH0_DOMAIN=${NEXT_PUBLIC_AUTH0_DOMAIN} \
		--build-arg NEXT_PUBLIC_AUTH0_CLIENT_ID=${NEXT_PUBLIC_AUTH0_CLIENT_ID} \
		--build-arg NEXT_PUBLIC_AUTH_URL=${NEXT_PUBLIC_AUTH_URL} \
		-t ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:${TAG} . \
		--platform linux/arm64
	echo 'Push to ECR'
	docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:${TAG}

.PHONY: local/build
local/build:
	echo 'Using NEXT_PUBLIC_AUTH0_DOMAIN: ${NEXT_PUBLIC_AUTH0_DOMAIN}'
	echo 'Using NEXT_PUBLIC_AUTH0_CLIENT_ID: ${NEXT_PUBLIC_AUTH0_CLIENT_ID}'
	docker build \
		--build-arg NEXT_PUBLIC_AUTH0_DOMAIN=${NEXT_PUBLIC_AUTH0_DOMAIN} \
		--build-arg NEXT_PUBLIC_AUTH0_CLIENT_ID=${NEXT_PUBLIC_AUTH0_CLIENT_ID} \
		-t treatwiseai-ui:${TAG} . \
		--platform linux/arm64

.PHONY: local/test
local/test: local/build
	docker run -d --name treatwiseai-ui -p 3000:3000 treatwiseai-ui:${TAG}

.PHONY: local/stop
local/stop:
	docker stop treatwiseai-ui && docker rm treatwiseai-ui