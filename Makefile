TAG ?= v0.1.0
REGION ?= eu-west-1
ACCOUNT_ID := 821160991761
REPO := rainbaseai-website
AWS_PROFILE_NAME := rainbase

NEXT_PUBLIC_SUPABASE_ANON_KEY ?= $(shell echo $NEXT_PUBLIC_SUPABASE_ANON_KEY)
NEXT_PUBLIC_SUPABASE_URL?= $(shell echo $NEXT_PUBLIC_SUPABASE_URL)

# Login to ECR
.PHONY: ecr/login
ecr/login:
	echo 'Login to AWS ECR'
	aws ecr get-login-password --region ${REGION} --profile ${AWS_PROFILE_NAME} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Build, TAG and Push Image to AWS ECR for x86 architecture hardware(amd64)
.PHONY: run/build/push
run/build/push: ecr/login
	echo 'Build and Push Image to ECR REPO'
	docker build --no-cache \
		--build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY} \
		--build-arg NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL} \
		-t ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:${TAG} . \
		--platform linux/arm64
	echo 'Push to ECR'
	docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:${TAG}