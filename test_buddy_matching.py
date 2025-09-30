import pytest
import json
from app import app, db, User, BuddyPreference, BuddyConnection, BlockedUser, Gender, GenderPreference, ConnectionStatus
from buddy_service import BuddyMatchingService

@pytest.fixture
def client():
    """Create a test client."""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

@pytest.fixture
def sample_users():
    """Create sample users for testing."""
    users = []
    
    # User 1: Male, 25, likes weightlifting
    user1 = User(username='john_doe', email='john@example.com', gender=Gender.MALE, age=25)
    db.session.add(user1)
    db.session.flush()
    
    pref1 = BuddyPreference(
        user_id=user1.id,
        gender_preference=GenderPreference.NO_PREFERENCE,
        min_age=20,
        max_age=35,
        workout_types='["weightlifting", "cardio"]',
        availability_days='["monday", "wednesday", "friday"]',
        fitness_level='intermediate',
        goals='["muscle_gain", "strength"]',
        gym_location='Downtown Gym'
    )
    db.session.add(pref1)
    users.append(user1)
    
    # User 2: Female, 28, likes yoga and cardio
    user2 = User(username='jane_smith', email='jane@example.com', gender=Gender.FEMALE, age=28)
    db.session.add(user2)
    db.session.flush()
    
    pref2 = BuddyPreference(
        user_id=user2.id,
        gender_preference=GenderPreference.MALE,
        min_age=24,
        max_age=32,
        workout_types='["yoga", "cardio"]',
        availability_days='["monday", "tuesday", "thursday"]',
        fitness_level='beginner',
        goals='["weight_loss", "flexibility"]',
        gym_location='City Fitness'
    )
    db.session.add(pref2)
    users.append(user2)
    
    # User 3: Male, 30, likes weightlifting
    user3 = User(username='mike_wilson', email='mike@example.com', gender=Gender.MALE, age=30)
    db.session.add(user3)
    db.session.flush()
    
    pref3 = BuddyPreference(
        user_id=user3.id,
        gender_preference=GenderPreference.NO_PREFERENCE,
        min_age=22,
        max_age=40,
        workout_types='["weightlifting", "powerlifting"]',
        availability_days='["monday", "wednesday", "friday", "saturday"]',
        fitness_level='advanced',
        goals='["strength", "competition"]',
        gym_location='Downtown Gym'
    )
    db.session.add(pref3)
    users.append(user3)
    
    db.session.commit()
    return users

class TestBuddyMatchingService:
    """Test buddy matching service functionality."""
    
    def test_calculate_compatibility_score(self, client, sample_users):
        """Test compatibility score calculation."""
        user1, user2, user3 = sample_users
        
        # Test compatibility between user1 and user3 (both male, similar workouts)
        score_1_3 = BuddyMatchingService.calculate_compatibility_score(user1, user3)
        assert score_1_3 > 0.5  # Should have good compatibility
        
        # Test compatibility between user1 and user2 (different workout types)
        score_1_2 = BuddyMatchingService.calculate_compatibility_score(user1, user2)
        assert 0.0 <= score_1_2 <= 1.0  # Valid score range
    
    def test_gender_preference_compatibility(self, client, sample_users):
        """Test gender preference compatibility."""
        user1, user2, user3 = sample_users
        
        # User2 prefers males, should match with user1 and user3
        service = BuddyMatchingService()
        
        # Test gender compatibility directly
        pref1 = user1.buddy_preference
        pref2 = user2.buddy_preference
        
        gender_score = service._calculate_gender_compatibility(user1, user2, pref1, pref2)
        assert gender_score > 0  # Should have some compatibility
    
    def test_find_potential_buddies(self, client, sample_users):
        """Test finding potential buddies."""
        user1, user2, user3 = sample_users
        
        # Find buddies for user1
        matches = BuddyMatchingService.find_potential_buddies(user1.id)
        
        assert isinstance(matches, list)
        assert len(matches) >= 0
        
        # Check that user1 is not in their own matches
        user_ids = [match['user_id'] for match in matches]
        assert user1.id not in user_ids
    
    def test_send_like_and_mutual_connection(self, client, sample_users):
        """Test sending likes and mutual connections."""
        user1, user2, user3 = sample_users
        
        # User1 likes User2
        result1 = BuddyMatchingService.send_like(user1.id, user2.id)
        assert result1['success'] is True
        assert result1['mutual'] is False
        
        # User2 likes User1 back (should create mutual connection)
        result2 = BuddyMatchingService.send_like(user2.id, user1.id)
        assert result2['success'] is True
        assert result2['mutual'] is True
        
        # Check that connections exist
        connections = BuddyMatchingService.get_connections(user1.id, 'mutual')
        assert len(connections) == 1
        assert connections[0]['user_id'] == user2.id
    
    def test_block_user(self, client, sample_users):
        """Test blocking a user."""
        user1, user2, user3 = sample_users
        
        # Block user2
        result = BuddyMatchingService.block_user(user1.id, user2.id, "Inappropriate behavior")
        assert result['success'] is True
        
        # Try to send like to blocked user (should not appear in matches)
        matches = BuddyMatchingService.find_potential_buddies(user1.id)
        user_ids = [match['user_id'] for match in matches]
        assert user2.id not in user_ids
        
        # Try to block again (should fail)
        result2 = BuddyMatchingService.block_user(user1.id, user2.id)
        assert 'error' in result2

class TestAPI:
    """Test API endpoints."""
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
    
    def test_create_user(self, client):
        """Test user creation endpoint."""
        user_data = {
            'username': 'test_user',
            'email': 'test@example.com',
            'gender': 'male',
            'age': 25
        }
        
        response = client.post('/api/users', 
                              data=json.dumps(user_data),
                              content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'user_id' in data
    
    def test_preferences_api(self, client, sample_users):
        """Test preferences API endpoints."""
        user1, user2, user3 = sample_users
        
        # Get preferences
        response = client.get(f'/api/preferences?user_id={user1.id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'preferences' in data
        
        # Update preferences
        new_prefs = {
            'user_id': user1.id,
            'gender_preference': 'female',
            'min_age': 22,
            'max_age': 30,
            'workout_types': ['swimming', 'running'],
            'fitness_level': 'advanced'
        }
        
        response = client.post('/api/preferences',
                              data=json.dumps(new_prefs),
                              content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
    
    def test_discover_api(self, client, sample_users):
        """Test discovery API endpoint."""
        user1, user2, user3 = sample_users
        
        response = client.get(f'/api/discover?user_id={user1.id}&limit=10')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'matches' in data
        assert isinstance(data['matches'], list)
    
    def test_like_api(self, client, sample_users):
        """Test like API endpoint."""
        user1, user2, user3 = sample_users
        
        like_data = {
            'from_user_id': user1.id,
            'to_user_id': user2.id
        }
        
        response = client.post('/api/like',
                              data=json.dumps(like_data),
                              content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
    
    def test_connections_api(self, client, sample_users):
        """Test connections API endpoint."""
        user1, user2, user3 = sample_users
        
        # Create a mutual connection first
        BuddyMatchingService.send_like(user1.id, user2.id)
        BuddyMatchingService.send_like(user2.id, user1.id)
        
        response = client.get(f'/api/connections?user_id={user1.id}&status=mutual')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'connections' in data
    
    def test_block_api(self, client, sample_users):
        """Test block API endpoint."""
        user1, user2, user3 = sample_users
        
        block_data = {
            'blocker_id': user1.id,
            'blocked_id': user2.id,
            'reason': 'Test blocking'
        }
        
        response = client.post('/api/block',
                              data=json.dumps(block_data),
                              content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True

if __name__ == '__main__':
    pytest.main([__file__])