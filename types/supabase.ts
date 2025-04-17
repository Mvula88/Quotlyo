export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          company: string | null
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          company?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          client_id: string | null
          amount: number
          status: string
          issue_date: string
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          client_id?: string | null
          amount: number
          status?: string
          issue_date: string
          due_date: string
          created_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          client_id?: string | null
          amount?: number
          status?: string
          issue_date?: string
          due_date?: string
          created_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          invoice_id: string
          transaction_id: string
          amount: number
          currency: string
          status: string
          gateway: string
          metadata: Json
          response_data?: Json | null
          error_code?: string | null
          error_message?: string | null
          created_at: string
          completed_at?: string | null
        }
        Insert: {
          id?: string
          invoice_id: string
          transaction_id: string
          amount: number
          currency: string
          status: string
          gateway: string
          metadata: Json
          response_data?: Json | null
          error_code?: string | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          invoice_id?: string
          transaction_id?: string
          amount?: number
          currency?: string
          status?: string
          gateway?: string
          metadata?: Json
          response_data?: Json | null
          error_code?: string | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
    }
  }
}
