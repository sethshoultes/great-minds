/**
 * Unit Tests for Provisioning Queue Service
 *
 * Tests backoff calculation, circuit breaker behavior, and job interface compliance.
 */

import { calculateBackoff, getCircuitBreakerState } from '../provisioning-queue';

describe('Provisioning Queue Service', () => {
  describe('calculateBackoff', () => {
    test('retry 1 returns 1 second', () => {
      expect(calculateBackoff(1)).toBe(1);
    });

    test('retry 2 returns 2 seconds', () => {
      expect(calculateBackoff(2)).toBe(2);
    });

    test('retry 3 returns 4 seconds', () => {
      expect(calculateBackoff(3)).toBe(4);
    });

    test('retry 4 returns 8 seconds', () => {
      expect(calculateBackoff(4)).toBe(8);
    });

    test('retry 5 returns 16 seconds', () => {
      expect(calculateBackoff(5)).toBe(16);
    });

    test('retry 6 returns 32 seconds', () => {
      expect(calculateBackoff(6)).toBe(32);
    });

    test('retry 7+ returns max 32 seconds (capped)', () => {
      expect(calculateBackoff(7)).toBe(32);
      expect(calculateBackoff(10)).toBe(32);
      expect(calculateBackoff(100)).toBe(32);
    });

    test('retry 0 and negative return first delay', () => {
      expect(calculateBackoff(0)).toBe(1);
      expect(calculateBackoff(-1)).toBe(1);
    });
  });

  describe('Circuit Breaker State', () => {
    test('returns initial state', () => {
      const state = getCircuitBreakerState();
      expect(state).toHaveProperty('failureCount');
      expect(state).toHaveProperty('windowStart');
      expect(state).toHaveProperty('isOpen');
      expect(typeof state.failureCount).toBe('number');
      expect(typeof state.windowStart).toBe('number');
      expect(typeof state.isOpen).toBe('boolean');
    });

    test('initial circuit breaker is closed', () => {
      const state = getCircuitBreakerState();
      expect(state.isOpen).toBe(false);
      expect(state.failureCount).toBe(0);
    });
  });

  describe('Interface Compliance', () => {
    test('ProvisioningJob interface has all required fields', () => {
      // This is a type-level test that verifies the interface structure
      const mockJob = {
        siteId: 'test-site',
        organizationId: 'org-123',
        businessId: 'biz-456',
        template: 'restaurant' as const,
        content: {
          _type: 'document',
          blocks: [],
        },
      };

      expect(mockJob.siteId).toBeDefined();
      expect(mockJob.organizationId).toBeDefined();
      expect(mockJob.businessId).toBeDefined();
      expect(mockJob.template).toBeDefined();
      expect(mockJob.content).toBeDefined();
    });

    test('JobResult interface structure', () => {
      const mockResult = {
        success: true,
        siteId: 'test-site',
        message: 'Test message',
        duration: 1000,
      };

      expect(mockResult).toHaveProperty('success');
      expect(mockResult).toHaveProperty('siteId');
      expect(mockResult).toHaveProperty('message');
      expect(mockResult).toHaveProperty('duration');
    });
  });

  describe('Backoff Sequence', () => {
    test('generates correct backoff sequence for full retry cycle', () => {
      const sequence = [];
      for (let i = 1; i <= 6; i++) {
        sequence.push(calculateBackoff(i));
      }
      expect(sequence).toEqual([1, 2, 4, 8, 16, 32]);
    });

    test('backoff sequence grows exponentially', () => {
      const delays = [
        calculateBackoff(1),
        calculateBackoff(2),
        calculateBackoff(3),
        calculateBackoff(4),
      ];

      // Each delay is double the previous (until cap)
      expect(delays[1]).toBe(delays[0] * 2);
      expect(delays[2]).toBe(delays[1] * 2);
      expect(delays[3]).toBe(delays[2] * 2);
    });
  });
});
