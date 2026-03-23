# Anthena Hero Video - Canva Production Guide

## Video Specs

| Setting | Value |
|---------|-------|
| Resolution | 1920x1080 (16:9) |
| Duration | 30-40 seconds total loop |
| FPS | 24fps or 30fps |
| Export | MP4, H.264 |
| Target file size | Under 15MB |
| File destination | `public/videos/hero.mp4` |

---

## Canva Workflow

### Option A: Use Canva AI Video Generator (Magic Media)

In Canva, go to **Apps > Magic Media > Video** and use these prompts:

#### Clip 1 - Man Climbing Mountain (8-10s)
```
A man with a backpack climbing a misty green mountain at golden hour, reaching up to pick rare herbs growing on a cliff. Foggy valley below with dramatic mountain peaks in background. Slow cinematic camera push-in. Natural warm sunlight.
```

#### Clip 2 - Aerial Mountain View (8-10s)
```
Aerial drone shot slowly moving forward over misty mountain ranges at sunrise. Golden light rays through clouds. Layers of green mountains fading into fog. Cinematic peaceful mood.
```

#### Clip 3 - Picking Herbs Close-up (8-10s)
```
Close-up of hands carefully picking fresh green medicinal herbs with morning dew on leaves. Soft golden backlight, blurry warm background. Slow gentle movement. Natural and organic feel.
```

#### Clip 4 - Hiker at Summit Sunset (8-10s)
```
Wide shot of a hiker silhouette standing on a mountain peak overlooking sea of clouds at sunset. Warm orange and purple sky. Wind gently moving. Camera slowly pulling back. Inspirational and epic mood.
```

### Option B: Use Canva Stock Videos + Ken Burns

If AI video credits are limited, search these in Canva stock:

1. Search: `mountain hiking fog` or `man climbing mountain`
2. Search: `aerial mountain sunrise drone`
3. Search: `picking herbs garden close up` or `hands plants nature`
4. Search: `hiker summit sunset silhouette`

Apply **Ken Burns zoom** (slow zoom in/out) to each clip for cinematic feel.

---

## Editing in Canva

### Step 1: Create Project
- Click **Create a design > Video > 1920x1080**
- Set to **Custom size** if needed

### Step 2: Add Clips
- Place all 4 clips in sequence on the timeline
- Trim each clip to **8-10 seconds**

### Step 3: Add Transitions
- Between each clip: **Cross Dissolve / Fade** transition
- Duration: **1 second** per transition
- Also add fade from last clip (to loop smoothly)

### Step 4: Color Grading (Optional but Recommended)
- Lower brightness slightly (-10 to -15)
- Increase contrast slightly (+5)
- Add warm color tone (shift toward golden/amber)
- This gives it a premium cinematic look and also helps with text readability

### Step 5: Export
- Click **Share > Download**
- Format: **MP4 Video**
- Quality: **1080p**
- No audio needed (hero video is muted)

### Step 6: Compress (if over 15MB)
- Use [HandBrake](https://handbrake.fr/) (free)
- Or online: [FreeConvert](https://www.freeconvert.com/video-compressor)
- Target: 8-15MB for fast page load

### Step 7: Place File
- Rename to `hero.mp4`
- Drop into `public/videos/hero.mp4` in the project

---

## Important Notes

- **No audio needed** - the video plays muted on the website
- **Keep it subtle** - slow, cinematic movements work best as backgrounds
- **Avoid fast cuts** - smooth transitions only, this sits behind text
- **Dark enough** - the video has a dark overlay on the website, but darker source footage = better text readability
- **Seamless loop** - try to make the end similar in tone/color to the beginning so the loop isn't jarring
