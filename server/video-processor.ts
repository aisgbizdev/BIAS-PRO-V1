import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

interface VideoProcessingResult {
  audioPath: string | null;
  frames: string[];
  duration: number;
  tempDir: string;
}

function runCommand(command: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => { stdout += data.toString(); });
    proc.stderr.on('data', (data) => { stderr += data.toString(); });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
    
    proc.on('error', reject);
  });
}

export async function processVideo(videoBuffer: Buffer, originalFilename: string): Promise<VideoProcessingResult> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bias-video-'));
  
  const safeId = crypto.randomUUID();
  const ext = path.extname(originalFilename).replace(/[^a-zA-Z0-9.]/g, '') || '.mp4';
  const safeFilename = `video_${safeId}${ext}`;
  
  const inputPath = path.join(tempDir, safeFilename);
  const audioPath = path.join(tempDir, `audio_${safeId}.mp3`);
  const framesDir = path.join(tempDir, 'frames');
  
  fs.writeFileSync(inputPath, videoBuffer);
  fs.mkdirSync(framesDir, { recursive: true });
  
  let extractedAudioPath: string | null = null;
  let duration = 0;
  const frames: string[] = [];
  
  try {
    const { stdout: probeOut } = await runCommand('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      inputPath
    ]);
    duration = parseFloat(probeOut.trim()) || 0;
    console.log(`Video duration: ${duration}s`);
  } catch (e) {
    console.log('Could not get video duration');
  }
  
  try {
    await runCommand('ffmpeg', [
      '-i', inputPath,
      '-vn',
      '-acodec', 'libmp3lame',
      '-ar', '16000',
      '-ac', '1',
      '-q:a', '9',
      audioPath,
      '-y'
    ]);
    
    if (fs.existsSync(audioPath) && fs.statSync(audioPath).size > 1000) {
      extractedAudioPath = audioPath;
      console.log('Audio extracted successfully');
    }
  } catch (e) {
    console.log('No audio track or extraction failed');
  }
  
  try {
    const frameCount = Math.min(4, Math.max(1, Math.floor(duration / 5) + 1));
    const interval = duration > 0 ? duration / (frameCount + 1) : 1;
    
    for (let i = 1; i <= frameCount; i++) {
      const timestamp = interval * i;
      const framePath = path.join(framesDir, `frame_${i}.jpg`);
      
      try {
        await runCommand('ffmpeg', [
          '-ss', timestamp.toString(),
          '-i', inputPath,
          '-vframes', '1',
          '-q:v', '2',
          framePath,
          '-y'
        ]);
        
        if (fs.existsSync(framePath)) {
          frames.push(framePath);
        }
      } catch (e) {
        console.log(`Frame ${i} extraction failed`);
      }
    }
    
    if (frames.length === 0) {
      const fallbackPath = path.join(framesDir, 'frame_0.jpg');
      try {
        await runCommand('ffmpeg', [
          '-i', inputPath,
          '-vframes', '1',
          '-q:v', '2',
          fallbackPath,
          '-y'
        ]);
        if (fs.existsSync(fallbackPath)) {
          frames.push(fallbackPath);
        }
      } catch (e) {
        console.log('Fallback frame extraction failed');
      }
    }
    
    console.log(`Extracted ${frames.length} frames`);
  } catch (e) {
    console.log('Frame extraction failed');
  }
  
  return {
    audioPath: extractedAudioPath,
    frames,
    duration,
    tempDir
  };
}

export function cleanupTempDir(tempDir: string) {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Temp directory cleaned up');
  } catch (e) {
    console.log('Cleanup failed:', e);
  }
}

export function frameToBase64(framePath: string): string {
  const buffer = fs.readFileSync(framePath);
  return buffer.toString('base64');
}

export function audioToBase64(audioPath: string): string {
  const buffer = fs.readFileSync(audioPath);
  return buffer.toString('base64');
}
