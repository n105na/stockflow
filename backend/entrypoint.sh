#!/bin/sh

echo "Waiting for database..."
sleep 3

echo "Applying migrations..."
python manage.py migrate

echo "Creating superuser if not exists..."
python manage.py shell <<EOF
from django.contrib.auth.models import User
import os

username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@mail.com")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin1234")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
EOF

echo "Starting server..."
python manage.py runserver 0.0.0.0:8000