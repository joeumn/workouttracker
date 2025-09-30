import json
from typing import List, Dict, Optional
from sqlalchemy import and_, or_, not_

class BuddyMatchingService:
    """Service for handling buddy matching logic and compatibility scoring."""
    
    @staticmethod
    def calculate_compatibility_score(user1, user2) -> float:
        """Calculate compatibility score between two users (0.0 to 1.0)."""
        from app import db, User, BuddyPreference, BuddyConnection, BlockedUser, Gender, GenderPreference, ConnectionStatus
        
        if not user1.buddy_preference or not user2.buddy_preference:
            return 0.0
        
        score = 0.0
        total_factors = 0
        
        pref1 = user1.buddy_preference
        pref2 = user2.buddy_preference
        
        # Gender preference compatibility (weight: 0.3)
        gender_score = BuddyMatchingService._calculate_gender_compatibility(user1, user2, pref1, pref2)
        score += gender_score * 0.3
        total_factors += 0.3
        
        # Age compatibility (weight: 0.2)
        age_score = BuddyMatchingService._calculate_age_compatibility(user1, user2, pref1, pref2)
        score += age_score * 0.2
        total_factors += 0.2
        
        # Workout types compatibility (weight: 0.25)
        workout_score = BuddyMatchingService._calculate_workout_compatibility(pref1, pref2)
        score += workout_score * 0.25
        total_factors += 0.25
        
        # Availability compatibility (weight: 0.15)
        availability_score = BuddyMatchingService._calculate_availability_compatibility(pref1, pref2)
        score += availability_score * 0.15
        total_factors += 0.15
        
        # Fitness level compatibility (weight: 0.1)
        fitness_score = BuddyMatchingService._calculate_fitness_compatibility(pref1, pref2)
        score += fitness_score * 0.1
        total_factors += 0.1
        
        return score / total_factors if total_factors > 0 else 0.0
    
    @staticmethod
    def _calculate_gender_compatibility(user1, user2, pref1, pref2) -> float:
        """Calculate gender preference compatibility."""
        from app import db, User, BuddyPreference, BuddyConnection, BlockedUser, Gender, GenderPreference, ConnectionStatus
        
        # Check if user1's preference matches user2's gender
        user1_match = (pref1.gender_preference == GenderPreference.NO_PREFERENCE or 
                      pref1.gender_preference.value == user2.gender.value)
        
        # Check if user2's preference matches user1's gender
        user2_match = (pref2.gender_preference == GenderPreference.NO_PREFERENCE or 
                      pref2.gender_preference.value == user1.gender.value)
        
        if user1_match and user2_match:
            return 1.0
        elif user1_match or user2_match:
            return 0.5
        else:
            return 0.0
    
    @staticmethod
    def _calculate_age_compatibility(user1, user2, pref1, pref2) -> float:
        """Calculate age compatibility."""
        # Check if users fall within each other's age preferences
        user1_in_range = pref2.min_age <= user1.age <= pref2.max_age
        user2_in_range = pref1.min_age <= user2.age <= pref1.max_age
        
        if user1_in_range and user2_in_range:
            return 1.0
        elif user1_in_range or user2_in_range:
            return 0.5
        else:
            return 0.0
    
    @staticmethod
    def _calculate_workout_compatibility(pref1, pref2) -> float:
        """Calculate workout types compatibility."""
        try:
            workouts1 = set(json.loads(pref1.workout_types or '[]'))
            workouts2 = set(json.loads(pref2.workout_types or '[]'))
            
            if not workouts1 or not workouts2:
                return 0.5  # Neutral if no preferences specified
            
            intersection = workouts1.intersection(workouts2)
            union = workouts1.union(workouts2)
            
            return len(intersection) / len(union) if union else 0.0
        except (json.JSONDecodeError, TypeError):
            return 0.5
    
    @staticmethod
    def _calculate_availability_compatibility(pref1, pref2) -> float:
        """Calculate availability compatibility."""
        try:
            days1 = set(json.loads(pref1.availability_days or '[]'))
            days2 = set(json.loads(pref2.availability_days or '[]'))
            
            if not days1 or not days2:
                return 0.5  # Neutral if no preferences specified
            
            intersection = days1.intersection(days2)
            return len(intersection) / max(len(days1), len(days2)) if (days1 or days2) else 0.0
        except (json.JSONDecodeError, TypeError):
            return 0.5
    
    @staticmethod
    def _calculate_fitness_compatibility(pref1, pref2) -> float:
        """Calculate fitness level compatibility."""
        if not pref1.fitness_level or not pref2.fitness_level:
            return 0.5  # Neutral if no preferences specified
        
        levels = {'beginner': 1, 'intermediate': 2, 'advanced': 3}
        level1 = levels.get(pref1.fitness_level.lower(), 2)
        level2 = levels.get(pref2.fitness_level.lower(), 2)
        
        diff = abs(level1 - level2)
        if diff == 0:
            return 1.0
        elif diff == 1:
            return 0.7
        else:
            return 0.3
    
    @staticmethod
    def find_potential_buddies(user_id: int, limit: int = 20) -> List[Dict]:
        """Find potential gym buddies for a user with compatibility scores."""
        from app import db, User, BuddyPreference, BuddyConnection, BlockedUser, Gender, GenderPreference, ConnectionStatus
        
        user = User.query.get(user_id)
        if not user or not user.buddy_preference:
            return []
        
        # Get blocked users
        blocked_user_ids = db.session.query(BlockedUser.blocked_id)\
            .filter(BlockedUser.blocker_id == user_id).subquery()
        blocked_by_user_ids = db.session.query(BlockedUser.blocker_id)\
            .filter(BlockedUser.blocked_id == user_id).subquery()
        
        # Get existing connections
        existing_connection_ids = db.session.query(BuddyConnection.to_user_id)\
            .filter(BuddyConnection.from_user_id == user_id).union(
                db.session.query(BuddyConnection.from_user_id)
                .filter(BuddyConnection.to_user_id == user_id)
            ).subquery()
        
        # Find potential matches
        potential_matches = User.query\
            .join(BuddyPreference)\
            .filter(
                User.id != user_id,
                ~User.id.in_(blocked_user_ids),
                ~User.id.in_(blocked_by_user_ids),
                ~User.id.in_(existing_connection_ids)
            ).all()
        
        # Calculate compatibility scores
        scored_matches = []
        for match in potential_matches:
            score = BuddyMatchingService.calculate_compatibility_score(user, match)
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
        return scored_matches[:limit]
    
    @staticmethod
    def send_like(from_user_id: int, to_user_id: int) -> Dict:
        """Send a like to another user and check for mutual connection."""
        from app import db, User, BuddyPreference, BuddyConnection, BlockedUser, Gender, GenderPreference, ConnectionStatus
        
        if from_user_id == to_user_id:
            return {'error': 'Cannot like yourself'}
        
        # Check if already connected or liked
        existing = BuddyConnection.query.filter_by(
            from_user_id=from_user_id, 
            to_user_id=to_user_id
        ).first()
        
        if existing:
            return {'error': 'Already sent like to this user'}
        
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
        
        return {
            'success': True,
            'mutual': is_mutual,
            'message': 'Mutual connection established!' if is_mutual else 'Like sent successfully'
        }
    
    @staticmethod
    def get_connections(user_id: int, status: str = 'mutual') -> List[Dict]:
        """Get user's connections by status."""
        from app import db, User, BuddyPreference, BuddyConnection, BlockedUser, Gender, GenderPreference, ConnectionStatus
        
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
        
        return result
    
    @staticmethod
    def block_user(blocker_id: int, blocked_id: int, reason: str = None) -> Dict:
        """Block/report a user."""
        from app import db, User, BuddyPreference, BuddyConnection, BlockedUser, Gender, GenderPreference, ConnectionStatus
        
        if blocker_id == blocked_id:
            return {'error': 'Cannot block yourself'}
        
        # Check if already blocked
        existing_block = BlockedUser.query.filter_by(
            blocker_id=blocker_id,
            blocked_id=blocked_id
        ).first()
        
        if existing_block:
            return {'error': 'User already blocked'}
        
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
        
        return {'success': True, 'message': 'User blocked successfully'}