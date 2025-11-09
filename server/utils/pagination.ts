import { sql, type SQL } from "drizzle-orm";
import { type SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "../sqlite-service";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    offset: number;
  };
}

/**
 * Simplified pagination helper for Drizzle queries
 */
export async function paginateQuery<T>(
  dataQuery: Promise<T[]>,
  countQuery: Promise<{ count: number }[]>,
  params: PaginationParams = {}
): Promise<PaginationResult<T>> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 20)); // Max 100 items per page
  const offset = (page - 1) * limit;

  // Execute both queries in parallel
  const [data, totalCountResult] = await Promise.all([
    dataQuery,
    countQuery
  ]);

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      offset
    }
  };
}

/**
 * Helper to create pagination parameters from query
 */
export function getPaginationParams(query: Record<string, any>): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = Math.max(1, Number(query.page || "1"));
  const limit = Math.max(1, Math.min(100, Number(query.limit || "20")));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}