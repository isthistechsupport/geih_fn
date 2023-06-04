#!/bin/bash

set -e

virtualenv --without-pip virtualenv

# Uncomment if you're using the Python 3.9 runtime
pip install --platform=manylinux1_x86_64 --only-binary=:all: psycopg2-binary --target virtualenv/lib/python3.11/site-packages
pip install SQLAlchemy --target virtualenv/lib/python3.11/site-packages

# Uncomment if you're using the Python 3.11 runtime
# pip install -r requirements.txt --target virtualenv/lib/python3.11/site-packages
