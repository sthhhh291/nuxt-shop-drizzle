import {estimate_totals} from '~~/db/schema'
import { db } from '../sqlite-service'

export default defineEventHandler(async (event) => {
  const totals = await db.select().from(estimate_totals).limit(20).orderBy(estimate_totals.id)
  return totals 
})
