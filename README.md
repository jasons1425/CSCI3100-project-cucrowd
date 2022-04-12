# cu-crowd


# Project tools

Frontend: React.JS

Backend: Python Django

Framework: https://www.django-rest-framework.org/

Design: Figma https://www.figma.com/file/MwBMWKmREYUG3DNRwUHaaP/CSCI3100_project?node-id=0%3A1


# Project development model

SCRUM, Sprint Structure (Agile Software Development)

https://searchsoftwarequality.techtarget.com/definition/Scrum-sprint

https://www.scnsoft.com/blog/software-development-models#Scrum


# High-Level Description

https://docs.google.com/document/d/1I2MnXVgWsSJvWj0sM4RzHOcH3UH_gpJIyJ3-lNy49vw/edit?usp=sharing


# Testing Gmail Account

email:  csci3100cucrowd@gmail.com 

password:  CUcrowd2022

# Set Up

### Frontend (localhost:3000)

1. Install Node.js: https://nodejs.org/en/download/

1. Open the command terminal, and test whether the npm command works: `npm --version`

1. Go to the `/main/frontend/` directory, and run the below commands:
```
> npm i react-script --save
> npm install axios --save
> npm start
```

### MySQL Database (localhost:3306)

1. Install the MySQL database server and MySQL Command Line Client: [Installation Guide](https://docs.oracle.com/en/java/java-components/advanced-management-console/2.23/install-guide/mysql-database-installation-and-configuration-advanced-management-console.html#GUID-12323233-07E3-45C2-B77A-F35B3BBA6592)

1. Create the MySQL root user with the below credentials: (or, modify the database credentials details in the `/backend/backend/settings.py`)
```
username: root
password: 123456Aa
```
3. Ensure the MySQL server is running (on Windows, open the admin CMD console and run `net start mysql80`)

4. Open and log in to the MySQL Command Line Client

5. Create the cucrowd database: `CREATE DATABASE cucrowd;`

### Backend (localhost:8000)

1. Install Python version 3.9 or above: https://www.python.org/downloads/

1. Open the command terminal and test whether the python command works: `python --version`

1. Go to the `/main/backend/` directory, and run the below commands
```
> python install -r requirements.txt
> python manage.py migrate
```

# Getting Started

1. Ensure the MySQL server is running at localhost:3306

1. Open a command terminal, go to the `/main/frontend/` directory and run `npm start`

1. Open another command terminal, go to the `/main/backend/` directory and run `python manage.py runserver`

# Creating a Superuser and Accessing Admin site

1. Open the command terminal and go to the `/main/backend/` directory

1. Run the below commands and type in the credentials for new superuser:
```
> python manage.py createsuperuser
Username: <username for superuser>
Email: <email for superuser>
Password: <password>
Password (again): <password>
Superuser created successfully.
```
3. Run the below commands to start the backend API and admin server:
```
> python manage.py runserver
```
4. Open `http://localhost:8000/admin/` in a new browser tab to access the admin site
