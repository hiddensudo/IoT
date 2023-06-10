import configparser

from flask import Flask, request, render_template, session, make_response
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = '6bef18936ac12a9096e9fe7a8fe1f777'
CORS(app)


@app.route('/save-config', methods=['POST'])
def save_config():
    address = request.json.get('address')
    user_id = request.json.get('user_id')

    if address and user_id:
        with open('config.ini', 'w') as f:
            f.write('[DEFAULT]\n')
            f.write(f'ADDRESS={address}\n')
            f.write(f'USER_ID={user_id}')

        return 'Config saved successfully!'
    else:
        return 'Invalid data'


@app.route('/')
def render_main():
    config = configparser.ConfigParser()
    config.read('config.ini')
    user_id = config.get('DEFAULT', 'USER_ID')

    # Збереження значення user_id у сесії
    session['user_id'] = user_id
    return render_template('index.html')


@app.route('/get_user_id')
def get_user_id():
    # Отримання значення user_id з сесії
    user_id = session.get('user_id', '')
    # Повернення значення user_id як текстової відповіді
    response = make_response(user_id)
    response.mimetype = 'text/plain'
    return response


@app.route('/sensors')
def render_sensors():
    return render_template('sensors.html')


if __name__ == '__main__':
    app.run(port=5001)
