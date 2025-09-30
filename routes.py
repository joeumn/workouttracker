from flask import request, jsonify, render_template
from app import app, db
from datetime import datetime, date
from sqlalchemy import desc

# Content API Routes

@app.route('/api/content', methods=['GET'])
def get_all_content():
    """Get all content items with optional filtering"""
    try:
        from models import ContentItem
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
        from models import ContentItem
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

@app.route('/api/content/<int:content_id>', methods=['GET'])
def get_content(content_id):
    """Get a specific content item"""
    try:
        from models import ContentItem
        content_item = ContentItem.query.get_or_404(content_id)
        return jsonify({
            'success': True,
            'data': content_item.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 404

@app.route('/api/content/<int:content_id>', methods=['PUT'])
def update_content(content_id):
    """Update a content item"""
    try:
        from models import ContentItem
        content_item = ContentItem.query.get_or_404(content_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            content_item.title = data['title']
        if 'description' in data:
            content_item.description = data['description']
        if 'content_type' in data:
            if data['content_type'] not in ['playlist', 'video']:
                return jsonify({'success': False, 'error': 'content_type must be "playlist" or "video"'}), 400
            content_item.content_type = data['content_type']
        if 'platform' in data:
            if data['platform'] not in ['spotify', 'youtube']:
                return jsonify({'success': False, 'error': 'platform must be "spotify" or "youtube"'}), 400
            content_item.platform = data['platform']
        if 'url' in data:
            content_item.url = data['url']
        if 'thumbnail_url' in data:
            content_item.thumbnail_url = data['thumbnail_url']
        if 'duration' in data:
            content_item.duration = data['duration']
        if 'is_active' in data:
            content_item.is_active = data['is_active']
        
        content_item.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': content_item.to_dict(),
            'message': 'Content item updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/content/<int:content_id>', methods=['DELETE'])
def delete_content(content_id):
    """Delete a content item"""
    try:
        from models import ContentItem
        content_item = ContentItem.query.get_or_404(content_id)
        db.session.delete(content_item)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Content item deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Daily Pack API Routes

@app.route('/api/motivation/daily-pack', methods=['GET'])
def get_daily_pack():
    """Get today's daily pack or a specific date's pack"""
    try:
        from models import DailyPack
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
        from models import DailyPack, DailyPackContent, ContentItem
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