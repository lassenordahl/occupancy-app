import os
from src import create_app
from werkzeug.middleware.proxy_fix import ProxyFix

app = create_app()
app = ProxyFix(app)

if __name__ == '__main__':
	app.run()