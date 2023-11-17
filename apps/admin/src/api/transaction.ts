import { z } from 'zod'

import { createRouter } from './configurations'
import {
  approveWithdrawal,
  getDepositDetail,
  getDepositTransactions,
  getWaitingTransactions,
} from './services/transactions-service'

export const transactionRouter = createRouter()
  .query('getDepositTransactions', {
    input: z.object({
      page: z.string(),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getDepositTransactions(ctx, input)
    },
  })
  .query('getDepositDetail', {
    input: z.object({
      id: z.string(),
      select: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getDepositDetail(ctx, input)
    },
  })
  .query('getWithdrawRequest', {
    input: z.object({
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getWaitingTransactions(ctx, input)
    },
  })
  .mutation('approveWithdrawRequest', {
    input: z.object({
      id: z.string(),
      action: z.any(),
    }),
    resolve: async ({ ctx, input }) => {
      return await approveWithdrawal(input.id, input.action, ctx)
    },
  })
