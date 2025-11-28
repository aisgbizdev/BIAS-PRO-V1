import { 
  type Session, type InsertSession, 
  type Analysis, type InsertAnalysis, 
  type Chat, type InsertChat,
  type TiktokAccount, type InsertTiktokAccount,
  type TiktokVideo, type InsertTiktokVideo,
  type TiktokComparison, type InsertTiktokComparison,
  type LibraryContribution, type InsertLibraryContribution,
  type PageView, type InsertPageView,
  type FeatureUsage, type InsertFeatureUsage,
  type AdminSession, type InsertAdminSession,
  type Brand, type InsertBrand,
  adminSessions,
  brands
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "../db";
import { eq, lt, and, gt } from "drizzle-orm";

export interface IStorage {
  // Session management
  getSession(sessionId: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | undefined>;
  
  // Analysis history
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysesBySession(sessionId: string): Promise<Analysis[]>;
  
  // Chat history
  createChat(chat: InsertChat): Promise<Chat>;
  getChatsBySession(sessionId: string): Promise<Chat[]>;
  clearChatsBySession(sessionId: string): Promise<void>;

  // TikTok account management
  createTiktokAccount(account: InsertTiktokAccount): Promise<TiktokAccount>;
  getTiktokAccount(id: string): Promise<TiktokAccount | undefined>;
  getTiktokAccountByUsername(username: string): Promise<TiktokAccount | undefined>;
  getTiktokAccountsBySession(sessionId: string): Promise<TiktokAccount[]>;
  updateTiktokAccount(id: string, updates: Partial<TiktokAccount>): Promise<TiktokAccount | undefined>;

  // TikTok video management
  createTiktokVideo(video: InsertTiktokVideo): Promise<TiktokVideo>;
  getTiktokVideo(id: string): Promise<TiktokVideo | undefined>;
  getTiktokVideosBySession(sessionId: string): Promise<TiktokVideo[]>;
  getTiktokVideosByAccount(accountUsername: string): Promise<TiktokVideo[]>;

  // TikTok comparison management
  createTiktokComparison(comparison: InsertTiktokComparison): Promise<TiktokComparison>;
  getTiktokComparison(id: string): Promise<TiktokComparison | undefined>;
  getTiktokComparisonsBySession(sessionId: string): Promise<TiktokComparison[]>;

  // Library contribution management
  createLibraryContribution(contribution: InsertLibraryContribution): Promise<LibraryContribution>;
  getLibraryContribution(id: string): Promise<LibraryContribution | undefined>;
  getPendingContributions(): Promise<LibraryContribution[]>;
  getApprovedContributions(): Promise<LibraryContribution[]>;
  updateLibraryContribution(id: string, updates: Partial<LibraryContribution>): Promise<LibraryContribution | undefined>;
  deleteLibraryContribution(id: string): Promise<boolean>;

  // Deleted library items tracking (for original library content)
  addDeletedLibraryItem(itemId: string): Promise<void>;
  removeDeletedLibraryItem(itemId: string): Promise<void>;
  getDeletedLibraryItems(): Promise<string[]>;
  isLibraryItemDeleted(itemId: string): Promise<boolean>;

  // Analytics tracking
  trackPageView(pageView: InsertPageView): Promise<PageView>;
  trackFeatureUsage(usage: InsertFeatureUsage): Promise<FeatureUsage>;
  getPageViewStats(days?: number): Promise<{ page: string; count: number; language?: string }[]>;
  getFeatureUsageStats(days?: number): Promise<{ featureType: string; count: number; platform?: string }[]>;
  getUniqueSessionsCount(days?: number): Promise<number>;
  getTotalPageViews(days?: number): Promise<number>;
  getTotalFeatureUsage(days?: number): Promise<number>;

  // Admin session management
  createAdminSession(sessionId: string, username: string): Promise<{ sessionId: string; username: string; createdAt: Date; expiresAt: Date }>;
  getAdminSession(sessionId: string): Promise<{ sessionId: string; username: string; createdAt: Date; expiresAt: Date } | undefined>;
  deleteAdminSession(sessionId: string): Promise<void>;
  cleanExpiredAdminSessions(): Promise<void>;

  // Brand management (white-label partners)
  createBrand(brand: InsertBrand): Promise<Brand>;
  getBrand(id: string): Promise<Brand | undefined>;
  getBrandBySlug(slug: string): Promise<Brand | undefined>;
  getAllBrands(): Promise<Brand[]>;
  getActiveBrands(): Promise<Brand[]>;
  updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | undefined>;
  deleteBrand(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;
  private analyses: Map<string, Analysis>;
  private chats: Map<string, Chat>;
  private tiktokAccounts: Map<string, TiktokAccount>;
  private tiktokVideos: Map<string, TiktokVideo>;
  private tiktokComparisons: Map<string, TiktokComparison>;
  private libraryContributions: Map<string, LibraryContribution>;
  private deletedLibraryItems: Set<string>;
  private pageViews: Map<string, PageView>;
  private featureUsages: Map<string, FeatureUsage>;
  private adminSessions: Map<string, { sessionId: string; username: string; createdAt: Date; expiresAt: Date }>;
  private brandsMap: Map<string, Brand>;

  constructor() {
    this.sessions = new Map();
    this.analyses = new Map();
    this.chats = new Map();
    this.tiktokAccounts = new Map();
    this.tiktokVideos = new Map();
    this.tiktokComparisons = new Map();
    this.libraryContributions = new Map();
    this.deletedLibraryItems = new Set();
    this.pageViews = new Map();
    this.featureUsages = new Map();
    this.adminSessions = new Map();
    this.brandsMap = new Map();
  }

  // Session methods
  async getSession(sessionId: string): Promise<Session | undefined> {
    return Array.from(this.sessions.values()).find(s => s.sessionId === sessionId);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const now = new Date();
    const session: Session = {
      sessionId: insertSession.sessionId,
      tokensRemaining: insertSession.tokensRemaining ?? 100,
      freeRequestsUsed: insertSession.freeRequestsUsed ?? 0,
      id,
      createdAt: now,
      lastActiveAt: now,
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = await this.getSession(sessionId);
    if (!session) return undefined;
    
    const updated: Session = {
      ...session,
      ...updates,
      lastActiveAt: new Date(),
    };
    this.sessions.set(session.id, updated);
    return updated;
  }

  // Analysis methods
  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysesBySession(sessionId: string): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .filter(a => a.sessionId === sessionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Chat methods
  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = randomUUID();
    const chat: Chat = {
      ...insertChat,
      id,
      createdAt: new Date(),
    };
    this.chats.set(id, chat);
    return chat;
  }

  async getChatsBySession(sessionId: string): Promise<Chat[]> {
    return Array.from(this.chats.values())
      .filter(c => c.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async clearChatsBySession(sessionId: string): Promise<void> {
    const chatIds = Array.from(this.chats.entries())
      .filter(([_, chat]) => chat.sessionId === sessionId)
      .map(([id, _]) => id);
    
    chatIds.forEach(id => this.chats.delete(id));
  }

  // TikTok Account methods
  async createTiktokAccount(insertAccount: InsertTiktokAccount): Promise<TiktokAccount> {
    const id = randomUUID();
    const now = new Date();
    const account: TiktokAccount = {
      sessionId: insertAccount.sessionId,
      username: insertAccount.username,
      displayName: insertAccount.displayName ?? null,
      followers: insertAccount.followers ?? 0,
      following: insertAccount.following ?? 0,
      totalLikes: insertAccount.totalLikes ?? 0,
      totalVideos: insertAccount.totalVideos ?? 0,
      bio: insertAccount.bio ?? null,
      verified: insertAccount.verified ?? false,
      avatarUrl: insertAccount.avatarUrl ?? null,
      engagementRate: insertAccount.engagementRate ?? null,
      avgViews: insertAccount.avgViews ?? null,
      postingFrequency: insertAccount.postingFrequency ?? null,
      analysisResult: insertAccount.analysisResult ?? null,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.tiktokAccounts.set(id, account);
    return account;
  }

  async getTiktokAccount(id: string): Promise<TiktokAccount | undefined> {
    return this.tiktokAccounts.get(id);
  }

  async getTiktokAccountByUsername(username: string): Promise<TiktokAccount | undefined> {
    return Array.from(this.tiktokAccounts.values())
      .find(a => a.username.toLowerCase() === username.toLowerCase());
  }

  async getTiktokAccountsBySession(sessionId: string): Promise<TiktokAccount[]> {
    return Array.from(this.tiktokAccounts.values())
      .filter(a => a.sessionId === sessionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateTiktokAccount(id: string, updates: Partial<TiktokAccount>): Promise<TiktokAccount | undefined> {
    const account = await this.getTiktokAccount(id);
    if (!account) return undefined;

    const updated: TiktokAccount = {
      ...account,
      ...updates,
      updatedAt: new Date(),
    };
    this.tiktokAccounts.set(id, updated);
    return updated;
  }

  // TikTok Video methods
  async createTiktokVideo(insertVideo: InsertTiktokVideo): Promise<TiktokVideo> {
    const id = randomUUID();
    const video: TiktokVideo = {
      sessionId: insertVideo.sessionId,
      videoId: insertVideo.videoId,
      videoUrl: insertVideo.videoUrl ?? null,
      accountUsername: insertVideo.accountUsername,
      description: insertVideo.description ?? null,
      views: insertVideo.views ?? 0,
      likes: insertVideo.likes ?? 0,
      comments: insertVideo.comments ?? 0,
      shares: insertVideo.shares ?? 0,
      favorites: insertVideo.favorites ?? 0,
      duration: insertVideo.duration ?? null,
      soundName: insertVideo.soundName ?? null,
      hashtags: insertVideo.hashtags ?? null,
      completionRate: insertVideo.completionRate ?? null,
      analysisResult: insertVideo.analysisResult ?? null,
      postedAt: insertVideo.postedAt ?? null,
      id,
      createdAt: new Date(),
    };
    this.tiktokVideos.set(id, video);
    return video;
  }

  async getTiktokVideo(id: string): Promise<TiktokVideo | undefined> {
    return this.tiktokVideos.get(id);
  }

  async getTiktokVideosBySession(sessionId: string): Promise<TiktokVideo[]> {
    return Array.from(this.tiktokVideos.values())
      .filter(v => v.sessionId === sessionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTiktokVideosByAccount(accountUsername: string): Promise<TiktokVideo[]> {
    return Array.from(this.tiktokVideos.values())
      .filter(v => v.accountUsername.toLowerCase() === accountUsername.toLowerCase())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // TikTok Comparison methods
  async createTiktokComparison(insertComparison: InsertTiktokComparison): Promise<TiktokComparison> {
    const id = randomUUID();
    const comparison: TiktokComparison = {
      ...insertComparison,
      id,
      createdAt: new Date(),
    };
    this.tiktokComparisons.set(id, comparison);
    return comparison;
  }

  async getTiktokComparison(id: string): Promise<TiktokComparison | undefined> {
    return this.tiktokComparisons.get(id);
  }

  async getTiktokComparisonsBySession(sessionId: string): Promise<TiktokComparison[]> {
    return Array.from(this.tiktokComparisons.values())
      .filter(c => c.sessionId === sessionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Library Contribution methods
  async createLibraryContribution(insertContribution: InsertLibraryContribution): Promise<LibraryContribution> {
    const id = randomUUID();
    const contribution: LibraryContribution = {
      term: insertContribution.term,
      termId: insertContribution.termId ?? null,
      definition: insertContribution.definition,
      definitionId: insertContribution.definitionId ?? null,
      platform: insertContribution.platform,
      username: insertContribution.username,
      example: insertContribution.example ?? null,
      exampleId: insertContribution.exampleId ?? null,
      status: insertContribution.status ?? "pending",
      id,
      createdAt: new Date(),
      approvedAt: null,
    };
    this.libraryContributions.set(id, contribution);
    return contribution;
  }

  async getLibraryContribution(id: string): Promise<LibraryContribution | undefined> {
    return this.libraryContributions.get(id);
  }

  async getPendingContributions(): Promise<LibraryContribution[]> {
    return Array.from(this.libraryContributions.values())
      .filter(c => c.status === 'pending')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getApprovedContributions(): Promise<LibraryContribution[]> {
    return Array.from(this.libraryContributions.values())
      .filter(c => c.status === 'approved')
      .sort((a, b) => (b.approvedAt?.getTime() ?? 0) - (a.approvedAt?.getTime() ?? 0));
  }

  async updateLibraryContribution(id: string, updates: Partial<LibraryContribution>): Promise<LibraryContribution | undefined> {
    const contribution = this.libraryContributions.get(id);
    if (!contribution) return undefined;

    const updated: LibraryContribution = {
      ...contribution,
      ...updates,
    };
    this.libraryContributions.set(id, updated);
    return updated;
  }

  async deleteLibraryContribution(id: string): Promise<boolean> {
    return this.libraryContributions.delete(id);
  }

  // Deleted library items methods
  async addDeletedLibraryItem(itemId: string): Promise<void> {
    this.deletedLibraryItems.add(itemId);
  }

  async removeDeletedLibraryItem(itemId: string): Promise<void> {
    this.deletedLibraryItems.delete(itemId);
  }

  async getDeletedLibraryItems(): Promise<string[]> {
    return Array.from(this.deletedLibraryItems);
  }

  async isLibraryItemDeleted(itemId: string): Promise<boolean> {
    return this.deletedLibraryItems.has(itemId);
  }

  // Analytics methods
  async trackPageView(insertPageView: InsertPageView): Promise<PageView> {
    const id = randomUUID();
    const pageView: PageView = {
      sessionId: insertPageView.sessionId,
      page: insertPageView.page,
      language: insertPageView.language ?? null,
      id,
      createdAt: new Date(),
    };
    this.pageViews.set(id, pageView);
    return pageView;
  }

  async trackFeatureUsage(insertUsage: InsertFeatureUsage): Promise<FeatureUsage> {
    const id = randomUUID();
    const usage: FeatureUsage = {
      sessionId: insertUsage.sessionId,
      featureType: insertUsage.featureType,
      featureDetails: insertUsage.featureDetails ?? null,
      platform: insertUsage.platform ?? null,
      mode: insertUsage.mode ?? null,
      language: insertUsage.language ?? null,
      id,
      createdAt: new Date(),
    };
    this.featureUsages.set(id, usage);
    return usage;
  }

  async getPageViewStats(days: number = 7): Promise<{ page: string; count: number; language?: string }[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const views = Array.from(this.pageViews.values())
      .filter(v => v.createdAt >= cutoff);

    const stats = new Map<string, { count: number; language?: string }>();
    views.forEach(v => {
      const key = `${v.page}|${v.language || 'unknown'}`;
      const existing = stats.get(key) || { count: 0, language: v.language || undefined };
      stats.set(key, { count: existing.count + 1, language: v.language || undefined });
    });

    return Array.from(stats.entries()).map(([key, data]) => ({
      page: key.split('|')[0],
      count: data.count,
      language: data.language,
    }));
  }

  async getFeatureUsageStats(days: number = 7): Promise<{ featureType: string; count: number; platform?: string }[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const usages = Array.from(this.featureUsages.values())
      .filter(u => u.createdAt >= cutoff);

    const stats = new Map<string, { count: number; platform?: string }>();
    usages.forEach(u => {
      const key = `${u.featureType}|${u.platform || 'unknown'}`;
      const existing = stats.get(key) || { count: 0, platform: u.platform || undefined };
      stats.set(key, { count: existing.count + 1, platform: u.platform || undefined });
    });

    return Array.from(stats.entries()).map(([key, data]) => ({
      featureType: key.split('|')[0],
      count: data.count,
      platform: data.platform,
    }));
  }

  async getUniqueSessionsCount(days: number = 7): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const uniqueSessions = new Set(
      Array.from(this.pageViews.values())
        .filter(v => v.createdAt >= cutoff)
        .map(v => v.sessionId)
    );

    return uniqueSessions.size;
  }

  async getTotalPageViews(days: number = 7): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return Array.from(this.pageViews.values())
      .filter(v => v.createdAt >= cutoff)
      .length;
  }

  async getTotalFeatureUsage(days: number = 7): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return Array.from(this.featureUsages.values())
      .filter(u => u.createdAt >= cutoff)
      .length;
  }

  // Admin session methods
  async createAdminSession(sessionId: string, username: string): Promise<{ sessionId: string; username: string; createdAt: Date; expiresAt: Date }> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    const session = {
      sessionId,
      username,
      createdAt: now,
      expiresAt,
    };
    this.adminSessions.set(sessionId, session);
    return session;
  }

  async getAdminSession(sessionId: string): Promise<{ sessionId: string; username: string; createdAt: Date; expiresAt: Date } | undefined> {
    const session = this.adminSessions.get(sessionId);
    
    if (!session) return undefined;
    
    // Check if expired
    if (session.expiresAt < new Date()) {
      this.adminSessions.delete(sessionId);
      return undefined;
    }
    
    return session;
  }

  async deleteAdminSession(sessionId: string): Promise<void> {
    this.adminSessions.delete(sessionId);
  }

  async cleanExpiredAdminSessions(): Promise<void> {
    const now = new Date();
    Array.from(this.adminSessions.entries()).forEach(([sessionId, session]) => {
      if (session.expiresAt < now) {
        this.adminSessions.delete(sessionId);
      }
    });
  }

  // Brand management methods
  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const now = new Date();
    const brand: Brand = {
      id,
      slug: insertBrand.slug,
      name: insertBrand.name,
      shortName: insertBrand.shortName,
      taglineEn: insertBrand.taglineEn ?? "Powered by BiAS²³",
      taglineId: insertBrand.taglineId ?? "Didukung BiAS²³",
      subtitleEn: insertBrand.subtitleEn ?? "Build Your Influence",
      subtitleId: insertBrand.subtitleId ?? "Bangun Pengaruhmu",
      descriptionEn: insertBrand.descriptionEn ?? null,
      descriptionId: insertBrand.descriptionId ?? null,
      colorPrimary: insertBrand.colorPrimary ?? "from-pink-500 via-purple-500 to-cyan-500",
      colorSecondary: insertBrand.colorSecondary ?? "from-purple-500 via-pink-400 to-cyan-400",
      logoUrl: insertBrand.logoUrl ?? null,
      tiktokHandle: insertBrand.tiktokHandle ?? null,
      tiktokUrl: insertBrand.tiktokUrl ?? null,
      instagramHandle: insertBrand.instagramHandle ?? null,
      instagramUrl: insertBrand.instagramUrl ?? null,
      metaTitle: insertBrand.metaTitle ?? null,
      metaDescription: insertBrand.metaDescription ?? null,
      isActive: insertBrand.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.brandsMap.set(id, brand);
    return brand;
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brandsMap.get(id);
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    return Array.from(this.brandsMap.values()).find(b => b.slug === slug);
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brandsMap.values());
  }

  async getActiveBrands(): Promise<Brand[]> {
    return Array.from(this.brandsMap.values()).filter(b => b.isActive);
  }

  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | undefined> {
    const brand = this.brandsMap.get(id);
    if (!brand) return undefined;
    
    const updated: Brand = {
      ...brand,
      ...updates,
      updatedAt: new Date(),
    };
    this.brandsMap.set(id, updated);
    return updated;
  }

  async deleteBrand(id: string): Promise<boolean> {
    return this.brandsMap.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  private memStorage: MemStorage;

  constructor() {
    this.memStorage = new MemStorage();
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.memStorage.getSession(sessionId);
  }

  async createSession(session: InsertSession): Promise<Session> {
    return this.memStorage.createSession(session);
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | undefined> {
    return this.memStorage.updateSession(sessionId, updates);
  }

  async createAnalysis(analysis: InsertAnalysis): Promise<Analysis> {
    return this.memStorage.createAnalysis(analysis);
  }

  async getAnalysesBySession(sessionId: string): Promise<Analysis[]> {
    return this.memStorage.getAnalysesBySession(sessionId);
  }

  async createChat(chat: InsertChat): Promise<Chat> {
    return this.memStorage.createChat(chat);
  }

  async getChatsBySession(sessionId: string): Promise<Chat[]> {
    return this.memStorage.getChatsBySession(sessionId);
  }

  async clearChatsBySession(sessionId: string): Promise<void> {
    return this.memStorage.clearChatsBySession(sessionId);
  }

  async createTiktokAccount(account: InsertTiktokAccount): Promise<TiktokAccount> {
    return this.memStorage.createTiktokAccount(account);
  }

  async getTiktokAccount(id: string): Promise<TiktokAccount | undefined> {
    return this.memStorage.getTiktokAccount(id);
  }

  async getTiktokAccountByUsername(username: string): Promise<TiktokAccount | undefined> {
    return this.memStorage.getTiktokAccountByUsername(username);
  }

  async getTiktokAccountsBySession(sessionId: string): Promise<TiktokAccount[]> {
    return this.memStorage.getTiktokAccountsBySession(sessionId);
  }

  async updateTiktokAccount(id: string, updates: Partial<TiktokAccount>): Promise<TiktokAccount | undefined> {
    return this.memStorage.updateTiktokAccount(id, updates);
  }

  async createTiktokVideo(video: InsertTiktokVideo): Promise<TiktokVideo> {
    return this.memStorage.createTiktokVideo(video);
  }

  async getTiktokVideo(id: string): Promise<TiktokVideo | undefined> {
    return this.memStorage.getTiktokVideo(id);
  }

  async getTiktokVideosBySession(sessionId: string): Promise<TiktokVideo[]> {
    return this.memStorage.getTiktokVideosBySession(sessionId);
  }

  async getTiktokVideosByAccount(accountUsername: string): Promise<TiktokVideo[]> {
    return this.memStorage.getTiktokVideosByAccount(accountUsername);
  }

  async createTiktokComparison(comparison: InsertTiktokComparison): Promise<TiktokComparison> {
    return this.memStorage.createTiktokComparison(comparison);
  }

  async getTiktokComparison(id: string): Promise<TiktokComparison | undefined> {
    return this.memStorage.getTiktokComparison(id);
  }

  async getTiktokComparisonsBySession(sessionId: string): Promise<TiktokComparison[]> {
    return this.memStorage.getTiktokComparisonsBySession(sessionId);
  }

  async createLibraryContribution(contribution: InsertLibraryContribution): Promise<LibraryContribution> {
    return this.memStorage.createLibraryContribution(contribution);
  }

  async getLibraryContribution(id: string): Promise<LibraryContribution | undefined> {
    return this.memStorage.getLibraryContribution(id);
  }

  async getPendingContributions(): Promise<LibraryContribution[]> {
    return this.memStorage.getPendingContributions();
  }

  async getApprovedContributions(): Promise<LibraryContribution[]> {
    return this.memStorage.getApprovedContributions();
  }

  async updateLibraryContribution(id: string, updates: Partial<LibraryContribution>): Promise<LibraryContribution | undefined> {
    return this.memStorage.updateLibraryContribution(id, updates);
  }

  async deleteLibraryContribution(id: string): Promise<boolean> {
    return this.memStorage.deleteLibraryContribution(id);
  }

  async addDeletedLibraryItem(itemId: string): Promise<void> {
    return this.memStorage.addDeletedLibraryItem(itemId);
  }

  async removeDeletedLibraryItem(itemId: string): Promise<void> {
    return this.memStorage.removeDeletedLibraryItem(itemId);
  }

  async getDeletedLibraryItems(): Promise<string[]> {
    return this.memStorage.getDeletedLibraryItems();
  }

  async isLibraryItemDeleted(itemId: string): Promise<boolean> {
    return this.memStorage.isLibraryItemDeleted(itemId);
  }

  async trackPageView(pageView: InsertPageView): Promise<PageView> {
    return this.memStorage.trackPageView(pageView);
  }

  async trackFeatureUsage(usage: InsertFeatureUsage): Promise<FeatureUsage> {
    return this.memStorage.trackFeatureUsage(usage);
  }

  async getPageViewStats(days: number = 7): Promise<{ page: string; count: number; language?: string }[]> {
    return this.memStorage.getPageViewStats(days);
  }

  async getFeatureUsageStats(days: number = 7): Promise<{ featureType: string; count: number; platform?: string }[]> {
    return this.memStorage.getFeatureUsageStats(days);
  }

  async getUniqueSessionsCount(days: number = 7): Promise<number> {
    return this.memStorage.getUniqueSessionsCount(days);
  }

  async getTotalPageViews(days: number = 7): Promise<number> {
    return this.memStorage.getTotalPageViews(days);
  }

  async getTotalFeatureUsage(days: number = 7): Promise<number> {
    return this.memStorage.getTotalFeatureUsage(days);
  }

  async createAdminSession(sessionId: string, username: string): Promise<{ sessionId: string; username: string; createdAt: Date; expiresAt: Date }> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const [inserted] = await db.insert(adminSessions).values({
      sessionId,
      username,
      expiresAt,
    }).returning();

    return {
      sessionId: inserted.sessionId,
      username: inserted.username,
      createdAt: inserted.createdAt,
      expiresAt: inserted.expiresAt,
    };
  }

  async getAdminSession(sessionId: string): Promise<{ sessionId: string; username: string; createdAt: Date; expiresAt: Date } | undefined> {
    const now = new Date();
    
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.sessionId, sessionId),
          gt(adminSessions.expiresAt, now)
        )
      )
      .limit(1);

    if (!session) return undefined;

    return {
      sessionId: session.sessionId,
      username: session.username,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    };
  }

  async deleteAdminSession(sessionId: string): Promise<void> {
    await db
      .delete(adminSessions)
      .where(eq(adminSessions.sessionId, sessionId));
  }

  async cleanExpiredAdminSessions(): Promise<void> {
    const now = new Date();
    await db
      .delete(adminSessions)
      .where(lt(adminSessions.expiresAt, now));
  }

  // Brand management methods (database-backed for persistence)
  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const [inserted] = await db.insert(brands).values(insertBrand).returning();
    return inserted;
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    const [brand] = await db
      .select()
      .from(brands)
      .where(eq(brands.id, id))
      .limit(1);
    return brand;
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    const [brand] = await db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .limit(1);
    return brand;
  }

  async getAllBrands(): Promise<Brand[]> {
    return db.select().from(brands);
  }

  async getActiveBrands(): Promise<Brand[]> {
    return db
      .select()
      .from(brands)
      .where(eq(brands.isActive, true));
  }

  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | undefined> {
    const [updated] = await db
      .update(brands)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(brands.id, id))
      .returning();
    return updated;
  }

  async deleteBrand(id: string): Promise<boolean> {
    const result = await db
      .delete(brands)
      .where(eq(brands.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
