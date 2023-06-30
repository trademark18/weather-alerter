#!/bin/bash

# Check if the ~/.trek10 folder exists
if [ ! -d ~/.trek10 ]; then

  # The directory does not exist, so exit the script
  mkdir $1/.trek10

fi
