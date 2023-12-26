import logging
import re
import os
from bleach import clean
from flask import Flask, abort, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import current_user  # Import current_user
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template
from flask import request, jsonify
from werkzeug.utils import secure_filename
from flask_wtf.csrf import CSRFProtect
from datetime import datetime, timedelta

LOGIN_ATTEMPTS = {}
MAX_ATTEMPTS = 5
BLOCK_TIME = timedelta(minutes=1)
app = Flask(__name__)
class ColoredFormatter(logging.Formatter):
    COLORS = {
        logging.INFO: "\033[0;36m",  # Cyan for INFO messages
        logging.WARNING: "\033[0;33m",  # Yellow for WARNING
        logging.ERROR: "\033[0;31m",  # Red for ERROR
        logging.DEBUG: "\033[0;34m",  # Blue for DEBUG
        logging.CRITICAL: "\033[0;35m"  # Magenta for CRITICAL
    }

    def format(self, record):
        color = self.COLORS.get(record.levelno)
        message = logging.Formatter.format(self, record)
        if color:
            message = color + message + "\033[0m"  # Reset to default color at the end
        return message

app.secret_key = 'your_secret_key'  # Replace with your secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

login_manager = LoginManager()
login_manager.init_app(app)


# Define the is_safe_url function
def is_safe_url(url):
    safe_domains = ['google.com', 'github.com','stackoverflow.com','wikipedia.org','reddit.com']
    return any(url.startswith(f"https://{domain}") for domain in safe_domains)
UPLOAD_FOLDER = "C:\\Users\\Student\\Desktop\\webapp\\files\\"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'pdf', 'json', 'xml'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_malicious_ips():
    with open('malicious_ips.txt', 'r') as file:
        return [line.strip() for line in file]

MALICIOUS_IPS = load_malicious_ips()
handler = logging.StreamHandler()
handler.setFormatter(ColoredFormatter("%(levelname)s: %(message)s"))

logging.basicConfig(level=logging.ERROR, handlers=[handler])

@app.before_request
def block_malicious_ips():
    client_ip = request.remote_addr
    if client_ip in MALICIOUS_IPS:
        logging.error(f"Blocked malicious IP: {client_ip}")
        abort(403)  # Forbidden access




@app.before_request
def waf_middleware():
    if request.path == url_for('upload_file')and request.method == 'POST':
        return
    query_string = request.query_string.decode()
    sanitized_query_string = clean(query_string, strip=True)
    

    request_data = request.get_data(as_text=True)
    sanitized_request_data = clean(request_data, strip=True)


    sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', '--',]
    pattern = re.compile('|'.join(sql_keywords), re.IGNORECASE)

    if pattern.search(sanitized_query_string) or pattern.search(sanitized_request_data):
        logging.error(" SQL Injection Attack Detected")
        abort(403, 'SQL Injection Attack Detected')
        return redirect(url_for('sql_injection_detected'))
        # Or, render a template directly
        # return render_template('error.html', error_message='SQL Injection Attack Detected')



users = {}

class User(UserMixin):
    def __init__(self, id):
        self.id = id

csrf = CSRFProtect(app)

@app.route('/submit_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return "No file selected", 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        flash('File successfully uploaded')
        return "File uploaded successfully", 200
    else:
        logging.error("Local file intrusion detected!")
        return "Local file intrusion detected!", 400

@login_manager.user_loader
def load_user(user_id):
    if user_id in users:
        return User(user_id)
    
@app.route('/')
def index():
     return render_template('index.html')

@app.route('/submit_comment', methods= ["POST"])
def submit_comment():
    data = request.form["comment"]
    if ("<script>" in data and "</script>" in data):
        logging.error(f"XSS INTRUSION DEDECTED")
        return "XSS INTRUSION DEDECTED"
    return render_template('login.html')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         data = request.get_json()
#         if not data:
#             return 'No data provided', 400
        
#         email = data.get('email')
#         password = data.get('password')

#         if not email or not password:
#             return 'Missing email or password', 400

#         user = User.query.filter_by(email=email).first()
#         if user and user.check_password(password):
#             login_user(user)
#             return redirect(url_for('protected'))
#         else:
#             return 'Invalid username or password', 401

#     return render_template('Login.html')
@app.route('/login', methods=['GET', 'POST'])
def login():
    ip = request.remote_addr
    now = datetime.now()

    if ip in LOGIN_ATTEMPTS and now < LOGIN_ATTEMPTS[ip]['block_until']:
        logging.error("Brute force attack detected")
        return "Brute force attack detected"
        

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if email in users and check_password_hash(users[email]['password'], password):
            user = User(email)
            LOGIN_ATTEMPTS.pop(ip, None)
            login_user(user)
            return redirect(url_for('protected'))
        else:
            attempts = LOGIN_ATTEMPTS.get(ip, {'count': 0, 'block_until': now})
            attempts['count'] += 1
            if attempts['count'] >= MAX_ATTEMPTS:
                attempts['block_until'] = now + BLOCK_TIME
                flash('Too many failed attempts. Please try again later.')
            LOGIN_ATTEMPTS[ip] = attempts
            logging.error("Brute force attack detected")
            flash('Invalid username or password')

    return render_template('login.html')

@app.route('/clear_attempts', methods=['GET'])
def clear_old_attempts():
    now = datetime.now()
    for ip in list(LOGIN_ATTEMPTS.keys()):
        if now >= LOGIN_ATTEMPTS[ip]['block_until']:
            del LOGIN_ATTEMPTS[ip]
    return render_template('login.html')


@app.route('/protected')
@login_required
def protected():
    return 'Logged in as: ' + current_user.get_id()

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if email in users:
            flash('Email address already exists')
        else:
            users[email] = {'password': generate_password_hash(password)}
            return redirect(url_for('login'))
    return render_template('signup.html')

#@app.route('/protected')
#@login_required
#def protected():
   # return 'Logged in as: ' + login_manager._current_user.get_id()

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))



# @app.route('/protected')
# @login_required
# def protected():
#     return 'Logged in as: ' + current_user.get_id()

# Example route that makes an external request
@app.route('/fetch-external-data')
def fetch_external_data():
    external_url = request.args.get('url')
    if not is_safe_url(external_url):
        return jsonify({'error': 'Unsafe URL detected'}), 400
    
    return jsonify({'message': 'Request processed'})  # Example response

if __name__ == '__main__':
    app.run(debug=True)
