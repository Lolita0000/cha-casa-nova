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
    p_receipt_path: registration.receiptPath ?? null,
    p_receipt_url: registration.receiptUrl ?? null,
  })
  if (error) throw new Error(error.message)
  return data as string
}

const RECEIPTS_BUCKET = 'receipts'
const RECEIPT_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'application/pdf': 'pdf',
}
export const MAX_RECEIPT_BYTES = 5 * 1024 * 1024
export const RECEIPT_ACCEPT = Object.keys(RECEIPT_EXTENSIONS).join(',')

/** Checks a receipt before uploading it. Returns the problem, or null when it is fine. */
export function validateReceipt(file: File): string | null {
  if (!RECEIPT_EXTENSIONS[file.type]) return 'Envie uma foto ou um PDF do comprovante.'
  if (file.size > MAX_RECEIPT_BYTES) return 'O arquivo passou de 5 MB. Tente um print da tela.'
  return null
}

/** Uploads a Pix receipt under a random name and returns its path. */
export async function uploadReceipt(file: File): Promise<string> {
  const problem = validateReceipt(file)
  if (problem) throw new Error(problem)
  const path = `${crypto.randomUUID()}.${RECEIPT_EXTENSIONS[file.type]}`
  const { error } = await requireClient()
    .storage.from(RECEIPTS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error(error.message)
  return path
}

/** Receipts are named with random UUIDs that only the admin functions reveal. */
export function getReceiptLink(path: string): string {
  return requireClient().storage.from(RECEIPTS_BUCKET).getPublicUrl(path).data.publicUrl
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
  contributed_cents: number
  purchase_count: number
}

export async function fetchPublicStatus(): Promise<Map<string, GiftPublicStatus>> {
  const { data, error } = await requireClient().rpc('gift_public_status')
  if (error) throw new Error(error.message)
  return new Map(
    ((data ?? []) as PublicStatusRow[]).map((row) => [
      row.gift_id,
      {
        contributedInCents: Number(row.contributed_cents),
        purchaseCount: Number(row.purchase_count),
      },
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
  receipt_path: string | null
  receipt_url: string | null
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
    receiptPath: row.receipt_path,
    receiptUrl: row.receipt_url,
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

export async function checkAdminKey(key: string): Promise<boolean> {
  const { data, error } = await requireClient().rpc('admin_check', { p_key: key })
  if (error) throw new Error(error.message)
  return data === true
}

export async function fetchRecords(key: string): Promise<GiftRecord[]> {
  const { data, error } = await requireClient().rpc('admin_records', { p_key: key })
  if (error) throw new Error(error.message)
  return ((data ?? []) as RecordRow[]).map(toRecord)
}

export async function updateRecordStatus(
  key: string,
  id: string,
  status: GiftRecordStatus,
): Promise<void> {
  const { error } = await requireClient().rpc('admin_set_record_status', {
    p_key: key,
    p_id: id,
    p_status: status,
  })
  if (error) throw new Error(error.message)
}

export async function deleteRecord(key: string, id: string): Promise<void> {
  const { error } = await requireClient().rpc('admin_delete_record', { p_key: key, p_id: id })
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

export async function fetchRsvps(key: string): Promise<Rsvp[]> {
  const { data, error } = await requireClient().rpc('admin_rsvps', { p_key: key })
  if (error) throw new Error(error.message)
  return ((data ?? []) as RsvpRow[]).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    guestNames: row.guest_names,
    attending: row.attending,
    message: row.message,
  }))
}

export async function deleteRsvp(key: string, id: string): Promise<void> {
  const { error } = await requireClient().rpc('admin_delete_rsvp', { p_key: key, p_id: id })
  if (error) throw new Error(error.message)
}
