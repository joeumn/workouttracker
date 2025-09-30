from flask import jsonify
from database import create_app, db
from models import User, SocialPost, Reaction, Comment, Follow
from routes import register_routes

app = create_app()

# Register routes
register_routes(app)

@app.route('/')
def home():
    return jsonify({"message": "Workout Tracker API", "version": "1.0"})

# Serve the frontend
@app.route('/demo')
def demo():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)