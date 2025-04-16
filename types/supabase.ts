export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
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
          items?: Json
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
          items?: Json
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
          items?: Json
          created_at?: string
          updated_at?: string
        }
      }
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
          response_data?: Json
          error_code?: string
          error_message?: string
          created_at: string
          completed_at?: string
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
          response_data?: Json
          error_code?: string
          error_message?: string
          created_at?: string
          completed_at?: string
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
          response_data?: Json
          error_code?: string
          error_message?: string
          created_at?: string
          completed_at?: string
        }
      }
    }
  }
}
