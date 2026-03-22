#!/usr/bin/env bash
set -o errexit

pipenv install --deploy
python manage.py collectstatic --no-input
python manage.py migrate
