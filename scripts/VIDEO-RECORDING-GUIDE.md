# Exercise Video Recording Guide

## Naming Convention

Record one video per exercise. Name by exercise ID:

```
exercise-videos/
├── 1/           # Push-ups
│   ├── video.mp4
│   └── poster.jpg
├── 2/           # Squats
│   ├── video.mp4
│   └── poster.jpg
├── 3/           # Forearm Plank
│   ├── video.mp4
│   └── poster.jpg
...
```

## Recording Specs

| Setting | Value |
|---------|-------|
| Format | MP4 (H.264) |
| Resolution | 1920x1080 (1080p) |
| Framerate | 30fps |
| Orientation | Landscape |
| Max size | 50MB per file |
| Length | 30-90 seconds per exercise |

## What Each Video Should Show

1. **Start title card** (2s): Exercise name + equipment needed
2. **Setup** (5s): Camera shows you setting up, verbal cues on positioning
3. **Demonstration** (10-20s): Full movement at normal speed, 3-5 reps
4. **Form cues** (5-10s): Close-up on key form points (e.g., elbow angle, foot position)
5. **Common mistakes** (5s): Show what NOT to do
6. **Regression** (5s): Show the easier version
7. **Progression** (5s): Show the harder version (optional)
8. **End title card** (2s): "Sitting Sucks - sittingsucks.com"

**Total: ~30-60 seconds per exercise**

## Audio

- Use a lavalier mic or record voiceover separately
- Speak clearly: "Elbows at 45 degrees, not flared. Shoulder blades together."
- Background music optional, low volume

## File Naming Rule

If exercise ID is in the database (e.g., from supabase), use that as the folder name.
If recording a NEW exercise, use kebab-case: `ankle-inversion-band` → will create a new exercise entry.

## Upload Process (after recording)

```bash
# 1. Upload video
npx supabase storage upload exercise-videos/1/video.mp4 ~/Videos/exercises/pushups.mp4

# 2. Upload poster (first frame or thumbnail)
npx supabase storage upload exercise-videos/1/poster.jpg ~/Videos/exercises/pushups-thumb.jpg

# 3. Update the exercise record (via SQL or admin panel)
# UPDATE exercises SET video_url = '...' WHERE id = '1';
```

## DaVinci Resolve Project Template

Since we have $300 invested in DaVinci Resolve Studio:
- Create a project template with: 1080p timeline, 30fps, title cards preset
- Export settings: H.264, 10Mbps bitrate, AAC audio 192kbps
- Use the Sitting Sucks logo as lower-third watermark