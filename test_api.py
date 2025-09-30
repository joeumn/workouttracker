#!/usr/bin/env python3
"""
Simple test script for the Workout Tracker Social Feed API
"""
import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_api():
    print("🚀 Testing Workout Tracker Social Feed API")
    print("=" * 50)
    
    # Test 1: Create users
    print("\n1. Creating test users...")
    users = []
    for i, (username, email) in enumerate([
        ("alice", "alice@example.com"),
        ("bob", "bob@example.com"),
        ("charlie", "charlie@example.com")
    ]):
        response = requests.post(f"{BASE_URL}/users", json={
            "username": username,
            "email": email
        })
        if response.status_code == 201:
            user = response.json()
            users.append(user)
            print(f"✅ Created user: {username} (ID: {user['id']})")
        else:
            print(f"❌ Failed to create user {username}: {response.text}")
    
    if len(users) < 3:
        print("❌ Failed to create enough users for testing")
        return
    
    alice, bob, charlie = users
    
    # Test 2: Create social posts
    print("\n2. Creating social posts...")
    posts = []
    
    # Alice posts a PR
    pr_post = requests.post(f"{BASE_URL}/posts", json={
        "user_id": alice["id"],
        "post_type": "pr",
        "title": "New deadlift PR! 💪",
        "content": "Just hit 315lbs for the first time!",
        "workout_data": {
            "exercise": "deadlift",
            "weight": 315,
            "reps": 1,
            "unit": "lbs"
        }
    })
    
    if pr_post.status_code == 201:
        posts.append(pr_post.json())
        print("✅ Alice posted a PR")
    
    # Bob posts a streak
    streak_post = requests.post(f"{BASE_URL}/posts", json={
        "user_id": bob["id"],
        "post_type": "streak",
        "title": "30-day workout streak! 🔥",
        "content": "Consistency is key!"
    })
    
    if streak_post.status_code == 201:
        posts.append(streak_post.json())
        print("✅ Bob posted a streak")
    
    # Charlie posts a check-in
    checkin_post = requests.post(f"{BASE_URL}/posts", json={
        "user_id": charlie["id"],
        "post_type": "checkin",
        "title": "Morning gym session ✅",
        "content": "Legs day complete!"
    })
    
    if checkin_post.status_code == 201:
        posts.append(checkin_post.json())
        print("✅ Charlie posted a check-in")
    
    # Test 3: Follow users
    print("\n3. Setting up follows...")
    
    # Bob follows Alice
    follow_response = requests.post(f"{BASE_URL}/users/{alice['id']}/follow", json={
        "follower_id": bob["id"]
    })
    if follow_response.status_code == 201:
        print("✅ Bob is now following Alice")
    
    # Charlie follows Alice
    follow_response = requests.post(f"{BASE_URL}/users/{alice['id']}/follow", json={
        "follower_id": charlie["id"]
    })
    if follow_response.status_code == 201:
        print("✅ Charlie is now following Alice")
    
    # Charlie follows Bob
    follow_response = requests.post(f"{BASE_URL}/users/{bob['id']}/follow", json={
        "follower_id": charlie["id"]
    })
    if follow_response.status_code == 201:
        print("✅ Charlie is now following Bob")
    
    # Test 4: Add reactions
    print("\n4. Adding reactions...")
    if posts:
        alice_post = posts[0]  # Alice's PR post
        
        # Bob reacts with fire
        reaction_response = requests.post(f"{BASE_URL}/posts/{alice_post['id']}/reactions", json={
            "user_id": bob["id"],
            "reaction_type": "fire"
        })
        if reaction_response.status_code == 201:
            print("✅ Bob reacted with 🔥 to Alice's PR")
        
        # Charlie reacts with strong
        reaction_response = requests.post(f"{BASE_URL}/posts/{alice_post['id']}/reactions", json={
            "user_id": charlie["id"],
            "reaction_type": "strong"
        })
        if reaction_response.status_code == 201:
            print("✅ Charlie reacted with 💪 to Alice's PR")
    
    # Test 5: Add comments
    print("\n5. Adding comments...")
    if posts:
        alice_post = posts[0]  # Alice's PR post
        
        # Bob comments
        comment_response = requests.post(f"{BASE_URL}/posts/{alice_post['id']}/comments", json={
            "user_id": bob["id"],
            "content": "Incredible work! You're so strong! 💪"
        })
        if comment_response.status_code == 201:
            print("✅ Bob commented on Alice's PR")
        
        # Charlie comments
        comment_response = requests.post(f"{BASE_URL}/posts/{alice_post['id']}/comments", json={
            "user_id": charlie["id"],
            "content": "Amazing progress! What's your training program?"
        })
        if comment_response.status_code == 201:
            print("✅ Charlie commented on Alice's PR")
    
    # Test 6: Check feed
    print("\n6. Checking Charlie's feed (should see Alice and Bob's posts)...")
    feed_response = requests.get(f"{BASE_URL}/feed/{charlie['id']}")
    if feed_response.status_code == 200:
        feed = feed_response.json()
        print(f"✅ Charlie's feed has {len(feed)} posts")
        
        for post in feed:
            author = post['author']['username']
            title = post['title']
            reactions = post.get('reactions', {})
            comments_count = post.get('comments_count', 0)
            
            reaction_summary = ", ".join([f"{count} {rtype}" for rtype, data in reactions.items() for count in [data['count']]])
            print(f"   📝 {author}: {title}")
            if reaction_summary:
                print(f"      👍 Reactions: {reaction_summary}")
            if comments_count > 0:
                print(f"      💬 {comments_count} comments")
    
    # Test 7: Check inline reactions on specific post
    print("\n7. Checking inline reactions on Alice's PR...")
    if posts:
        post_response = requests.get(f"{BASE_URL}/posts/{alice_post['id']}")
        if post_response.status_code == 200:
            post_data = post_response.json()
            print(f"✅ Post: {post_data['title']}")
            
            reactions = post_data.get('reactions', {})
            for reaction_type, data in reactions.items():
                users = ", ".join(data['users'])
                print(f"   {reaction_type}: {data['count']} ({users})")
            
            comments = post_data.get('comments', [])
            print(f"   Comments ({len(comments)}):")
            for comment in comments:
                author = comment['author']['username']
                content = comment['content']
                print(f"     💬 {author}: {content}")
    
    print("\n🎉 All tests completed!")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Make sure the Flask app is running on localhost:5000")
    except Exception as e:
        print(f"❌ Test failed: {e}")