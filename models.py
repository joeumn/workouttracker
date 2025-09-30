from database import db
from datetime import datetime
from enum import Enum

class PostType(Enum):
    PR = "pr"
    STREAK = "streak"
    CHECKIN = "checkin"

class ReactionType(Enum):
    LIKE = "like"
    LOVE = "love"
    FIRE = "fire"
    STRONG = "strong"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    posts = db.relationship('SocialPost', backref='author', lazy=True, cascade='all, delete-orphan')
    reactions = db.relationship('Reaction', backref='user', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy=True, cascade='all, delete-orphan')
    
    # Following relationships
    following = db.relationship(
        'Follow', foreign_keys='Follow.follower_id',
        backref='follower', lazy='dynamic', cascade='all, delete-orphan'
    )
    followers = db.relationship(
        'Follow', foreign_keys='Follow.followed_id',
        backref='followed', lazy='dynamic', cascade='all, delete-orphan'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'followers_count': self.followers.count(),
            'following_count': self.following.count()
        }

class SocialPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_type = db.Column(db.Enum(PostType), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    workout_data = db.Column(db.JSON)  # Store workout-specific data like sets, reps, weight
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    reactions = db.relationship('Reaction', backref='post', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_reactions=True):
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'author': self.author.to_dict() if self.author else None,
            'post_type': self.post_type.value,
            'title': self.title,
            'content': self.content,
            'workout_data': self.workout_data,
            'created_at': self.created_at.isoformat(),
            'comments_count': len(self.comments),
            'reactions_count': len(self.reactions)
        }
        
        if include_reactions:
            # Group reactions by type for inline display
            reactions_summary = {}
            for reaction in self.reactions:
                reaction_type = reaction.reaction_type.value
                if reaction_type not in reactions_summary:
                    reactions_summary[reaction_type] = {
                        'count': 0,
                        'users': []
                    }
                reactions_summary[reaction_type]['count'] += 1
                reactions_summary[reaction_type]['users'].append(reaction.user.username)
            
            result['reactions'] = reactions_summary
            result['comments'] = [comment.to_dict() for comment in self.comments]
        
        return result

class Reaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('social_post.id'), nullable=False)
    reaction_type = db.Column(db.Enum(ReactionType), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure a user can only have one reaction per post
    __table_args__ = (db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_reaction'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None,
            'post_id': self.post_id,
            'reaction_type': self.reaction_type.value,
            'created_at': self.created_at.isoformat()
        }

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('social_post.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'author': self.author.to_dict() if self.author else None,
            'post_id': self.post_id,
            'content': self.content,
            'created_at': self.created_at.isoformat()
        }

class Follow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure a user can't follow the same person twice
    __table_args__ = (db.UniqueConstraint('follower_id', 'followed_id', name='unique_follow'),)

    def to_dict(self):
        return {
            'id': self.id,
            'follower_id': self.follower_id,
            'followed_id': self.followed_id,
            'follower': self.follower.to_dict() if self.follower else None,
            'followed': self.followed.to_dict() if self.followed else None,
            'created_at': self.created_at.isoformat()
        }