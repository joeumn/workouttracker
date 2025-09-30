from flask import request, jsonify, current_app
from database import db
from models import User, SocialPost, Reaction, Comment, Follow, PostType, ReactionType
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc, or_

# Get the app from Flask's current_app context
def register_routes(app):
    
    # Helper function to get user by ID
    def get_user_or_404(user_id):
        user = User.query.get(user_id)
        if not user:
            return None
        return user

    # Helper function to get post by ID
    def get_post_or_404(post_id):
        post = SocialPost.query.get(post_id)
        if not post:
            return None
        return post

    # User routes
    @app.route('/users', methods=['POST'])
    def create_user():
        data = request.get_json()
        if not data or 'username' not in data or 'email' not in data:
            return jsonify({'error': 'Username and email are required'}), 400
        
        try:
            user = User(username=data['username'], email=data['email'])
            db.session.add(user)
            db.session.commit()
            return jsonify(user.to_dict()), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({'error': 'Username or email already exists'}), 400

    @app.route('/users/<int:user_id>', methods=['GET'])
    def get_user(user_id):
        user = get_user_or_404(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user.to_dict())

    @app.route('/users', methods=['GET'])
    def list_users():
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

    # Post routes
    @app.route('/posts', methods=['POST'])
    def create_post():
        data = request.get_json()
        required_fields = ['user_id', 'post_type', 'title']
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'user_id, post_type, and title are required'}), 400
        
        # Validate user exists
        user = get_user_or_404(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Validate post type
        try:
            post_type = PostType(data['post_type'])
        except ValueError:
            return jsonify({'error': f'Invalid post_type. Must be one of: {[t.value for t in PostType]}'}), 400
        
        post = SocialPost(
            user_id=data['user_id'],
            post_type=post_type,
            title=data['title'],
            content=data.get('content', ''),
            workout_data=data.get('workout_data')
        )
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify(post.to_dict()), 201

    @app.route('/posts/<int:post_id>', methods=['GET'])
    def get_post(post_id):
        post = get_post_or_404(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        return jsonify(post.to_dict())

    @app.route('/posts', methods=['GET'])
    def list_posts():
        posts = SocialPost.query.order_by(desc(SocialPost.created_at)).all()
        return jsonify([post.to_dict() for post in posts])

    # Feed route - show own posts + posts from followed users
    @app.route('/feed/<int:user_id>', methods=['GET'])
    def get_user_feed(user_id):
        user = get_user_or_404(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get IDs of users that this user follows
        following_ids = [follow.followed_id for follow in user.following]
        following_ids.append(user_id)  # Include own posts
        
        # Get posts from followed users and own posts
        posts = SocialPost.query.filter(
            SocialPost.user_id.in_(following_ids)
        ).order_by(desc(SocialPost.created_at)).all()
        
        return jsonify([post.to_dict() for post in posts])

    # Reaction routes
    @app.route('/posts/<int:post_id>/reactions', methods=['POST'])
    def add_reaction(post_id):
        data = request.get_json()
        if not data or 'user_id' not in data or 'reaction_type' not in data:
            return jsonify({'error': 'user_id and reaction_type are required'}), 400
        
        # Validate post exists
        post = get_post_or_404(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        # Validate user exists
        user = get_user_or_404(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Validate reaction type
        try:
            reaction_type = ReactionType(data['reaction_type'])
        except ValueError:
            return jsonify({'error': f'Invalid reaction_type. Must be one of: {[t.value for t in ReactionType]}'}), 400
        
        # Check if user already reacted to this post
        existing_reaction = Reaction.query.filter_by(user_id=data['user_id'], post_id=post_id).first()
        
        if existing_reaction:
            # Update existing reaction
            existing_reaction.reaction_type = reaction_type
            db.session.commit()
            return jsonify(existing_reaction.to_dict()), 200
        else:
            # Create new reaction
            reaction = Reaction(
                user_id=data['user_id'],
                post_id=post_id,
                reaction_type=reaction_type
            )
            db.session.add(reaction)
            db.session.commit()
            return jsonify(reaction.to_dict()), 201

    @app.route('/posts/<int:post_id>/reactions/<int:user_id>', methods=['DELETE'])
    def remove_reaction(post_id, user_id):
        reaction = Reaction.query.filter_by(user_id=user_id, post_id=post_id).first()
        if not reaction:
            return jsonify({'error': 'Reaction not found'}), 404
        
        db.session.delete(reaction)
        db.session.commit()
        return jsonify({'message': 'Reaction removed'}), 200

    # Comment routes
    @app.route('/posts/<int:post_id>/comments', methods=['POST'])
    def add_comment(post_id):
        data = request.get_json()
        if not data or 'user_id' not in data or 'content' not in data:
            return jsonify({'error': 'user_id and content are required'}), 400
        
        # Validate post exists
        post = get_post_or_404(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        # Validate user exists
        user = get_user_or_404(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        comment = Comment(
            user_id=data['user_id'],
            post_id=post_id,
            content=data['content']
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify(comment.to_dict()), 201

    @app.route('/posts/<int:post_id>/comments', methods=['GET'])
    def get_comments(post_id):
        post = get_post_or_404(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at).all()
        return jsonify([comment.to_dict() for comment in comments])

    # Follow routes
    @app.route('/users/<int:user_id>/follow', methods=['POST'])
    def follow_user(user_id):
        data = request.get_json()
        if not data or 'follower_id' not in data:
            return jsonify({'error': 'follower_id is required'}), 400
        
        follower_id = data['follower_id']
        
        # Validate users exist
        user_to_follow = get_user_or_404(user_id)
        follower = get_user_or_404(follower_id)
        
        if not user_to_follow or not follower:
            return jsonify({'error': 'User not found'}), 404
        
        # Can't follow yourself
        if user_id == follower_id:
            return jsonify({'error': 'Cannot follow yourself'}), 400
        
        # Check if already following
        existing_follow = Follow.query.filter_by(follower_id=follower_id, followed_id=user_id).first()
        if existing_follow:
            return jsonify({'error': 'Already following this user'}), 400
        
        follow = Follow(follower_id=follower_id, followed_id=user_id)
        db.session.add(follow)
        db.session.commit()
        
        return jsonify(follow.to_dict()), 201

    @app.route('/users/<int:user_id>/follow', methods=['DELETE'])
    def unfollow_user(user_id):
        data = request.get_json()
        if not data or 'follower_id' not in data:
            return jsonify({'error': 'follower_id is required'}), 400
        
        follower_id = data['follower_id']
        
        follow = Follow.query.filter_by(follower_id=follower_id, followed_id=user_id).first()
        if not follow:
            return jsonify({'error': 'Not following this user'}), 404
        
        db.session.delete(follow)
        db.session.commit()
        
        return jsonify({'message': 'Unfollowed user'}), 200

    @app.route('/users/<int:user_id>/followers', methods=['GET'])
    def get_followers(user_id):
        user = get_user_or_404(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        followers = [follow.follower.to_dict() for follow in user.followers]
        return jsonify(followers)

    @app.route('/users/<int:user_id>/following', methods=['GET'])
    def get_following(user_id):
        user = get_user_or_404(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        following = [follow.followed.to_dict() for follow in user.following]
        return jsonify(following)