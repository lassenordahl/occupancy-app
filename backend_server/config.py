import os
import random

TIPPERS_OAUTH_BASE_URL = 'https://auth-tippers.ics.uci.edu'

class DevConfig:
	# os.environ['AUTHLIB_INSECURE_TRANSPORT'] = '1'
	SECRET_KEY = 't$at6b*tdjaIyE%!13ohhf7@$2GVy04zRokJw7^@lak7&pReppR&WY'
	OAUTH_NAME = 'tippers_app'
	OAUTH_CLIENT_ID = 'eZ2crAqb2epX2vujf81lLDGCcLCUD64YoinZaYRVaAIJT0U1'
	OAUTH_CLIENT_SECRET = 'AnOEkokar9PGZ1VtUyzNfrtbc0XO17cucZhvKxGgtXZUtM7iquyUY3Ok9UeglcrAtQh52K0DXEw5no'
	OAUTH_ACCESS_TOKEN_URL = OAUTH_REFRESH_TOKEN_URL = TIPPERS_OAUTH_BASE_URL+'/oauth2/token'
	OAUTH_AUTHORIZE_URL = TIPPERS_OAUTH_BASE_URL+'/oauth2/authorize'
	OAUTH_API_BASE_URL = TIPPERS_OAUTH_BASE_URL+'/api/2/'
	SUBDIR_APP_NAME = 'occupancy'
	FRONTEND_BASE_URL = 'https://dev-tippers.ics.uci.edu'
	FRONTEND_REDIRECT_URL = '{}/{}'.format(FRONTEND_BASE_URL, SUBDIR_APP_NAME)
	FRONTEND_STATIC_FILES = '../../../build/static'
	SUFFIX = 'dev_occupancy'
	SESSION_COOKIE_NAME = 'session{}'.format(SUFFIX)


class UCIConfig:
	SECRET_KEY = 'iYKmM2FO@pieEJn&GtgffhKrMc69u8fB7TTJW&bNAtous9k&PxIw4y'
	OAUTH_NAME = 'tippers_app'
	OAUTH_CLIENT_ID = '1N7op39i4saysy3ZQuuaBtejUwSbJL1XswEzVXvVfCuuttqp'
	OAUTH_CLIENT_SECRET = 'mawbekV3YIugN0utvc5CMap2Ip9X6GPtyr68s7VWwILiVaDmt0XWKyXsr56YYJvxNzzqyPxNBicQeM'
	OAUTH_ACCESS_TOKEN_URL = OAUTH_REFRESH_TOKEN_URL = TIPPERS_OAUTH_BASE_URL+'/oauth2/token'
	OAUTH_AUTHORIZE_URL = TIPPERS_OAUTH_BASE_URL+'/oauth2/authorize'
	OAUTH_API_BASE_URL = TIPPERS_OAUTH_BASE_URL+'/api/2/'
	SUBDIR_APP_NAME = 'occupancy'
	FRONTEND_REDIRECT_URL = 'https://uci-tippers.ics.uci.edu/'+SUBDIR_APP_NAME
	FRONTEND_STATIC_FILES = '../../../build/static'
	SUFFIX = 'uci_occupancy'
	SESSION_COOKIE_NAME = 'session{}'.format(SUFFIX)


class HomeConfig:
	SECRET_KEY = 'P1&0fw*osGs8ONB3Q$s3XZoTbM3sak2!H123bFaYX^i5^H%50*COc6'
	OAUTH_NAME = 'tippers_app'
	OAUTH_CLIENT_ID = 'z0qO6cktdpup4DK0Ujvc5lgFmjemxrmzwhgmHmp8jFphEE9K'
	OAUTH_CLIENT_SECRET = '2lgqljEKFgRqryr2fRaw8K0J8olIe2n81Ufxd4JmZLBAyx1maS0SA0rCy3sF3RLEpMlZTb4TOF7ggG'
	OAUTH_ACCESS_TOKEN_URL = OAUTH_REFRESH_TOKEN_URL = TIPPERS_OAUTH_BASE_URL+'/oauth2/token'
	OAUTH_AUTHORIZE_URL = TIPPERS_OAUTH_BASE_URL+'/oauth2/authorize'
	OAUTH_API_BASE_URL = TIPPERS_OAUTH_BASE_URL+'/api/2/'
	SUBDIR_APP_NAME = 'occupancy'
	FRONTEND_REDIRECT_URL = 'https://home-tippers.ics.uci.edu/'+SUBDIR_APP_NAME
	FRONTEND_STATIC_FILES = '../../../build/static'
	SUFFIX = 'home_occupancy'
	SESSION_COOKIE_NAME = 'session{}'.format(SUFFIX)


config = {
	'development': DevConfig,
	'uci': UCIConfig,
	'home': HomeConfig
}