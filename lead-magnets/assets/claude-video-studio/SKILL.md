---
name: video-studio
description: Turn one idea into a finished vertical reel (1080x1920 mp4) on your own computer. Writes the script, captions your voice with Whisper, adds screenshots or your talking-head video, mixes in a music track you downloaded, and renders with ffmpeg. Use when the user says "make a reel", "make a video about", "edit my video", "add captions", or runs /video-studio.
---

# Video studio (starter)

A simple, local video studio. Everything runs on this computer. Nothing is uploaded anywhere.
Free starter by Karemops.ai. Built from public tools: Claude Code, whisper.cpp, FFmpeg, Google Chrome and Pixabay music.

## Ground rules (follow every time)

- Work only inside the folder `~/video-studio`. Create it if it doesn't exist, with `input/`, `work/`, `out/` and `models/` inside.
- Explain each step in one plain sentence before you run it. The user may never have used Terminal.
- **Ask before installing anything.** Say what it is, why it's needed, and roughly how big it is.
- Take screenshots only of public web pages the user named or approved. Never log in to anything, never type passwords, never use the user's accounts.
- Music: only a track the user downloaded from Pixabay (pixabay.com/music) or made themselves. Never download music yourself.
- Never upload, post or send files. The finished reel stays in `~/video-studio/out/`.
- Never invent results, numbers or quotes in a script. If a fact matters, say where it came from.

## Step 0: check the tools (first run only)

Check these and tell the user what's missing:

1. **FFmpeg with caption support.** Run `ffmpeg -hide_banner -filters | grep subtitles`. If it prints nothing, this FFmpeg can't burn captions.
   - Mac: the fix is `brew install ffmpeg-full` (Homebrew). It installs next to any FFmpeg already there, at `$(brew --prefix)/opt/ffmpeg-full/bin/ffmpeg`. Use that full path from then on. It also installs `whisper-cli`. If Homebrew itself is missing, explain it, then install it from brew.sh after the user says yes. Their Mac password is typed by them, in Terminal, never by you.
   - If the user says no to the install: still build the reel, and attach the captions as a separate track instead of burning them in (`-i work/captions.srt -c:s mov_text`). Tell them Instagram and TikTok can also add captions when they post.
   - Windows: `winget install Gyan.FFmpeg` gives a full FFmpeg. For Whisper, download the whisper.cpp Windows release from github.com/ggml-org/whisper.cpp/releases (ask first).
2. **A Whisper model.** If `~/video-studio/models/ggml-base.bin` is missing, ask, then download it (about 150 MB):
   `curl -L -o ~/video-studio/models/ggml-base.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin`
3. **Google Chrome** (only for screenshots). On a Mac it lives at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.

## Step 1: idea to script

1. Ask for the idea, who it's for, and the call to action at the end (for example "comment GUIDE").
2. If web search is available, look up 2 or 3 sources first and list them for the user.
3. Write a 30 to 45 second script to `work/script.md`: a hook in the first line, 3 short beats, then the call to action. Spoken words only, short sentences.
4. Ask the user to record it: a voice memo on the phone (voice-only reel) or a selfie video (talking-head reel). They drop the file into `~/video-studio/input/`.

## Step 2: captions

1. Make a clean audio file: `ffmpeg -y -i input/<their file> -vn -ac 1 -ar 16000 work/voice.wav`
2. Transcribe with short lines: `whisper-cli -m models/ggml-base.bin -f work/voice.wav -l auto -ml 18 -sow -osrt -of work/captions`
3. Open `work/captions.srt`, fix spelling of names and brand words (Whisper often writes "Claude" as "Clawed" and "reel" as "real"), and show the user the first few lines.

## Step 3: visuals

**Talking-head reel:** the user's video is the visual. Skip to step 4.

**Voice-only reel:** you need 3 to 6 images.
- Screenshots of the public pages the user approved, one per beat:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1080,1920 --screenshot=work/shot1.png "<url>"`
- Or images the user put in `input/`.
- Look at every screenshot before using it. Some sites show a security check or a cookie wall instead of the page: drop that one and use another page or one of the user's images.
- Show the user the list of images and which beat each one covers.

## Step 4: build the video

Use the FFmpeg with caption support (step 0). All output is 1080x1920, 30 fps.

**Talking-head reel** (captions in the lower third, away from the face):
```
ffmpeg -y -i input/<video> -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,subtitles=work/captions.srt:force_style='FontName=Arial,FontSize=13,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=0,Alignment=2,MarginV=70'" -r 30 -c:v libx264 -crf 20 -preset medium -c:a aac -b:a 160k work/base.mp4
```

**Voice-only reel:** give each image an equal share of the voice length (get it with `ffprobe -v error -show_entries format=duration -of csv=p=0 work/voice.wav`). For each image, make a clip with a slow zoom, for example 6 seconds (d is frames: seconds x 30; keep d last, and write shell variables as ${d}):
```
ffmpeg -y -loop 1 -i work/shot1.png -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0008,1.08)':s=1080x1920:fps=30:d=180" -t 6 -c:v libx264 -pix_fmt yuv420p work/clip1.mp4
```
List the clips in `work/clips.txt` (`file 'clip1.mp4'` lines), join them, add the voice and burn the captions:
```
ffmpeg -y -f concat -safe 0 -i work/clips.txt -i work/voice.wav -vf "subtitles=work/captions.srt:force_style='FontName=Arial,FontSize=13,Bold=1,Outline=2,Alignment=2,MarginV=70'" -c:v libx264 -crf 20 -c:a aac -b:a 160k -shortest work/base.mp4
```

## Step 5: music (optional)

If the user put a Pixabay track in `input/` (for example `input/music.mp3`), mix it well under the voice and fade it out:
```
ffmpeg -y -i work/base.mp4 -i input/music.mp3 -filter_complex "[1:a]volume=0.12,afade=t=out:st=<length minus 2>:d=2[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k out/reel.mp4
```
No music: copy `work/base.mp4` to `out/reel.mp4`.

## Step 6: hand it over

1. Open the folder (`open ~/video-studio/out` on a Mac, `start` on Windows) and tell the user the file name and length.
2. Offer 3 quick changes they can ask for in plain words: bigger captions, music louder or softer, a different image for a beat.
3. Want animated title cards or charts? That's a bigger step: Remotion (remotion.dev) or HyperFrames can build them in code, and you join the clip at the start with the concat step.

## If something fails

Read the error, explain it in one sentence, fix it, and run the step again. Don't skip a step silently. Typical fixes: a file name with spaces needs quotes; "No such filter: subtitles" means the FFmpeg without caption support is being used (go back to step 0).
