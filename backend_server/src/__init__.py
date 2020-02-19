import os
from flask import Flask, session
from authlib.integrations.flask_client import OAuth
from config import config as config_dict

oauth = OAuth()
# Change from 'development' to 'production' when deploying:
config_name = os.getenv('FLASK_CONFIG', 'development')
config = config_dict[config_name]

def create_app():
	app = Flask(__name__, static_folder=None)

	app.config.from_object(config)

	oauth.register(
		name=config.OAUTH_NAME,
		client_id=config.OAUTH_CLIENT_ID,
		client_secret=config.OAUTH_CLIENT_SECRET,
		access_token_url=config.OAUTH_ACCESS_TOKEN_URL,
		refresh_token_url=config.OAUTH_REFRESH_TOKEN_URL,
		authorize_url=config.OAUTH_AUTHORIZE_URL,
		api_base_url=config.OAUTH_API_BASE_URL
	)

	oauth.init_app(app)

	from src.routes.views import main as main_blueprint
	app.register_blueprint(main_blueprint)

	return app
