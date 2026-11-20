---
name: clip-stream
description: Clip a livestream VOD into vertical 9:16 clips. Finds the moments where chat (or the streamer) went wild, cuts each one, adds captions and a hook, and saves ready-to-review mp4s. Use when the user pastes a stream link and says "clip this stream", "find the best moments", "make clips from this VOD", or runs /clip-stream.
---

# Clip a stream (starter)

A simple, local stream clipper. Everything runs on this computer. Nothing is uploaded or posted.
Free starter by Karemops.ai. Built from public tools: Claude Code, yt-dlp, FFmpeg, whisper.cpp.

## Ground rules (follow every time)

- Work only inside the folder this session is open in (the user made it for clips). Create `work/`, `out/` and `models/` inside it. The helper script `find_moments.py` is at the end of this file: on the first run, save it as `work/find_moments.py` exactly as written.
- Explain each step in one plain sentence before you run it. The user may never have used Terminal, so never ask them to open it or type commands: you run every command yourself, they only click Allow.
- **Ask before installing anything.** Say what it is, why, and roughly how big.
- **Rights first.** Before downloading, ask the user which clipping campaign this is for, or confirm the streamer allows clipping. If neither, say clearly that posting clips of someone else's stream can get the account a copyright strike, and let the user decide.
- Only public VODs (past streams). Never log in, never use cookies or the user's accounts, never get around a paywall or a private video.
- Never upload, post or send anything. Clips stay in the `out` folder for the user to review.
- Every clip is an edit, not a repost: the streamer's reaction, a hook at the top, captions. Never cut long stretches of plain gameplay.

## Step 0: check the tools (first run only)

1. **yt-dlp** (downloads the VOD and its chat): `yt-dlp --version`.
2. **FFmpeg with caption support:** `ffmpeg -hide_banner -filters | grep subtitles`. Nothing printed means captions can't be burned in.
3. **Whisper** (`whisper-cli`) and a model at `models/ggml-base.en.bin`.

Fixes (ask first):
- Mac: `brew install yt-dlp ffmpeg-full`. ffmpeg-full installs next to any FFmpeg already there, at `$(brew --prefix)/opt/ffmpeg-full/bin/ffmpeg`; use that full path. It also installs `whisper-cli`.
- Mac without Homebrew: explain it in one sentence, then on a yes download the official Homebrew installer package (the latest `Homebrew-*.pkg` from github.com/Homebrew/brew/releases) and open it with `open`. A normal Mac installer window appears: tell the user to click Continue and Install, and to type their Mac password in that window. The password goes only in that installer window: never ask for it in the chat and never run anything as administrator yourself. When it says the install worked, carry on.
- Windows: `winget install yt-dlp.yt-dlp` and `winget install Gyan.FFmpeg`. For Whisper, the whisper.cpp Windows release from github.com/ggml-org/whisper.cpp/releases.
- Model (about 140 MB): `curl -L -o models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin`
- If the user says no to FFmpeg with captions: still make the clips, and attach captions as a separate track (`-c:s mov_text`). Instagram and TikTok can also add captions when posting.

## Step 1: pick the stream and the section

1. Ask for the VOD link (YouTube, Twitch or Kick) and the campaign or reason.
2. Long streams are huge. Ask which 2 hours to clip (default: the last 2 hours). Get the length with `yt-dlp --print duration_string "<link>"`.

## Step 2: download

- The section of video, 1080p max:
  `yt-dlp -f "bv*[height<=1080]+ba/b[height<=1080]" --download-sections "*<from>-<to>" --merge-output-format mp4 -o work/section.mp4 "<link>"`
- YouTube only, the chat replay (can take several minutes on a long stream):
  `yt-dlp --skip-download --write-subs --sub-langs live_chat -o work/vod "<link>"` → `work/vod.live_chat.json`
- Twitch, Kick, or no chat replay: skip the chat, step 3 uses the audio instead.

## Step 3: find the moments

- With chat (best): `python3 work/find_moments.py chat work/vod.live_chat.json --from <from> --to <to> --clips 7 > work/moments.json`
- Without chat, first make a loudness log, then read it:
  `ffmpeg -hide_banner -nostats -i work/section.mp4 -vn -af ebur128 -f null - 2> work/loudness.txt`
  `python3 work/find_moments.py audio work/loudness.txt --clips 7 > work/moments.json`

It lists each moment on screen and the JSON lands in `work/moments.json` (start and end in seconds from the start of `section.mp4`, the stream time, a strength score and the words chat repeated most). Show the user the list. Drop any moment that's just gameplay with no reaction.

## Step 4: cut each clip to 9:16

For each moment (n = 01, 02, ...), the stream sits in the middle over a blurred copy of itself:
```
ffmpeg -y -ss <start> -to <end> -i work/section.mp4 -filter_complex "[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:2[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1" -r 30 -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 160k work/cut-<n>.mp4
```
If the streamer's face cam is in a corner, offer a second version that crops the face cam to the top half and the game to the bottom.

## Step 5: captions and a hook

1. Captions: `ffmpeg -y -i work/cut-<n>.mp4 -vn -ac 1 -ar 16000 work/cut-<n>.wav`, then
   `whisper-cli -m models/ggml-base.en.bin -f work/cut-<n>.wav -ml 18 -sow -osrt -of work/cut-<n>`
   Fix names and slang in `work/cut-<n>.srt` (Whisper mishears names).
2. Hook: write 3 short hook lines (under 8 words) for each clip from what happens and what chat said (`chat_words`). Let the user pick. Save the pick in `work/hook-<n>.srt` as one subtitle from 00:00:00,000 to 00:00:03,000.
3. Burn both in, hook at the top, captions low:
```
ffmpeg -y -i work/cut-<n>.mp4 -vf "subtitles=work/cut-<n>.srt:force_style='FontName=Arial,FontSize=13,Bold=1,Outline=2,Alignment=2,MarginV=60',subtitles=work/hook-<n>.srt:force_style='FontName=Arial,FontSize=16,Bold=1,Outline=3,Alignment=8,MarginV=40'" -c:v libx264 -crf 20 -c:a copy out/clip-<n>.mp4
```

## Step 6: hand it over

1. Open the `out` folder for the user (`open out` on a Mac, `start out` on Windows) and list the clips with their stream time and hook.
2. Write `out/clips.md`: for each clip a post caption that credits the streamer (@name) and, if the campaign asks for it, its tags or #ad.
3. Remind the user: watch every clip before posting, follow the campaign's brief, and post only clips that add something (the reaction, the hook, the captions).

## If something fails

Read the error, explain it in one sentence, fix it, and run the step again. Typical fixes: quotes around file names with spaces; "No such filter: subtitles" means the FFmpeg without caption support is being used (go back to step 0); "Sign in to confirm you're not a bot" means YouTube is blocking downloads right now, so wait or try another VOD (never use the user's cookies).

## The helper script: find_moments.py

Save this exactly as `work/find_moments.py` on the first run. It only reads the one file you give it and prints the result.

```python
#!/usr/bin/env python3
"""Find the moments worth clipping in a stream. Free starter by Karemops.ai.

Two ways to find them:
  chat   (YouTube VODs): read the chat replay file yt-dlp saves (*.live_chat.json) and find the
         seconds where chat suddenly speeds up and gets loud (caps, hype words, emojis).
  audio  (any stream, Twitch and Kick too): read a loudness log made by ffmpeg and find where the
         streamer or the room suddenly gets loud. Make the log first:
         ffmpeg -hide_banner -nostats -i work/section.mp4 -vn -af ebur128 -f null - 2> work/loudness.txt

Usage:
  python3 find_moments.py chat  work/vod.live_chat.json --from 1:00:00 --to 3:00:00 [--clips 7] > work/moments.json
  python3 find_moments.py audio work/loudness.txt [--clips 7] > work/moments.json

Prints JSON: for each moment, where to cut (start/end in seconds from the start of the downloaded
section), the stream time, a strength score and the words chat repeated most (for the hook).
It only reads the one file you give it and prints the result. Python standard library only.
"""
import argparse, collections, json, math, re, sys

HYPE = re.compile(r"\b(w+|lma+o+|lo+l|omg|no+ wa+y|wha+t|clip (it|that)|bro+|ins+ane|cra+zy|wtf|let'?s go+|ra+ge)\b", re.I)
EMOJI = re.compile("[\U0001F300-\U0001FAFF\u2600-\u27BF]")
SKIP = set("EMOJI THE AND YOU IS IT TO OF IN THIS THAT ON FOR ME MY SO WAS ARE BE WITH HE SHE THEY WE AT JUST".split())


def secs(v):
    """'1:02:03', '62:03' or '3723' -> seconds"""
    parts = [float(p) for p in str(v).split(':')]
    total = 0.0
    for p in parts:
        total = total * 60 + p
    return total


def chat_signal(path, t0, t1):
    """Per-second hype score from a YouTube chat replay file (one JSON object per line)."""
    length = int(t1 - t0) + 1
    score = [0.0] * length
    words = collections.defaultdict(collections.Counter)
    count = 0
    with open(path, encoding='utf-8', errors='ignore') as fh:
        for line in fh:
            try:
                row = json.loads(line)
            except ValueError:
                continue
            replay = row.get('replayChatItemAction') or {}
            try:
                t = int(replay.get('videoOffsetTimeMsec', -1)) / 1000.0
            except (TypeError, ValueError):
                continue
            if t < t0 or t >= t1:
                continue
            for action in replay.get('actions', []):
                msg = (action.get('addChatItemAction') or {}).get('item', {}).get('liveChatTextMessageRenderer')
                if not msg:
                    continue
                text = ''.join(r.get('text', '') or ' :emoji: ' for r in msg.get('message', {}).get('runs', []))
                s = 1.0
                letters = [c for c in text if c.isalpha()]
                if len(letters) >= 3 and sum(c.isupper() for c in letters) > 0.7 * len(letters):
                    s += 0.75
                if HYPE.search(text):
                    s += 1.0
                if EMOJI.search(text) or ':emoji:' in text:
                    s += 0.5
                sec = int(t - t0)
                score[sec] += s
                count += 1
                for w in re.findall(r"[A-Za-z']{2,}", text.upper()):
                    if w not in SKIP:
                        words[sec // 10][w] += 1
    return score, words, count


def audio_signal(log_path):
    """Per-second loudness (LUFS, momentary) from an ffmpeg ebur128 log."""
    per = collections.defaultdict(list)
    with open(log_path, encoding='utf-8', errors='ignore') as fh:
        for m in re.finditer(r't:\s*([\d.]+)\s+TARGET.*?M:\s*(-?[\d.]+)', fh.read()):
            per[int(float(m.group(1)))].append(float(m.group(2)))
    if not per:
        sys.exit('No loudness lines found. Make the log with: ffmpeg -hide_banner -nostats -i work/section.mp4 -vn -af ebur128 -f null - 2> work/loudness.txt')
    length = max(per) + 1
    return [max(per.get(i, [-70.0])) for i in range(length)]


def peaks(signal, n, gap, lead, tail, window):
    """Smooth the signal, then take the n strongest moments at least `gap` seconds apart."""
    L = len(signal)
    half = window // 2
    smooth = [sum(signal[max(0, i - half):i + half + 1]) / window for i in range(L)]
    mean = sum(smooth) / L
    sd = math.sqrt(sum((x - mean) ** 2 for x in smooth) / L) or 1.0
    chosen = []
    for i in sorted(range(L), key=lambda i: -smooth[i]):
        if i < lead or i > L - tail:
            continue
        if all(abs(i - p) >= gap for p in chosen):
            chosen.append(i)
        if len(chosen) == n:
            break
    return sorted(chosen), smooth, mean, sd


def clock(s):
    s = int(s)
    return f'{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}'


def main():
    ap = argparse.ArgumentParser(description='Find the moments worth clipping in a stream.')
    ap.add_argument('mode', choices=['chat', 'audio'])
    ap.add_argument('file')
    ap.add_argument('--from', dest='t0', default='0', help='chat mode: start of the section you downloaded, e.g. 1:00:00')
    ap.add_argument('--to', dest='t1', default=None, help='chat mode: end of that section, e.g. 3:00:00')
    ap.add_argument('--clips', type=int, default=7)
    ap.add_argument('--gap', type=int, default=240, help='minimum seconds between two clips (default 240)')
    a = ap.parse_args()

    if a.mode == 'chat':
        if not a.t1:
            sys.exit('Chat mode needs --to (the end of the section you downloaded).')
        t0, t1 = secs(a.t0), secs(a.t1)
        signal, words, count = chat_signal(a.file, t0, t1)
        if count == 0:
            sys.exit('No chat messages found in that time range. Check --from and --to.')
        # chat reacts 10 to 20 s after the moment, so the clip starts well before the spike
        lead, tail, window = 25, 5, 10
    else:
        t0 = 0.0
        signal, words, count = audio_signal(a.file), {}, 0
        lead, tail, window = 15, 10, 4

    chosen, smooth, mean, sd = peaks(signal, a.clips, a.gap, lead, tail, window)
    moments = []
    for k, p in enumerate(chosen, 1):
        top = collections.Counter()
        for j in range(max(0, (p - 20) // 10), p // 10 + 2):
            top.update(words.get(j, {}) if isinstance(words, dict) else words[j])
        said = [w for w, _ in top.most_common(3)]
        start, end = max(0, p - lead), min(len(signal), p + tail)
        moments.append({
            'clip': k,
            'start': start, 'end': end,
            'stream_time': clock(t0 + p),
            'strength': round((smooth[p] - mean) / sd, 1),
            'chat_words': said,
            'hook_idea': f'Chat went crazy: "{said[0]}"' if said else 'Watch what happens next',
        })
        print(f"clip {k}: {clock(t0 + start)} to {clock(t0 + end)}  strength {moments[-1]['strength']}  {' '.join(said)}", file=sys.stderr)

    print(json.dumps({'mode': a.mode, 'section_start': clock(t0), 'chat_messages': count, 'moments': moments}, indent=1))


if __name__ == '__main__':
    main()
```
