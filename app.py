from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, date
from sqlalchemy import desc
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workouttracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class ContentItem(db.Model):
    """Model for content items like playlists and videos"""
    __tablename__ = 'content_items'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    content_type = db.Column(db.String(50), nullable=False)  # 'playlist' or 'video'
    platform = db.Column(db.String(50), nullable=False)  # 'spotify', 'youtube'
    url = db.Column(db.String(500), nullable=False)
    thumbnail_url = db.Column(db.String(500))
    duration = db.Column(db.String(20))  # For videos, can be null for playlists
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'content_type': self.content_type,
            'platform': self.platform,
            'url': self.url,
            'thumbnail_url': self.thumbnail_url,
            'duration': self.duration,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active
        }

class DailyPack(db.Model):
    """Model for daily motivation packs"""
    __tablename__ = 'daily_packs'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, unique=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    theme = db.Column(db.String(100))  # e.g., "High Energy", "Chill Vibes", "Focus"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship to content items in this pack
    content_items = db.relationship('DailyPackContent', back_populates='daily_pack', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'title': self.title,
            'description': self.description,
            'theme': self.theme,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active,
            'content_items': [item.to_dict() for item in self.content_items]
        }

class DailyPackContent(db.Model):
    """Junction table for daily packs and content items"""
    __tablename__ = 'daily_pack_content'
    
    id = db.Column(db.Integer, primary_key=True)
    daily_pack_id = db.Column(db.Integer, db.ForeignKey('daily_packs.id'), nullable=False)
    content_item_id = db.Column(db.Integer, db.ForeignKey('content_items.id'), nullable=False)
    order_index = db.Column(db.Integer, default=0)  # For ordering items in the pack
    
    # Relationships
    daily_pack = db.relationship('DailyPack', back_populates='content_items')
    content_item = db.relationship('ContentItem')
    
    def to_dict(self):
        return {
            'id': self.id,
            'daily_pack_id': self.daily_pack_id,
            'content_item_id': self.content_item_id,
            'order_index': self.order_index,
            'content_item': self.content_item.to_dict() if self.content_item else None
        }

# Create tables
with app.app_context():
    db.create_all()

# Routes

# Content API Routes
@app.route('/api/content', methods=['GET'])
def get_all_content():
    """Get all content items with optional filtering"""
    try:
        # Get query parameters
        content_type = request.args.get('type')  # 'playlist' or 'video'
        platform = request.args.get('platform')  # 'spotify' or 'youtube'
        active_only = request.args.get('active', 'true').lower() == 'true'
        
        # Build query
        query = ContentItem.query
        
        if content_type:
            query = query.filter(ContentItem.content_type == content_type)
        if platform:
            query = query.filter(ContentItem.platform == platform)
        if active_only:
            query = query.filter(ContentItem.is_active == True)
            
        # Order by most recent first
        content_items = query.order_by(desc(ContentItem.created_at)).all()
        
        return jsonify({
            'success': True,
            'data': [item.to_dict() for item in content_items],
            'count': len(content_items)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/content', methods=['POST'])
def create_content():
    """Create a new content item"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'content_type', 'platform', 'url']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # Validate content_type and platform
        if data['content_type'] not in ['playlist', 'video']:
            return jsonify({'success': False, 'error': 'content_type must be "playlist" or "video"'}), 400
        if data['platform'] not in ['spotify', 'youtube']:
            return jsonify({'success': False, 'error': 'platform must be "spotify" or "youtube"'}), 400
        
        # Create new content item
        content_item = ContentItem(
            title=data['title'],
            description=data.get('description'),
            content_type=data['content_type'],
            platform=data['platform'],
            url=data['url'],
            thumbnail_url=data.get('thumbnail_url'),
            duration=data.get('duration'),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(content_item)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': content_item.to_dict(),
            'message': 'Content item created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Daily Pack API Routes
@app.route('/api/motivation/daily-pack', methods=['GET'])
def get_daily_pack():
    """Get today's daily pack or a specific date's pack"""
    try:
        # Get date parameter, default to today
        date_str = request.args.get('date')
        if date_str:
            try:
                pack_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'success': False, 'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        else:
            pack_date = date.today()
        
        # Find the daily pack for the specified date
        daily_pack = DailyPack.query.filter(
            DailyPack.date == pack_date,
            DailyPack.is_active == True
        ).first()
        
        if not daily_pack:
            return jsonify({
                'success': True,
                'data': None,
                'message': f'No daily pack found for {pack_date}'
            })
        
        return jsonify({
            'success': True,
            'data': daily_pack.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/motivation/daily-pack', methods=['POST'])
def create_daily_pack():
    """Create a new daily pack"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['date', 'title']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # Parse date
        try:
            pack_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'success': False, 'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Check if pack already exists for this date
        existing_pack = DailyPack.query.filter(DailyPack.date == pack_date).first()
        if existing_pack:
            return jsonify({'success': False, 'error': f'Daily pack already exists for {pack_date}'}), 400
        
        # Create new daily pack
        daily_pack = DailyPack(
            date=pack_date,
            title=data['title'],
            description=data.get('description'),
            theme=data.get('theme'),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(daily_pack)
        db.session.flush()  # Get the ID
        
        # Add content items if provided
        content_item_ids = data.get('content_item_ids', [])
        for i, content_id in enumerate(content_item_ids):
            content_item = ContentItem.query.get(content_id)
            if content_item:
                pack_content = DailyPackContent(
                    daily_pack_id=daily_pack.id,
                    content_item_id=content_id,
                    order_index=i
                )
                db.session.add(pack_content)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': daily_pack.to_dict(),
            'message': 'Daily pack created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Dashboard route
@app.route('/')
def dashboard():
    """Render the dashboard with vibes panel"""
    return render_template('dashboard.html')

@app.route('/dashboard')
def dashboard_redirect():
    """Redirect to main dashboard"""
    return dashboard()

# Health check
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)