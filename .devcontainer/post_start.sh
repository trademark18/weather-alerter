#!/bin/sh
set -e

# This script runs every time the container starts.  Make sure it's idempotent.
# This script runs after post_create.sh, so you can rely on files/operations
# that took place in that script.  Ideally we want as little as possible in here,
# and whatever does go here is ideally pretty quick.  The primary reason you'd need
# to put something here is that it needs to take place after specific files are copied
# over from the host (initially this file is used to configure the .gitignore).

# The $1 parameter in this script is the container workspace directory.

# Set the workspace folder as a safe directory
git config --global --replace-all safe.directory $1
# echo "Set gitconfig safe directory"

# These settings are useful if you're running the container from the Windows filesystem
# It's almost useless to do so, however, because the disk performance is abysmal 
# (60x slower, roughly) unless you're using WSL2.  Clone your repo to a WSL2 directory 
# and then run your container from there.  In that case these options likely won't be required.
git config --global core.autocrlf input 
# echo "Set gitconfig autocrlf"
git config --global core.fileMode false 
# echo "Set gitconfig fileMode"

# GPG Commit Signing
# The container has GPG installed and is automatically hooked up to your hosts GPG
# agent.  In WSL2/Mac this should all just work seamlessly if you've got GPG working on
# host already.  You can follow the steps here to set up GPG signing on your host:
# https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/#create-a-gpg-key
git config --global --replace-all gpg.program "/usr/bin/gpg" 
# echo "Set gitconfig gpg program"

# GPG Signing Enabled Flag
# Use this to manually override the host's configuration to sign or not sign commits.
# Leave this all commented to use the host's setting without overriding.
# git config --global --replace-all commit.gpgsign false # to disable
# git config --global --replace-all commit.gpgsign true # to enable

# Uncomment this if you need to override the editor specified by your host system's .gitconfig
# git config --global --replace-all core.editor "code --wait" 
#echo "Set gitconfig core editor"

echo "Git is now configured"

# Check if the pip package is installed
set +e
pip show trek10-accounts-plugin > /dev/null 2>&1

# If the pip package is not installed, print an error message
if [ $? -ne 0 ]; then
  tput setaf 4; echo "Devcontainer is Ready 🚀"
else
  # Set the secrets provider to be the Trek10 regex list
  git config --global --replace-all secrets.providers "cat /home/node/.trek10/git-secrets-regexes"
  echo "Added Trek10-specific secrets regexes"
  tput setaf 4; echo "Trek10 Devcontainer is Ready 🐐"
fi
