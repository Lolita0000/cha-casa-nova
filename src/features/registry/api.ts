import { supabase } from '@/lib/supabase/client'

import type {
  GiftPublicStatus,
  GiftRecord,
  GiftRecordStatus,
  GiftRegistration,
  GiftMethod,
  Rsvp,
  RsvpRegistration,
} from './types'

export class BackendUnavailableError extends Error {
  constructor() {
    super('O cadastro de presentes ainda não foi configurado.')
  }
}

function requireClient() {
  if (!supabase) throw new BackendUnavailableError()
  return supabase
}

export async function registerGift(registration: GiftRegistration): Promise<string> {
  const { data, error } = await requireClient().rpc('register_gift', {
    p_giver_names: registration.giverNames,
    p_method: registration.method,
    p_items: registration.items.map((item) => ({
      gift_id: item.giftId,
      gift_name: item.giftName,
      amount_cents: item.amountInCents,
    })),
    p_message: registration.message ?? null,
  })
  if (error) throw new Error(error.message)
  return data as string
}

export async function addGiftLetter(recordId: string, message: string): Promise<void> {
  const { error } = await requireClient().rpc('add_gift_letter', {
    p_record_id: recordId,
    p_message: message,
  })
  if (error) throw new Error(error.message)
}

interface PublicStatusRow {
  gift_id: string
  pix_cents: number
  purchase_count: number
}

export async function fetchPublicStatus(): Promise<Map<string, GiftPublicStatus>> {
  const { data, error } = await requireClient().rpc('gift_public_status')
  if (error) throw new Error(error.message)
  return new Map(
    ((data ?? []) as PublicStatusRow[]).map((row) => [
      row.gift_id,
      { pixInCents: Number(row.pix_cents), purchaseCount: Number(row.purchase_count) },
    ]),
  )
}

interface RecordRow {
  id: string
  created_at: string
  giver_names: string[]
  message: string | null
  method: GiftMethod
  total_cents: number
  status: GiftRecordStatus
  gift_record_items: { id: number; gift_id: string; gift_name: string; amount_cents: number }[]
}

function toRecord(row: RecordRow): GiftRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    giverNames: row.giver_names,
    message: row.message,
    method: row.method,
    totalInCents: row.total_cents,
    status: row.status,
    items: row.gift_record_items
      .map((item) => ({
        id: item.id,
        giftId: item.gift_id,
        giftName: item.gift_name,
        amountInCents: item.amount_cents,
      }))
      .sort((a, b) => a.id - b.id),
  }
}

export async function fetchRecords(): Promise<GiftRecord[]> {
  const { data, error } = await requireClient()
    .from('gift_records')
    .select(
      'id, created_at, giver_names, message, method, total_cents, status, gift_record_items (id, gift_id, gift_name, amount_cents)',
    )
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return ((data ?? []) as RecordRow[]).map(toRecord)
}

export async function updateRecordStatus(id: string, status: GiftRecordStatus): Promise<void> {
  const { error } = await requireClient().from('gift_records').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await requireClient().from('gift_records').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function registerRsvp(registration: RsvpRegistration): Promise<string> {
  const { data, error } = await requireClient().rpc('register_rsvp', {
    p_guest_names: registration.guestNames,
    p_attending: registration.attending,
    p_message: registration.message ?? null,
  })
  if (error) throw new Error(error.message)
  return data as string
}

interface RsvpRow {
  id: string
  created_at: string
  guest_names: string[]
  attending: boolean
  message: string | null
}

export async function fetchRsvps(): Promise<Rsvp[]> {
  const { data, error } = await requireClient()
    .from('rsvps')
    .select('id, created_at, guest_names, attending, message')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return ((data ?? []) as RsvpRow[]).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    guestNames: row.guest_names,
    attending: row.attending,
    message: row.message,
  }))
}

export async function deleteRsvp(id: string): Promise<void> {
  const { error } = await requireClient().from('rsvps').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
