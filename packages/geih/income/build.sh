#!/bin/bash

set -e

virtualenv virtualenv
source virtualenv/bin/activate
pip install psycopg2 SQLAlchemy
deactivate
