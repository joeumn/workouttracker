from app import db
from datetime import datetime

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

# Import routes after models are defined
from routes import *