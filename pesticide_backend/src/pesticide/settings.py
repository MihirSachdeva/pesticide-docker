import os
import yaml

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_CONFIG_FILE = open(os.path.join(
    BASE_DIR,
    'config/base.yml'
))
BASE_CONFIGURATION = yaml.load(BASE_CONFIG_FILE, Loader=yaml.FullLoader)
SECRET_KEY = BASE_CONFIGURATION["keys"]["secret_key"]
DEBUG = True
ALLOWED_HOSTS = ['*']
PAGE_SIZE = BASE_CONFIGURATION["pagination"]["page_size"]
FRONTEND_URL = BASE_CONFIGURATION["frontend"]["url"]

# Application definition

INSTALLED_APPS = [
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'djrichtextfield',
    'pesticide_app',
]

AUTH_USER_MODEL = 'pesticide_app.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pesticide.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pesticide.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': BASE_CONFIGURATION["services"]["database"]["name"],
        'USER': BASE_CONFIGURATION["services"]["database"]["user"],
        'PASSWORD': BASE_CONFIGURATION["services"]["database"]["password"],
        'HOST': BASE_CONFIGURATION["services"]["database"]["host"],
        'PORT': BASE_CONFIGURATION["services"]["database"]["port"],
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = BASE_CONFIGURATION["i18n"]["language_code"]
TIME_ZONE = BASE_CONFIGURATION["i18n"]["timezone"]
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'

ASGI_APPLICATION = 'pesticide.routing.application'

# Channel layers (redis) for real time comments
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [(BASE_CONFIGURATION["services"]["channel_layer"]["host"], BASE_CONFIGURATION["services"]["channel_layer"]["port"])],
        },
    },
}

# Email service

EMAIL_HOST = BASE_CONFIGURATION["services"]["email"]["email_host"]
EMAIL_USE_TLS = BASE_CONFIGURATION["services"]["email"]["email_use_tls"]
EMAIL_PORT = BASE_CONFIGURATION["services"]["email"]["email_port"]
EMAIL_HOST_USER = BASE_CONFIGURATION["services"]["email"]["email_host_user"]
EMAIL_HOST_PASSWORD = BASE_CONFIGURATION["services"]["email"]["email_host_password"]

REST_AUTH_SERIALIZERS = {
    'TOKEN_SERIALIZER': 'pesticide_app.api.serializers.TokenSerializer',
}

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

OAUTH2_PROVIDER = {
    'SCOPES': {
        'read': 'Read scope',
        'write': 'Write scope',
        'groups': 'Access to your groups'
    }
}

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True
# CORS_ORIGIN_WHITELIST = (
#     FRONTEND_URL,
#     'http://localhost'
# )
SITE_ID = 1

DJRICHTEXTFIELD_CONFIG = {
    'js': ['//tinymce.cachefly.net/4.1/tinymce.min.js'],
    'init_template': 'djrichtextfield/init/tinymce.js',
    'settings': {
        'menubar': False,
        'plugins': 'link image',
        'toolbar': 'bold italic | link image | removeformat',
        'width': 700
    }
}

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
