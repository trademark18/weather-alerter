#!/bin/sh
set -e

# This script runs ONCE after the devcontainer is created.  The container is
# merely STOPPED when not in use, typically, so unless you've gone into Docker
# on the host machine and deleted the container, it shouldn't run this stuff
# more than once.  That said, you should make all this idempotent as there may
# be a variety of reasons for which a container may need to be recreated, even
# during the development process.

# The $1 parameter in this script is the container workspace directory.

# We run as "node" user on this 
sudo chown -R node ~/.awsume
pip install git-remote-codecommit awsume awsume-console-plugin 
echo alias awsume=\". awsume\" >> /home/node/.bashrc
git clone https://github.com/awslabs/git-secrets.git /home/node/git-secrets
cd /home/node/git-secrets
sudo make install
sudo chown node $1
sudo apt-get update && sudo apt-get -y install xdg-utils
npm i -g @ampt/cli

# Get the public IP address
public_ip=$(curl -s ifconfig.me)

# Check if the public IP address matches 35.155.152.37 or 52.2.140.103
on_t10_network=false
if [[ $public_ip == "35.155.152.37" || $public_ip == "52.2.140.103" ]]; then
  on_t10_network=true
fi

# Print the result
if [ "$on_t10_network" = true ]; then
  echo "Installing Trek10-specific tools"
  pip install trek10-accounts-plugin --extra-index-url "https://pypi.trek10.com"
else
  echo "Off network"
fi
