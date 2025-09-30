import unittest
import json
from app import app
from database import db
from models import User, SocialPost, Reaction, Comment, Follow, PostType, ReactionType

class WorkoutTrackerTestCase(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures before each test method."""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        
        with app.app_context():
            db.create_all()
    
    def tearDown(self):
        """Tear down test fixtures after each test method."""
        with app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_create_user(self):
        """Test user creation."""
        response = self.app.post('/users', 
                                json={'username': 'testuser', 'email': 'test@example.com'})
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['username'], 'testuser')
        self.assertEqual(data['email'], 'test@example.com')
    
    def test_create_duplicate_user(self):
        """Test that duplicate users are rejected."""
        # Create first user
        self.app.post('/users', json={'username': 'testuser', 'email': 'test@example.com'})
        
        # Try to create duplicate
        response = self.app.post('/users', 
                                json={'username': 'testuser', 'email': 'different@example.com'})
        self.assertEqual(response.status_code, 400)
    
    def test_create_social_post(self):
        """Test social post creation."""
        # Create user first
        user_response = self.app.post('/users', 
                                     json={'username': 'testuser', 'email': 'test@example.com'})
        user_id = json.loads(user_response.data)['id']
        
        # Create post
        post_data = {
            'user_id': user_id,
            'post_type': 'pr',
            'title': 'Test PR',
            'content': 'Test content',
            'workout_data': {'exercise': 'squat', 'weight': 200}
        }
        response = self.app.post('/posts', json=post_data)
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['title'], 'Test PR')
        self.assertEqual(data['post_type'], 'pr')
    
    def test_add_reaction(self):
        """Test adding reactions to posts."""
        # Create user and post
        user_response = self.app.post('/users', 
                                     json={'username': 'testuser', 'email': 'test@example.com'})
        user_id = json.loads(user_response.data)['id']
        
        post_response = self.app.post('/posts', json={
            'user_id': user_id,
            'post_type': 'pr',
            'title': 'Test PR'
        })
        post_id = json.loads(post_response.data)['id']
        
        # Add reaction
        reaction_response = self.app.post(f'/posts/{post_id}/reactions', json={
            'user_id': user_id,
            'reaction_type': 'fire'
        })
        self.assertEqual(reaction_response.status_code, 201)
        data = json.loads(reaction_response.data)
        self.assertEqual(data['reaction_type'], 'fire')
    
    def test_add_comment(self):
        """Test adding comments to posts."""
        # Create user and post
        user_response = self.app.post('/users', 
                                     json={'username': 'testuser', 'email': 'test@example.com'})
        user_id = json.loads(user_response.data)['id']
        
        post_response = self.app.post('/posts', json={
            'user_id': user_id,
            'post_type': 'pr',
            'title': 'Test PR'
        })
        post_id = json.loads(post_response.data)['id']
        
        # Add comment
        comment_response = self.app.post(f'/posts/{post_id}/comments', json={
            'user_id': user_id,
            'content': 'Great job!'
        })
        self.assertEqual(comment_response.status_code, 201)
        data = json.loads(comment_response.data)
        self.assertEqual(data['content'], 'Great job!')
    
    def test_follow_user(self):
        """Test following functionality."""
        # Create two users
        user1_response = self.app.post('/users', 
                                      json={'username': 'user1', 'email': 'user1@example.com'})
        user1_id = json.loads(user1_response.data)['id']
        
        user2_response = self.app.post('/users', 
                                      json={'username': 'user2', 'email': 'user2@example.com'})
        user2_id = json.loads(user2_response.data)['id']
        
        # User1 follows User2
        follow_response = self.app.post(f'/users/{user2_id}/follow', json={
            'follower_id': user1_id
        })
        self.assertEqual(follow_response.status_code, 201)
        data = json.loads(follow_response.data)
        self.assertEqual(data['follower_id'], user1_id)
        self.assertEqual(data['followed_id'], user2_id)
    
    def test_user_feed(self):
        """Test user feed functionality."""
        # Create users
        user1_response = self.app.post('/users', 
                                      json={'username': 'user1', 'email': 'user1@example.com'})
        user1_id = json.loads(user1_response.data)['id']
        
        user2_response = self.app.post('/users', 
                                      json={'username': 'user2', 'email': 'user2@example.com'})
        user2_id = json.loads(user2_response.data)['id']
        
        # User1 follows User2
        self.app.post(f'/users/{user2_id}/follow', json={'follower_id': user1_id})
        
        # User2 creates a post
        self.app.post('/posts', json={
            'user_id': user2_id,
            'post_type': 'streak',
            'title': 'User2 post'
        })
        
        # User1 creates a post
        self.app.post('/posts', json={
            'user_id': user1_id,
            'post_type': 'pr',
            'title': 'User1 post'
        })
        
        # Check User1's feed (should see both posts)
        feed_response = self.app.get(f'/feed/{user1_id}')
        self.assertEqual(feed_response.status_code, 200)
        feed_data = json.loads(feed_response.data)
        self.assertEqual(len(feed_data), 2)
        
        # Check that posts are from followed user and self
        post_authors = [post['author']['username'] for post in feed_data]
        self.assertIn('user1', post_authors)
        self.assertIn('user2', post_authors)
    
    def test_inline_reactions(self):
        """Test that reactions are properly grouped inline."""
        # Create users
        user1_response = self.app.post('/users', 
                                      json={'username': 'user1', 'email': 'user1@example.com'})
        user1_id = json.loads(user1_response.data)['id']
        
        user2_response = self.app.post('/users', 
                                      json={'username': 'user2', 'email': 'user2@example.com'})
        user2_id = json.loads(user2_response.data)['id']
        
        # Create post
        post_response = self.app.post('/posts', json={
            'user_id': user1_id,
            'post_type': 'pr',
            'title': 'Test PR'
        })
        post_id = json.loads(post_response.data)['id']
        
        # Add reactions
        self.app.post(f'/posts/{post_id}/reactions', json={
            'user_id': user1_id,
            'reaction_type': 'fire'
        })
        self.app.post(f'/posts/{post_id}/reactions', json={
            'user_id': user2_id,
            'reaction_type': 'strong'
        })
        
        # Get post with reactions
        post_response = self.app.get(f'/posts/{post_id}')
        self.assertEqual(post_response.status_code, 200)
        post_data = json.loads(post_response.data)
        
        # Check inline reactions
        self.assertIn('reactions', post_data)
        self.assertIn('fire', post_data['reactions'])
        self.assertIn('strong', post_data['reactions'])
        self.assertEqual(post_data['reactions']['fire']['count'], 1)
        self.assertEqual(post_data['reactions']['strong']['count'], 1)
        self.assertIn('user1', post_data['reactions']['fire']['users'])
        self.assertIn('user2', post_data['reactions']['strong']['users'])

if __name__ == '__main__':
    unittest.main()