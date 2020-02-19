# TIPPERS Template Backend

## Getting Started

1. After cloning this repo. Create a Python 3.7 virtual environment in the same directory using the following command: `python3 -m venv env`
2. Activate the environment using `source env/bin/activate`
3. Install dependencies into the virtual environment using `pip3 install -r requirements.txt`
4. Run the following commands to start the Flask server: `export FLASK_APP=app.py` and then `flask run`
5. Navigate to `http://127.0.0.1:5000` in your browser

## How it works

* This template backend uses the Authlib library to make calls to the TIPPERS Oauth server
* It stores the Oauth access token in a signed session cookie (see `src/routes/view.py`)

## How to use it

* In `config.py`
    * `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`
        * Enter your apps TIPPERS Oauth credentials
    * `FRONTEND_REDIRECT_URL`
        * Enter where you want this backend to redirect after authenticating (most likely your homepage)
* Make sure to set your TIPPERS OAuth app Default Redirect Uri to `http://127.0.0.1:5000/authorize` (in the TIPPERS Oauth portal)
* Have your frontend React app redirect the user to this backend's `/login`. After the user successfully logs in, they will be redirected to the `FRONTEND_REDIRECT_URL` and a signed session cookie will be saved in their browser
* Your frontend React app then can confirm that they are logged in by hitting this backend's `/verify`