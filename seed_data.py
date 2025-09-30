#!/usr/bin/env python3
"""
Seed script to add sample data for the vibes content feature
"""

from app import app, db
from datetime import datetime, date

def seed_data():
    """Add sample content items and daily pack"""
    
    with app.app_context():
        from models import ContentItem, DailyPack, DailyPackContent
        
        # Clear existing data
        DailyPackContent.query.delete()
        DailyPack.query.delete()
        ContentItem.query.delete()
        
        # Sample content items
        content_items = [
            {
                'title': 'High Energy Workout Mix',
                'description': 'Pumping beats to keep you motivated during intense workouts',
                'content_type': 'playlist',
                'platform': 'spotify',
                'url': 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
                'thumbnail_url': 'https://i.scdn.co/image/ab67706c0000bebbf6a4b4e2f978b1f8b76de8d0',
                'duration': None
            },
            {
                'title': 'Yoga Flow Relaxation',
                'description': 'Calming music perfect for yoga and stretching sessions',
                'content_type': 'playlist',
                'platform': 'spotify',
                'url': 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp',
                'thumbnail_url': 'https://i.scdn.co/image/ab67706c0000bebba8b1b5b5c4e6e6a0d0e0a0c0',
                'duration': None
            },
            {
                'title': '5-Minute Morning Motivation',
                'description': 'Quick motivational video to start your day right',
                'content_type': 'video',
                'platform': 'youtube',
                'url': 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
                'thumbnail_url': 'https://img.youtube.com/vi/ZXsQAXx_ao0/maxresdefault.jpg',
                'duration': '5:23'
            },
            {
                'title': 'Beast Mode Workout Songs',
                'description': 'Heavy beats and aggressive music for strength training',
                'content_type': 'playlist',
                'platform': 'spotify',
                'url': 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
                'thumbnail_url': 'https://i.scdn.co/image/ab67706c0000bebbc8b1b5b5c4e6e6a0d0e0a0c0',
                'duration': None
            },
            {
                'title': 'Perfect Form: Push-up Tutorial',
                'description': 'Learn the perfect push-up technique with this detailed guide',
                'content_type': 'video',
                'platform': 'youtube',
                'url': 'https://www.youtube.com/watch?v=IODxDxX7oi4',
                'thumbnail_url': 'https://img.youtube.com/vi/IODxDxX7oi4/maxresdefault.jpg',
                'duration': '8:15'
            },
            {
                'title': 'Chill Cardio Vibes',
                'description': 'Smooth and steady beats for moderate cardio sessions',
                'content_type': 'playlist',
                'platform': 'spotify',
                'url': 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda',
                'thumbnail_url': 'https://i.scdn.co/image/ab67706c0000bebba1b1b5b5c4e6e6a0d0e0a0c0',
                'duration': None
            }
        ]
        
        # Create content items
        created_items = []
        for item_data in content_items:
            item = ContentItem(**item_data)
            db.session.add(item)
            created_items.append(item)
        
        db.session.flush()  # Get IDs for the items
        
        # Create today's daily pack
        today = date.today()
        daily_pack = DailyPack(
            date=today,
            title="Today's Energy Boost",
            description="A perfect mix of high-energy music and motivational content to power through your workout",
            theme="High Energy"
        )
        
        db.session.add(daily_pack)
        db.session.flush()  # Get the daily pack ID
        
        # Add some content items to today's pack
        pack_items = [
            (created_items[0], 0),  # High Energy Workout Mix
            (created_items[2], 1),  # 5-Minute Morning Motivation
            (created_items[3], 2),  # Beast Mode Workout Songs
        ]
        
        for item, order in pack_items:
            pack_content = DailyPackContent(
                daily_pack_id=daily_pack.id,
                content_item_id=item.id,
                order_index=order
            )
            db.session.add(pack_content)
        
        # Commit all changes
        db.session.commit()
        
        print(f"✅ Created {len(created_items)} content items")
        print(f"✅ Created daily pack '{daily_pack.title}' with {len(pack_items)} items")
        print("✅ Sample data seeded successfully!")

def main():
    """Main function to run the seeding"""
    print("🌱 Seeding sample data...")
    seed_data()

if __name__ == '__main__':
    main()