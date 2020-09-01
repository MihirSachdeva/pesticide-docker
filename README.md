# Pesticide

## A clean and feature-rich project-management and bug-tracking app.

Backend written in [Django](https://www.djangoproject.com), with [DjangoREST](https://www.django-rest-framework.org) for APIs.

Frontend written in [React](https://reactjs.org/), with [Material-UI](https://material-ui.com/) and [Redux](https://react-redux.js.org/)

Made for [IMG IIT Roorkee](https://img.channeli.in) Developers' Summer Project of 2020.

## Make Pesticide Your Own!

### Clone this repository

Open your terminal in a folder of your choice (where you would want to store your repository.) For example, if you want to clone this project in the Home (~) directory, enter the following command:

```bash
user@system:~$ git clone https://github.com/MihirSachdeva/Pesticide.git
```

Then move to the newly formed directory called `Pesticide`

```base
user@system:~$ cd Pesticide
```

## Set Up The Codebase

## Configuration

The file [base_template.yml](pesticide_backend/src/config/base_template.yml) is the template file for all the required variables needed to run the Django backend. This includes fields such as language code and timezone of the app, secret key, client id and client secret given by Omniport OAuth Dashboard, email parameters, and database variables. More detail information of these keys have been given in a table below. The [settings.py](pesticide_backend/src/pesticide/settings.py) file will look for the values of these parameters in a file named `base.yml` in the [config](pesticide_backend/src/config/) directory.
Make a new file named `base.yml` in the same [config](pesticide_backend/src/config/) directory as [base_template.yml](pesticide_backend/src/config/base_template.yml) and then copy the contents of the file [base_template.yml](pesticide_backend/src/config/base_template.yml) into `base.yml`. Then fill all the fields in `base.yml` and hit save.

### **i18n**

| key           | meaning                                              |
| ------------- | ---------------------------------------------------- |
| language_code | Language code of the app, eg. `en-us`, `en-gb`, etc. |
| timezone      | Time zone of the app, eg. `Asia/Kolkata`, etc.       |

### **keys**

| key           | meaning                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------- |
| secret_key    | Secret key required in [settings.py](pesticide_backend/src/pesticide/settings.py) (50 characters) |
| client_id     | Client ID you obtained from the Omniport Channel i dashboard                                      |
| client_secret | Client secret key you obtained from Omniport Channel i dashboard                                  |
| redirect_uri  | One of the redirect URIs you have registered on the Omniport Channel i dashboard                  |
| desired_state | Any string that you want the `REDIRECT_URI` to receive on success                                 |

### services > **email**

| key                 | meaning                                                                              |
| ------------------- | ------------------------------------------------------------------------------------ |
| email_host          | Your emailing service host (like Google's `smtp.gmail.com`)                          |
| email_port          | Your emailing service port (like `587`)                                              |
| email_host_user     | Your emailing service email id                                                       |
| email_host_password | Your emailing service account password                                               |
| email_use_tls       | This tells Django what secure protocol should be used to connect to the email server |

### services > **database**

| key      | meaning                       |
| -------- | ----------------------------- |
| host     | Your database host            |
| port     | Your database port            |
| user     | Your database user's username |
| password | Your database user's password |
| name     | Database name                 |

### Set Up The Django Backend

#### Install [pipenv](https://realpython.com/pipenv-guide/)

Pipenv is a packaging tool for Python that solves some common problems associated with the typical workflow using pip, virtualenv/venv, and the good old requirements.txt. To install pipenv, enter the following in your terminal:

```bash
user@system:~/Pesticide$ pip3 install pipenv
```

#### Create a virtual environment and install all required Python packages

Using pipenv, start a virtual environment, and then install all required Python packages from [Pipfile](pesticide_backend/Pipfile):

```bash
user@system:~/Pesticide$ cd pesticide_backend
user@system:~/Pesticide/pesticide_backend$ pipenv shell
(pesticide_backend) user@system:~/Pesticide/pesticide_backend$ pipenv install
```

The `(pesticide_backend)` in the command line indicates that our virtual environment `pesticide_backend` is active. To deactivate it, simply type `exit` in the command line.

#### Set up the Django database

First set up your preferred database. In [settings.py](pesticide_backend/src/pesticide/settings.py), MySQL database has been set up. All required parameters like host, port, user, database and password will be taken from base.yml. After that, to set up the database on your local system:

```bash
(pesticide_backend) user@system:~/Pesticide/pesticide_backend$ cd src/
(pesticide_backend) user@system:~/Pesticide/pesticide_backend/src$ python3 manage.py makemigrations peticide_app
(pesticide_backend) user@system:~/Pesticide/pesticide_backend/src$ python3 manage.py migrate pesticide_app
(pesticide_backend) user@system:~/Pesticide/pesticide_backend/src$ python3 manage.py makemigrations
(pesticide_backend) user@system:~/Pesticide/pesticide_backend/src$ python3 manage.py migrate
```

#### Start a Redis server

We will use a channel layer that uses Redis as its backing store. You must have [Docker](https://docs.docker.com/engine/install/) installed in your system. To start a Redis server on port 6379, run the following command:

```bash
(pesticide_backend) user@system:~/Pesticide/pesticide_backend$ docker run -p 6379:6379 -d redis:5
```

### Set Up The React Frontend

#### Install all required npm packages:

```bash
user@system:~/Pesticide$ cd pesticide_frontend/src/
user@system:~/Pesticide/pesticide_frontend/src$ npm install --save
```

## Usage

### Start the Django Server:

```bash
(pesticide_backend) user@system:~/Pesticide/pesticide_backend/src$ python3 manage.py runserver
```

### Start the React Frontend Server:

```bash
user@system:~/Pesticide/pesticide_frontend$ npm start
```

Then head over to 127.0.0.1:3000 to start using the app!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
