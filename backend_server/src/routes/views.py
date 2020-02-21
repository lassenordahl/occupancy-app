import os
from src import oauth, config
from flask import url_for, redirect, Blueprint, render_template, session, request, jsonify, send_from_directory

main = Blueprint('main', __name__, static_folder=config.FRONTEND_STATIC_FILES)

# @main.route('/')
# def index():
#     logged_in = False
#     if session.get('token'):
#         logged_in = True
#     return render_template('index.html', logged_in=logged_in)

@main.route('/verify')
def verify():
    oauth.tippers_app.token = session.get('token')
    if oauth.tippers_app.token:
        verify_request = oauth.tippers_app.get('verify')
        if verify_request.status_code == 200:
            return verify_request.json()
        else:
            return jsonify({'success': False, 'error': 'Expired access token or issue with Oauth server.'}), 401
    return jsonify({'success': False, 'error': 'Not logged in.'}), 401

@main.route('/login')
def login():
    redirect_uri = url_for('main.authorize', _external=True)
    return oauth.tippers_app.authorize_redirect(redirect_uri)

@main.route('/signup')
def signup():
    redirect_uri = url_for('main.authorize', _external=True)
    return oauth.tippers_app.authorize_redirect(redirect_uri, signup='true')

@main.route('/logout')
def logout():
    session['token'] = None
    return redirect(config.FRONTEND_REDIRECT_URL)

@main.route('/authorize')
def authorize():
    token = oauth.tippers_app.authorize_access_token()
    session['token'] = token
    return redirect(config.FRONTEND_REDIRECT_URL)

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    static_folder = main.static_folder + '/'
    build_folder = main.static_folder + '/../'
    if path and os.path.exists(static_folder + path):
        return send_from_directory(static_folder, path)
    if path and os.path.exists(build_folder + path):
        return send_from_directory(build_folder, path)
    else:
        return send_from_directory(build_folder, 'index.html')