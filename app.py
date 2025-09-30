from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
from sqlalchemy import and_, or_, not_
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///workouttracker.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

db = SQLAlchemy(app)

class Gender(Enum):
    MALE = 'male'
    FEMALE = 'female'
    OTHER = 'other'

class GenderPreference(Enum):
    MALE = 'male'
    FEMALE = 'female'
    OTHER = 'other'
    NO_PREFERENCE = 'no_preference'

class ConnectionStatus(Enum):
    PENDING = 'pending'
    MUTUAL = 'mutual'
    BLOCKED = 'blocked'

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    gender = db.Column(db.Enum(Gender), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    buddy_preference = db.relationship('BuddyPreference', backref='user', uselist=False, cascade='all, delete-orphan')
    sent_connections = db.relationship('BuddyConnection', foreign_keys='BuddyConnection.from_user_id', backref='from_user', cascade='all, delete-orphan')
    received_connections = db.relationship('BuddyConnection', foreign_keys='BuddyConnection.to_user_id', backref='to_user', cascade='all, delete-orphan')

class BuddyPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    gender_preference = db.Column(db.Enum(GenderPreference), nullable=False, default=GenderPreference.NO_PREFERENCE)
    min_age = db.Column(db.Integer, default=18)
    max_age = db.Column(db.Integer, default=65)
    workout_types = db.Column(db.Text)  # JSON string of workout types
    availability_days = db.Column(db.Text)  # JSON string of available days
    fitness_level = db.Column(db.String(20))  # beginner, intermediate, advanced
    goals = db.Column(db.Text)  # JSON string of fitness goals
    gym_location = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BuddyConnection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.Enum(ConnectionStatus), nullable=False, default=ConnectionStatus.PENDING)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('from_user_id', 'to_user_id', name='unique_connection'),)

class BlockedUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blocker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blocked_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reason = db.Column(db.String(500))  # Optional reason for blocking/reporting
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    blocker = db.relationship('User', foreign_keys=[blocker_id], backref='blocked_users')
    blocked = db.relationship('User', foreign_keys=[blocked_id], backref='blocked_by_users')
    
    __table_args__ = (db.UniqueConstraint('blocker_id', 'blocked_id', name='unique_block'),)

# API Routes
import json

def calculate_compatibility_score(user1, user2) -> float:
    """Calculate compatibility score between two users (0.0 to 1.0)."""
    if not user1.buddy_preference or not user2.buddy_preference:
        return 0.0
    
    score = 0.0
    total_factors = 0
    
    pref1 = user1.buddy_preference
    pref2 = user2.buddy_preference
    
    # Gender preference compatibility (weight: 0.3)
    user1_match = (pref1.gender_preference == GenderPreference.NO_PREFERENCE or 
                  pref1.gender_preference.value == user2.gender.value)
    user2_match = (pref2.gender_preference == GenderPreference.NO_PREFERENCE or 
                  pref2.gender_preference.value == user1.gender.value)
    
    if user1_match and user2_match:
        gender_score = 1.0
    elif user1_match or user2_match:
        gender_score = 0.5
    else:
        gender_score = 0.0
    
    score += gender_score * 0.3
    total_factors += 0.3
    
    # Age compatibility (weight: 0.2)
    user1_in_range = pref2.min_age <= user1.age <= pref2.max_age
    user2_in_range = pref1.min_age <= user2.age <= pref1.max_age
    
    if user1_in_range and user2_in_range:
        age_score = 1.0
    elif user1_in_range or user2_in_range:
        age_score = 0.5
    else:
        age_score = 0.0
    
    score += age_score * 0.2
    total_factors += 0.2
    
    # Workout types compatibility (weight: 0.25)
    try:
        workouts1 = set(json.loads(pref1.workout_types or '[]'))
        workouts2 = set(json.loads(pref2.workout_types or '[]'))
        
        if not workouts1 or not workouts2:
            workout_score = 0.5
        else:
            intersection = workouts1.intersection(workouts2)
            union = workouts1.union(workouts2)
            workout_score = len(intersection) / len(union) if union else 0.0
    except (json.JSONDecodeError, TypeError):
        workout_score = 0.5
    
    score += workout_score * 0.25
    total_factors += 0.25
    
    # Availability compatibility (weight: 0.15)
    try:
        days1 = set(json.loads(pref1.availability_days or '[]'))
        days2 = set(json.loads(pref2.availability_days or '[]'))
        
        if not days1 or not days2:
            availability_score = 0.5
        else:
            intersection = days1.intersection(days2)
            availability_score = len(intersection) / max(len(days1), len(days2)) if (days1 or days2) else 0.0
    except (json.JSONDecodeError, TypeError):
        availability_score = 0.5
    
    score += availability_score * 0.15
    total_factors += 0.15
    
    # Fitness level compatibility (weight: 0.1)
    if not pref1.fitness_level or not pref2.fitness_level:
        fitness_score = 0.5
    else:
        levels = {'beginner': 1, 'intermediate': 2, 'advanced': 3}
        level1 = levels.get(pref1.fitness_level.lower(), 2)
        level2 = levels.get(pref2.fitness_level.lower(), 2)
        
        diff = abs(level1 - level2)
        if diff == 0:
            fitness_score = 1.0
        elif diff == 1:
            fitness_score = 0.7
        else:
            fitness_score = 0.3
    
    score += fitness_score * 0.1
    total_factors += 0.1
    
    return score / total_factors if total_factors > 0 else 0.0

@app.route('/api/discover', methods=['GET'])
def discover_buddies():
    """Find potential gym buddies with compatibility scores."""
    user_id = request.args.get('user_id', type=int)
    limit = request.args.get('limit', 20, type=int)
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    try:
        user = User.query.get(user_id)
        if not user or not user.buddy_preference:
            return jsonify({'success': True, 'matches': [], 'count': 0})
        
        # Get blocked users
        blocked_user_ids = [b.blocked_id for b in BlockedUser.query.filter_by(blocker_id=user_id).all()]
        blocked_by_user_ids = [b.blocker_id for b in BlockedUser.query.filter_by(blocked_id=user_id).all()]
        
        # Get existing connections
        existing_connections = BuddyConnection.query.filter(
            or_(BuddyConnection.from_user_id == user_id, BuddyConnection.to_user_id == user_id)
        ).all()
        existing_connection_ids = []
        for conn in existing_connections:
            if conn.from_user_id == user_id:
                existing_connection_ids.append(conn.to_user_id)
            else:
                existing_connection_ids.append(conn.from_user_id)
        
        # Find potential matches
        potential_matches = User.query.join(BuddyPreference).filter(
            User.id != user_id,
            ~User.id.in_(blocked_user_ids + blocked_by_user_ids + existing_connection_ids)
        ).all()
        
        # Calculate compatibility scores
        scored_matches = []
        for match in potential_matches:
            score = calculate_compatibility_score(user, match)
            if score > 0.1:  # Only include matches with some compatibility
                scored_matches.append({
                    'user_id': match.id,
                    'username': match.username,
                    'age': match.age,
                    'gender': match.gender.value,
                    'compatibility_score': round(score, 2),
                    'fitness_level': match.buddy_preference.fitness_level,
                    'gym_location': match.buddy_preference.gym_location,
                    'workout_types': json.loads(match.buddy_preference.workout_types or '[]')
                })
        
        # Sort by compatibility score and return top matches
        scored_matches.sort(key=lambda x: x['compatibility_score'], reverse=True)
        
        return jsonify({
            'success': True,
            'matches': scored_matches[:limit],
            'count': len(scored_matches[:limit])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/like', methods=['POST'])
def send_like():
    """Send a like to another user."""
    data = request.get_json()
    from_user_id = data.get('from_user_id')
    to_user_id = data.get('to_user_id')
    
    if not from_user_id or not to_user_id:
        return jsonify({'error': 'from_user_id and to_user_id are required'}), 400
    
    if from_user_id == to_user_id:
        return jsonify({'error': 'Cannot like yourself'}), 400
    
    try:
        # Check if already connected or liked
        existing = BuddyConnection.query.filter_by(
            from_user_id=from_user_id, 
            to_user_id=to_user_id
        ).first()
        
        if existing:
            return jsonify({'error': 'Already sent like to this user'}), 400
        
        # Check if the other user already liked this user (mutual like)
        reverse_like = BuddyConnection.query.filter_by(
            from_user_id=to_user_id, 
            to_user_id=from_user_id
        ).first()
        
        # Create the like connection
        connection = BuddyConnection(
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            status=ConnectionStatus.PENDING
        )
        db.session.add(connection)
        
        is_mutual = False
        if reverse_like:
            # Mark both connections as mutual
            reverse_like.status = ConnectionStatus.MUTUAL
            connection.status = ConnectionStatus.MUTUAL
            is_mutual = True
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'mutual': is_mutual,
            'message': 'Mutual connection established!' if is_mutual else 'Like sent successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/connections', methods=['GET'])
def get_connections():
    """Get user's connections."""
    user_id = request.args.get('user_id', type=int)
    status = request.args.get('status', 'mutual')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    try:
        if status == 'mutual':
            connections = BuddyConnection.query.filter(
                or_(
                    and_(BuddyConnection.from_user_id == user_id, BuddyConnection.status == ConnectionStatus.MUTUAL),
                    and_(BuddyConnection.to_user_id == user_id, BuddyConnection.status == ConnectionStatus.MUTUAL)
                )
            ).all()
        else:
            connections = BuddyConnection.query.filter_by(
                from_user_id=user_id,
                status=getattr(ConnectionStatus, status.upper())
            ).all()
        
        result = []
        seen_users = set()
        
        for conn in connections:
            # Get the other user in the connection
            other_user_id = conn.to_user_id if conn.from_user_id == user_id else conn.from_user_id
            
            # Avoid duplicates for mutual connections
            if other_user_id in seen_users:
                continue
            seen_users.add(other_user_id)
            
            other_user = User.query.get(other_user_id)
            
            if other_user:
                result.append({
                    'connection_id': conn.id,
                    'user_id': other_user.id,
                    'username': other_user.username,
                    'age': other_user.age,
                    'gender': other_user.gender.value,
                    'status': conn.status.value,
                    'connected_at': conn.created_at.isoformat(),
                    'fitness_level': other_user.buddy_preference.fitness_level if other_user.buddy_preference else None,
                    'gym_location': other_user.buddy_preference.gym_location if other_user.buddy_preference else None
                })
        
        return jsonify({
            'success': True,
            'connections': result,
            'count': len(result)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/block', methods=['POST'])
def block_user():
    """Block/report a user."""
    data = request.get_json()
    blocker_id = data.get('blocker_id')
    blocked_id = data.get('blocked_id')
    reason = data.get('reason')
    
    if not blocker_id or not blocked_id:
        return jsonify({'error': 'blocker_id and blocked_id are required'}), 400
    
    if blocker_id == blocked_id:
        return jsonify({'error': 'Cannot block yourself'}), 400
    
    try:
        # Check if already blocked
        existing_block = BlockedUser.query.filter_by(
            blocker_id=blocker_id,
            blocked_id=blocked_id
        ).first()
        
        if existing_block:
            return jsonify({'error': 'User already blocked'}), 400
        
        # Create block record
        block = BlockedUser(
            blocker_id=blocker_id,
            blocked_id=blocked_id,
            reason=reason
        )
        db.session.add(block)
        
        # Remove any existing connections
        BuddyConnection.query.filter(
            or_(
                and_(BuddyConnection.from_user_id == blocker_id, BuddyConnection.to_user_id == blocked_id),
                and_(BuddyConnection.from_user_id == blocked_id, BuddyConnection.to_user_id == blocker_id)
            )
        ).delete()
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'User blocked successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/preferences', methods=['GET', 'POST'])
def handle_preferences():
    """Get or update buddy preferences."""
    if request.method == 'GET':
        user_id = request.args.get('user_id', type=int)
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.buddy_preference:
            return jsonify({'preferences': None})
        
        pref = user.buddy_preference
        return jsonify({
            'preferences': {
                'gender_preference': pref.gender_preference.value,
                'min_age': pref.min_age,
                'max_age': pref.max_age,
                'workout_types': json.loads(pref.workout_types or '[]'),
                'availability_days': json.loads(pref.availability_days or '[]'),
                'fitness_level': pref.fitness_level,
                'goals': json.loads(pref.goals or '[]'),
                'gym_location': pref.gym_location
            }
        })
    
    elif request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update or create buddy preference
        pref = user.buddy_preference
        if not pref:
            pref = BuddyPreference(user_id=user_id)
            db.session.add(pref)
        
        # Update fields if provided
        if 'gender_preference' in data:
            pref.gender_preference = GenderPreference(data['gender_preference'])
        if 'min_age' in data:
            pref.min_age = data['min_age']
        if 'max_age' in data:
            pref.max_age = data['max_age']
        if 'workout_types' in data:
            pref.workout_types = json.dumps(data['workout_types'])
        if 'availability_days' in data:
            pref.availability_days = json.dumps(data['availability_days'])
        if 'fitness_level' in data:
            pref.fitness_level = data['fitness_level']
        if 'goals' in data:
            pref.goals = json.dumps(data['goals'])
        if 'gym_location' in data:
            pref.gym_location = data['gym_location']
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Preferences updated successfully'})

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user (for testing purposes)."""
    data = request.get_json()
    
    required_fields = ['username', 'email', 'gender', 'age']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        user = User(
            username=data['username'],
            email=data['email'],
            gender=Gender(data['gender']),
            age=data['age']
        )
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'user_id': user.id,
            'message': 'User created successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user information."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'gender': user.gender.value,
        'age': user.age,
        'created_at': user.created_at.isoformat()
    })

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'message': 'Workout Tracker Buddy Matching API is running',
        'endpoints': {
            'discover': 'GET /api/discover?user_id=1&limit=20',
            'like': 'POST /api/like',
            'connections': 'GET /api/connections?user_id=1&status=mutual',
            'block': 'POST /api/block',
            'preferences': 'GET/POST /api/preferences',
            'users': 'POST /api/users'
        }
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)