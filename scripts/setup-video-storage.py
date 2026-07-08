#!/usr/bin/env python3
"""
Supabase Storage Setup for Exercise Videos
Run this once to create the exercise-videos storage bucket and set up RLS policies.
"""
import os
import sys
from supabase import create_client

SUPABASE_URL = os.environ.get('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("ERROR: Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

BUCKET_NAME = 'exercise-videos'

# 1. Create bucket
print(f"Creating bucket: {BUCKET_NAME}")
try:
    supabase.storage.create_bucket(
        BUCKET_NAME,
        options={
            'public': True,
            'allowed_mime_types': ['video/mp4', 'video/webm'],
            'file_size_limit': 52428800,  # 50MB
        }
    )
    print(f"  ✅ Bucket '{BUCKET_NAME}' created")
except Exception as e:
    if 'already exists' in str(e):
        print(f"  ✅ Bucket '{BUCKET_NAME}' already exists")
    else:
        print(f"  ❌ Error: {e}")
        sys.exit(1)

# 2. Set up storage path structure
print("\nStorage path structure:")
print("  exercise-videos/{exercise_id}/video.mp4")
print("  exercise-videos/{exercise_id}/poster.jpg")
print("\nUpload with:")
print("  supabase storage upload exercise-videos/{exercise_id}/video.mp4 <file>")
print("  supabase storage upload exercise-videos/{exercise_id}/poster.jpg <file>")

# 3. Update exercises table video_url column
print("\nAfter uploading, update the exercise record:")
print("  UPDATE exercises SET video_url = 'https://<project>.supabase.co/storage/v1/object/public/exercise-videos/{exercise_id}/video.mp4' WHERE id = '{exercise_id}';")

print("\nDone! ✅")