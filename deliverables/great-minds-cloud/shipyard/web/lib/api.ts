/**
 * API Client for Shipyard frontend
 * Handles all communication with backend services
 */

import type { Project, AgentActivity, Deliverable } from './db/schema';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface SubmitProjectPayload {
  title: string;
  description: string;
  prdContent: string;
  tier: 'starter' | 'standard' | 'enterprise';
}

interface ProjectStatus {
  project: Project;
  activities: AgentActivity[];
  deliverables: Deliverable[];
  currentAgent?: {
    role: string;
    name: string;
    action: string;
  };
  progress: {
    percentage: number;
    stage: string;
    estimatedTimeRemaining?: number;
  };
}

interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

class ShipyardApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `Request failed with status ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Submit a new project PRD
   */
  async submitProject(payload: SubmitProjectPayload): Promise<ApiResponse<Project>> {
    return this.request<Project>('/api/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get project status with recent activities (polling endpoint)
   */
  async getProjectStatus(projectId: string): Promise<ApiResponse<ProjectStatus>> {
    return this.request<ProjectStatus>(`/api/status/${projectId}`);
  }

  /**
   * Create Stripe checkout session
   */
  async createCheckoutSession(projectId: string): Promise<ApiResponse<CheckoutSession>> {
    return this.request<CheckoutSession>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ projectId }),
    });
  }

  /**
   * Get user's projects list
   */
  async getUserProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>('/api/projects');
  }

  /**
   * Get project deliverables
   */
  async getDeliverables(projectId: string): Promise<ApiResponse<Deliverable[]>> {
    return this.request<Deliverable[]>(`/api/projects/${projectId}/deliverables`);
  }

  /**
   * Download all deliverables as ZIP
   */
  async downloadAllDeliverables(projectId: string): Promise<string> {
    return `${API_BASE}/api/projects/${projectId}/download`;
  }

  /**
   * Validate PRD content before submission
   */
  async validatePrd(content: string): Promise<ApiResponse<{
    valid: boolean;
    issues: string[];
    suggestions: string[];
    estimatedTier: 'starter' | 'standard' | 'enterprise';
  }>> {
    return this.request('/api/validate-prd', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  /**
   * Get pricing information
   */
  async getPricing(): Promise<ApiResponse<{
    starter: { price: number; features: string[] };
    standard: { price: number; features: string[] };
    enterprise: { price: number; features: string[] };
  }>> {
    return this.request('/api/pricing');
  }
}

export const api = new ShipyardApi();

export type {
  ApiResponse,
  SubmitProjectPayload,
  ProjectStatus,
  CheckoutSession
};
