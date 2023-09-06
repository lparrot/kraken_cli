FROM maven:3.9.4-eclipse-temurin-8

ARG NODE_VERSION=16.19.1
ARG USER_HOME_DIR="/root"

RUN apt-get install -y curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

ENV NVM_DIR=$USER_HOME_DIR/.nvm

#RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

ENV PATH="${NVM_DIR}/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN chown -R root:root $NVM_DIR

ENV MAVEN_HOME /usr/share/maven

COPY docker/settings.xml $MAVEN_HOME/ref/
COPY docker/.npmrc $USER_HOME_DIR

WORKDIR /root/kraken_cli

RUN npm i -g @kraken/cli

EXPOSE 9998

CMD ["kn", "ui"]
