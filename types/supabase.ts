export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          company: string
          email: string
          phone: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company: string
          email: string
          phone: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
          email?: string
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          number: string
          client: string
          client_id: string
          amount: string
          status: string
          date: string
          due_date: string
          items: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          number: string
          client: string
          client_id: string
          amount: string
          status: string
          date: string
          due_date: string
          items?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          number?: string
          client?: string
          client_id?: string
          amount?: string
          status?: string
          date?: string
          due_date?: string
          items?: Json | null
          created_at?: string
          updated_at?: string
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
          response_data: Json | null
          error_code: string | null
          error_message: string | null
          created_at: string
          completed_at: string | null
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
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
