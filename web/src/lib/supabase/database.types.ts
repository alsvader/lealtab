
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "cliente_negocio": {
                  Row: {
                    "acepto_aviso_ts": string,"alta_ts": string,"id": string,"identidad_id": string,"negocio_id": string,"nombre": string
                  }
                  ComputedFields: never
                  Insert: {
                    "acepto_aviso_ts": string,"alta_ts"?: string,"id"?: string,"identidad_id": string,"negocio_id": string,"nombre": string
                  }
                  Update: {
                    "acepto_aviso_ts"?: string,"alta_ts"?: string,"id"?: string,"identidad_id"?: string,"negocio_id"?: string,"nombre"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "cliente_negocio_identidad_id_fkey"
      columns: ["identidad_id"]
isOneToOne: false
      referencedRelation: "identidad"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "cliente_negocio_negocio_id_fkey"
      columns: ["negocio_id"]
isOneToOne: false
      referencedRelation: "negocio"
      referencedColumns: ["id"]
    }
                  ]
                },"codigo_intento": {
                  Row: {
                    "creado_ts": string,"flujo_id": string | null,"id": number,"resultado": string,"telefono": string
                  }
                  ComputedFields: never
                  Insert: {
                    "creado_ts"?: string,"flujo_id"?: string | null,"id"?: never,"resultado": string,"telefono": string
                  }
                  Update: {
                    "creado_ts"?: string,"flujo_id"?: string | null,"id"?: never,"resultado"?: string,"telefono"?: string
                  }
                  Relationships: [
                    
                  ]
                },"config_plataforma": {
                  Row: {
                    "actualizado_ts": string,"clave": string,"valor": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "actualizado_ts"?: string,"clave": string,"valor": NonNullable<Json>
                  }
                  Update: {
                    "actualizado_ts"?: string,"clave"?: string,"valor"?: NonNullable<Json>
                  }
                  Relationships: [
                    
                  ]
                },"cuenta_pendiente_borrado": {
                  Row: {
                    "auth_user_id": string,"creado_ts": string,"intentos": number,"ultimo_error": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "auth_user_id": string,"creado_ts"?: string,"intentos"?: number,"ultimo_error"?: string | null
                  }
                  Update: {
                    "auth_user_id"?: string,"creado_ts"?: string,"intentos"?: number,"ultimo_error"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"dueno_negocio": {
                  Row: {
                    "creado_ts": string,"negocio_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "creado_ts"?: string,"negocio_id": string,"user_id": string
                  }
                  Update: {
                    "creado_ts"?: string,"negocio_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "dueno_negocio_negocio_id_fkey"
      columns: ["negocio_id"]
isOneToOne: false
      referencedRelation: "negocio"
      referencedColumns: ["id"]
    }
                  ]
                },"envio_codigo": {
                  Row: {
                    "canal": string | null,"canal_intencion": string,"creado_ts": string,"flujo_id": string | null,"hook_ts": string | null,"id": number,"ip_hash": string | null,"motivo_rechazo": string | null,"proposito": string,"request_id": string | null,"resultado": string,"telefono": string
                  }
                  ComputedFields: never
                  Insert: {
                    "canal"?: string | null,"canal_intencion"?: string,"creado_ts"?: string,"flujo_id"?: string | null,"hook_ts"?: string | null,"id"?: never,"ip_hash"?: string | null,"motivo_rechazo"?: string | null,"proposito": string,"request_id"?: string | null,"resultado"?: string,"telefono": string
                  }
                  Update: {
                    "canal"?: string | null,"canal_intencion"?: string,"creado_ts"?: string,"flujo_id"?: string | null,"hook_ts"?: string | null,"id"?: never,"ip_hash"?: string | null,"motivo_rechazo"?: string | null,"proposito"?: string,"request_id"?: string | null,"resultado"?: string,"telefono"?: string
                  }
                  Relationships: [
                    
                  ]
                },"evento_uso": {
                  Row: {
                    "emisor": string,"evento_uuid": string | null,"flujo_id": string | null,"id": number,"identidad_id": string | null,"negocio_id": string | null,"nombre": string,"ocurrido_ts": string,"props": NonNullable<Json>,"version_producto": string
                  }
                  ComputedFields: never
                  Insert: {
                    "emisor": string,"evento_uuid"?: string | null,"flujo_id"?: string | null,"id"?: never,"identidad_id"?: string | null,"negocio_id"?: string | null,"nombre": string,"ocurrido_ts"?: string,"props"?: NonNullable<Json>,"version_producto": string
                  }
                  Update: {
                    "emisor"?: string,"evento_uuid"?: string | null,"flujo_id"?: string | null,"id"?: never,"identidad_id"?: string | null,"negocio_id"?: string | null,"nombre"?: string,"ocurrido_ts"?: string,"props"?: NonNullable<Json>,"version_producto"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "evento_uso_identidad_id_fkey"
      columns: ["identidad_id"]
isOneToOne: false
      referencedRelation: "identidad"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "evento_uso_negocio_id_fkey"
      columns: ["negocio_id"]
isOneToOne: false
      referencedRelation: "negocio"
      referencedColumns: ["id"]
    }
                  ]
                },"identidad": {
                  Row: {
                    "auth_user_id": string,"creada_ts": string,"id": string,"verificado_ts": string,"whatsapp": string
                  }
                  ComputedFields: never
                  Insert: {
                    "auth_user_id": string,"creada_ts"?: string,"id"?: string,"verificado_ts": string,"whatsapp": string
                  }
                  Update: {
                    "auth_user_id"?: string,"creada_ts"?: string,"id"?: string,"verificado_ts"?: string,"whatsapp"?: string
                  }
                  Relationships: [
                    
                  ]
                },"install_token": {
                  Row: {
                    "creado_ts": string,"id": string,"identidad_id": string,"token_hash": string,"usado_ts": string | null,"vence_ts": string
                  }
                  ComputedFields: never
                  Insert: {
                    "creado_ts"?: string,"id"?: string,"identidad_id": string,"token_hash": string,"usado_ts"?: string | null,"vence_ts": string
                  }
                  Update: {
                    "creado_ts"?: string,"id"?: string,"identidad_id"?: string,"token_hash"?: string,"usado_ts"?: string | null,"vence_ts"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "install_token_identidad_id_fkey"
      columns: ["identidad_id"]
isOneToOne: false
      referencedRelation: "identidad"
      referencedColumns: ["id"]
    }
                  ]
                },"intento_acceso_dueno": {
                  Row: {
                    "correo": string,"creado_ts": string,"id": number,"ip_hash": string | null,"metodo": string,"resultado": string
                  }
                  ComputedFields: never
                  Insert: {
                    "correo": string,"creado_ts"?: string,"id"?: never,"ip_hash"?: string | null,"metodo": string,"resultado": string
                  }
                  Update: {
                    "correo"?: string,"creado_ts"?: string,"id"?: never,"ip_hash"?: string | null,"metodo"?: string,"resultado"?: string
                  }
                  Relationships: [
                    
                  ]
                },"negocio": {
                  Row: {
                    "alta_ts": string | null,"ciudad": string,"color": string | null,"correo_dueno": string,"creado_ts": string,"estado": string,"fin_prueba": string | null,"giro": string,"id": string,"logo_path": string | null,"nombre": string,"plan": string,"slug": string,"tanda": number | null,"version_producto": string | null,"whatsapp": string,"zona_horaria": string
                  }
                  ComputedFields: never
                  Insert: {
                    "alta_ts"?: string | null,"ciudad": string,"color"?: string | null,"correo_dueno": string,"creado_ts"?: string,"estado"?: string,"fin_prueba"?: string | null,"giro": string,"id"?: string,"logo_path"?: string | null,"nombre": string,"plan"?: string,"slug": string,"tanda"?: number | null,"version_producto"?: string | null,"whatsapp": string,"zona_horaria"?: string
                  }
                  Update: {
                    "alta_ts"?: string | null,"ciudad"?: string,"color"?: string | null,"correo_dueno"?: string,"creado_ts"?: string,"estado"?: string,"fin_prueba"?: string | null,"giro"?: string,"id"?: string,"logo_path"?: string | null,"nombre"?: string,"plan"?: string,"slug"?: string,"tanda"?: number | null,"version_producto"?: string | null,"whatsapp"?: string,"zona_horaria"?: string
                  }
                  Relationships: [
                    
                  ]
                },"tarjeta_cliente": {
                  Row: {
                    "cliente_negocio_id": string,"creada_ts": string,"id": string,"meta_ciclo": number,"negocio_id": string,"sellos": number,"ultima_visita_ts": string | null,"ultimo_sello_ts": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "cliente_negocio_id": string,"creada_ts"?: string,"id"?: string,"meta_ciclo": number,"negocio_id": string,"sellos"?: number,"ultima_visita_ts"?: string | null,"ultimo_sello_ts"?: string | null
                  }
                  Update: {
                    "cliente_negocio_id"?: string,"creada_ts"?: string,"id"?: string,"meta_ciclo"?: number,"negocio_id"?: string,"sellos"?: number,"ultima_visita_ts"?: string | null,"ultimo_sello_ts"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "tarjeta_cliente_cliente_negocio_fk"
      columns: ["cliente_negocio_id","negocio_id"]
isOneToOne: false
      referencedRelation: "cliente_del_negocio"
      referencedColumns: ["id","negocio_id"]
    },{
      foreignKeyName: "tarjeta_cliente_cliente_negocio_fk"
      columns: ["cliente_negocio_id","negocio_id"]
isOneToOne: false
      referencedRelation: "cliente_negocio"
      referencedColumns: ["id","negocio_id"]
    },{
      foreignKeyName: "tarjeta_cliente_negocio_id_fkey"
      columns: ["negocio_id"]
isOneToOne: false
      referencedRelation: "negocio"
      referencedColumns: ["id"]
    }
                  ]
                },"tarjeta_config": {
                  Row: {
                    "actualizado_ts": string,"limite_minutos": number | null,"limite_modo": string,"negocio_id": string,"recompensa": string,"sello_bienvenida": boolean,"sellos_meta": number
                  }
                  ComputedFields: never
                  Insert: {
                    "actualizado_ts"?: string,"limite_minutos"?: number | null,"limite_modo"?: string,"negocio_id": string,"recompensa": string,"sello_bienvenida"?: boolean,"sellos_meta"?: number
                  }
                  Update: {
                    "actualizado_ts"?: string,"limite_minutos"?: number | null,"limite_modo"?: string,"negocio_id"?: string,"recompensa"?: string,"sello_bienvenida"?: boolean,"sellos_meta"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "tarjeta_config_negocio_id_fkey"
      columns: ["negocio_id"]
isOneToOne: true
      referencedRelation: "negocio"
      referencedColumns: ["id"]
    }
                  ]
                },"tarjeta_llave": {
                  Row: {
                    "creada_ts": string,"llave_hmac": string,"tarjeta_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "creada_ts"?: string,"llave_hmac": string,"tarjeta_id": string
                  }
                  Update: {
                    "creada_ts"?: string,"llave_hmac"?: string,"tarjeta_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "tarjeta_llave_tarjeta_id_fkey"
      columns: ["tarjeta_id"]
isOneToOne: true
      referencedRelation: "mis_tarjetas"
      referencedColumns: ["tarjeta_id"]
    },{
      foreignKeyName: "tarjeta_llave_tarjeta_id_fkey"
      columns: ["tarjeta_id"]
isOneToOne: true
      referencedRelation: "tarjeta_cliente"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "cliente_del_negocio": {
                  Row: {
                    "alta_ts": string | null,"id": string | null,"negocio_id": string | null,"nombre": string | null,"whatsapp": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "cliente_negocio_negocio_id_fkey"
      columns: ["negocio_id"]
isOneToOne: false
      referencedRelation: "negocio"
      referencedColumns: ["id"]
    }
                  ]
                },"mis_tarjetas": {
                  Row: {
                    "acepto_aviso_ts": string | null,"alta_ts": string | null,"cliente_nombre": string | null,"estado_negocio": string | null,"limite_minutos": number | null,"limite_modo": string | null,"logo_path": string | null,"meta_ciclo": number | null,"negocio_nombre": string | null,"recompensa": string | null,"sellos": number | null,"slug": string | null,"tarjeta_id": string | null,"ultima_visita_ts": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                },"negocio_publico": {
                  Row: {
                    "color": string | null,"limite_minutos": number | null,"limite_modo": string | null,"logo_path": string | null,"nombre": string | null,"recompensa": string | null,"sello_bienvenida": boolean | null,"sellos_meta": number | null,"slug": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                }
          }
          Functions: {
            [_ in never]: never
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"servidor": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            [_ in never]: never
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        },"servidor": {
          Enums: {
            
          }
        }
} as const
