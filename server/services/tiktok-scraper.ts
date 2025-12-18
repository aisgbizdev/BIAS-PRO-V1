/**
 * TikTok Web Scraper
 * Fetches public TikTok profile data by scraping HTML
 */

import { parseMetricBigInt } from '../utils/metrics';

export interface TikTokScrapedProfile {
  username: string;
  nickname: string;
  signature: string;
  avatarUrl: string;
  verified: boolean;
  followerCount: bigint;
  followingCount: bigint;
  videoCount: bigint;
  likesCount: bigint;
}

/**
 * Try TikTok oEmbed API - official but limited data
 * Only returns author name, no follower counts
 */
async function tryOembedApi(username: string): Promise<TikTokScrapedProfile | null> {
  try {
    // oEmbed API needs a video URL, so we try to get one from the profile page meta tags
    const profileUrl = `https://www.tiktok.com/@${username}`;
    
    // First try the unofficial API endpoint that some scrapers use
    const apiUrl = `https://www.tiktok.com/api/user/detail/?uniqueId=${username}&msToken=`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.tiktok.com/',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const userInfo = data?.userInfo;
      
      if (userInfo?.user && userInfo?.stats) {
        console.log('[TikTok Scraper] API endpoint success!');
        return {
          username: userInfo.user.uniqueId || username,
          nickname: userInfo.user.nickname || username,
          signature: userInfo.user.signature || '',
          avatarUrl: userInfo.user.avatarLarger || userInfo.user.avatarMedium || '',
          verified: userInfo.user.verified || false,
          followerCount: parseMetricBigInt(userInfo.stats.followerCount),
          followingCount: parseMetricBigInt(userInfo.stats.followingCount),
          videoCount: parseMetricBigInt(userInfo.stats.videoCount),
          likesCount: parseMetricBigInt(userInfo.stats.heart || userInfo.stats.heartCount),
        };
      }
    }
    
    return null;
  } catch (error) {
    console.log('[TikTok Scraper] API endpoint failed:', error);
    return null;
  }
}

export async function scrapeTikTokProfile(username: string): Promise<TikTokScrapedProfile> {
  // Try multiple methods in order of reliability
  
  // Method 1: Try oEmbed API first (official, limited but stable)
  try {
    console.log(`[TikTok Scraper] Trying oEmbed API for @${username}...`);
    const oembedResult = await tryOembedApi(username);
    if (oembedResult) {
      console.log(`[TikTok Scraper] oEmbed success for @${username}`);
      return oembedResult;
    }
  } catch (e) {
    console.log(`[TikTok Scraper] oEmbed failed, trying HTML scrape...`);
  }
  
  // Method 2: Direct HTML scraping (may be blocked by TikTok)
  try {
    const profileUrl = `https://www.tiktok.com/@${username}`;
    console.log(`[TikTok Scraper] Fetching profile: ${profileUrl}`);
    
    // Fetch with timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    
    // Use mobile user agent - often less restricted
    const userAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    ];
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const response = await fetch(profileUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': randomUA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      }
    });

    clearTimeout(timeoutId);

    console.log(`[TikTok Scraper] Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch TikTok profile: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`[TikTok Scraper] HTML length: ${html.length} chars`);
    
    // Check if we got a challenge/captcha page
    if (html.includes('captcha') || html.includes('verify') || html.length < 5000) {
      console.log('[TikTok Scraper] Possible CAPTCHA/challenge page detected');
    }

    // TikTok embeds data in <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">
    const scriptMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
    
    if (scriptMatch && scriptMatch[1]) {
      const data = JSON.parse(scriptMatch[1]);
      const userDetail = data?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo;
      
      if (userDetail?.user && userDetail?.stats) {
        // Use 'heart' field first to avoid JSON.parse() overflow on heartCount
        return {
          username: userDetail.user.uniqueId || username,
          nickname: userDetail.user.nickname || username,
          signature: userDetail.user.signature || '',
          avatarUrl: userDetail.user.avatarLarger || userDetail.user.avatarMedium || '',
          verified: userDetail.user.verified || false,
          followerCount: parseMetricBigInt(userDetail.stats.followerCount),
          followingCount: parseMetricBigInt(userDetail.stats.followingCount),
          videoCount: parseMetricBigInt(userDetail.stats.videoCount),
          likesCount: parseMetricBigInt(userDetail.stats.heart || userDetail.stats.heartCount)
        };
      }
    }

    // Fallback: Try alternative script tag format
    const altScriptMatch = html.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
    
    if (altScriptMatch && altScriptMatch[1]) {
      const data = JSON.parse(altScriptMatch[1]);
      const userModule = data?.UserModule?.users;
      const statsModule = data?.UserModule?.stats;
      
      if (userModule && statsModule) {
        const userId = Object.keys(userModule)[0];
        const user = userModule[userId];
        const stats = statsModule[userId];
        
        if (user && stats) {
          return {
            username: user.uniqueId || username,
            nickname: user.nickname || username,
            signature: user.signature || '',
            avatarUrl: user.avatarLarger || user.avatarMedium || '',
            verified: user.verified || false,
            followerCount: parseMetricBigInt(stats.followerCount),
            followingCount: parseMetricBigInt(stats.followingCount),
            videoCount: parseMetricBigInt(stats.videoCount),
            likesCount: parseMetricBigInt(stats.heart || stats.heartCount)
          };
        }
      }
    }

    // Last resort: Try regex extraction (less reliable)
    const followerMatch = html.match(/"followerCount[\"']?\s*:\s*(\d+)/i);
    const followingMatch = html.match(/"followingCount[\"']?\s*:\s*(\d+)/i);
    const videoMatch = html.match(/"videoCount[\"']?\s*:\s*(\d+)/i);
    const likesMatch = html.match(/"heart(?:Count)?[\"']?\s*:\s*(\d+)/i);
    const nicknameMatch = html.match(/"nickname[\"']?\s*:\s*[\"']([^\"']+)[\"']/i);
    const signatureMatch = html.match(/"signature[\"']?\s*:\s*[\"']([^\"']*)[\"']/i);
    const avatarMatch = html.match(/"avatarLarger[\"']?\s*:\s*[\"']([^\"']+)[\"']/i);
    const verifiedMatch = html.match(/"verified[\"']?\s*:\s*(true|false)/i);

    if (followerMatch || videoMatch) {
      return {
        username,
        nickname: nicknameMatch?.[1] || username,
        signature: signatureMatch?.[1] || '',
        avatarUrl: avatarMatch?.[1] || '',
        verified: verifiedMatch?.[1] === 'true',
        followerCount: followerMatch ? parseMetricBigInt(followerMatch[1]) : BigInt(0),
        followingCount: followingMatch ? parseMetricBigInt(followingMatch[1]) : BigInt(0),
        videoCount: videoMatch ? parseMetricBigInt(videoMatch[1]) : BigInt(0),
        likesCount: likesMatch ? parseMetricBigInt(likesMatch[1]) : BigInt(0)
      };
    }

    // Log what we found for debugging
    console.log('[TikTok Scraper] Script tags found:', {
      universal: html.includes('__UNIVERSAL_DATA_FOR_REHYDRATION__'),
      sigi: html.includes('SIGI_STATE'),
      followerCount: html.includes('followerCount'),
    });
    
    // Save first 2000 chars for debugging if needed
    console.log('[TikTok Scraper] HTML preview:', html.substring(0, 500).replace(/\s+/g, ' '));

    throw new Error('Could not parse TikTok profile data from HTML - structure may have changed');

  } catch (error) {
    console.error(`[TikTok Scraper] Error scraping profile @${username}:`, error);
    throw new Error(`Failed to scrape TikTok profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract username from TikTok URL
 */
export function extractUsernameFromUrl(url: string): string | null {
  try {
    // Match patterns like:
    // https://www.tiktok.com/@username
    // https://tiktok.com/@username/video/123456
    // @username
    
    const match = url.match(/@([a-zA-Z0-9_.]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
