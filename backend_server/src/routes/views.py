import os
import base64
from src import oauth, config
from flask import url_for, redirect, Blueprint, render_template, session, request, jsonify, send_from_directory, make_response
from itsdangerous.url_safe import URLSafeTimedSerializer

main = Blueprint('main', __name__, static_folder=config.FRONTEND_STATIC_FILES)

@main.route('/verify')
def verify():
    oauth.tippers_app.token = session.get('token')
    if oauth.tippers_app.token:
        verify_request = oauth.tippers_app.get('verify')
        if verify_request.status_code == 200:
            resp = make_response(verify_request.json())
            resp.set_cookie('access_token', oauth.tippers_app.token['access_token'])
            return resp
        else:
            return jsonify({'success': False, 'error': 'Expired access token or issue with Oauth server.'}), 401
    return jsonify({'success': False, 'error': 'Not logged in.'}), 401

@main.route('/login')
def login():
    redirect_uri = url_for('main.authorize', _external=True)
    serializer = URLSafeTimedSerializer(config.SECRET_KEY, salt=config.SUFFIX)
    callback_state = request.args.get('callback')
    if callback_state:
        callback_state = serializer.dumps(base64.b64decode(callback_state).decode('utf-8'))
    return oauth.tippers_app.authorize_redirect(redirect_uri, state=callback_state)

@main.route('/signup')
def signup():
    redirect_uri = url_for('main.authorize', _external=True)
    serializer = URLSafeTimedSerializer(config.SECRET_KEY, salt=config.SUFFIX)
    callback_state = request.args.get('callback')
    if callback_state:
        callback_state = serializer.dumps(base64.b64decode(callback_state).decode('utf-8'))
    return oauth.tippers_app.authorize_redirect(redirect_uri, signup='true', state=callback_state)

@main.route('/logout')
def logout():
    session['token'] = None
    resp = make_response(redirect(config.FRONTEND_REDIRECT_URL))
    resp.set_cookie('access_token', '', expires=0)
    return resp

@main.route('/authorize')
def authorize():
    token = oauth.tippers_app.authorize_access_token()
    session['token'] = token
    serializer = URLSafeTimedSerializer(config.SECRET_KEY, salt=config.SUFFIX)
    state = request.args.get('state')
    sig_okay, path = serializer.loads_unsafe(state)
    if sig_okay:
        location = '{}{}'.format(config.FRONTEND_BASE_URL, path)
        resp = make_response(redirect(location))
    else:
        resp = make_response(redirect(config.FRONTEND_REDIRECT_URL))
    resp.set_cookie('access_token', token['access_token'])
    return resp

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    static_folder = main.static_folder + '/'
    build_folder = main.static_folder + '/../'
    if len(request.args) != 0 and not session.get('token'):
        callback_state = base64.b64encode(request.full_path.encode('utf-8')).decode('utf-8')
        return redirect(url_for('main.login', callback=callback_state))
    if path and os.path.exists(static_folder + path):
        return send_from_directory(static_folder, path)
    if path and os.path.exists(build_folder + path):
        return send_from_directory(build_folder, path)
    else:
        return send_from_directory(build_folder, 'index.html')