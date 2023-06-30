FROM "mcr.microsoft.com/devcontainers/typescript-node:18-bullseye"
ARG USERNAME

RUN apt-get update -y && apt-get upgrade -y

# Install gnupg2
# This is required only if your base image does not already include GPG
# https://code.visualstudio.com/docs/devcontainers/containers#_sharing-gpg-keys
# RUN sudo apt-get install gnupg2 -y

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && mkdir /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R $USERNAME /commandhistory \
    && echo "$SNIPPET" >> "/home/$USERNAME/.bashrc"
