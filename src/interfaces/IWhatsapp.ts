/* eslint-disable @typescript-eslint/no-unused-vars */
export interface WhatsAppBusinessAccount {
  object: 'whatsapp_business_account';
  entry: WhatsAppBusinessEntry[];
}

export interface WhatsAppBusinessEntry {
  id: string;
  changes: WhatsAppBusinessChange[];
}

export interface WhatsAppBusinessChange {
  value: {
    messaging_product: string;
    metadata: {
      display_phone_number: string;
      phone_number_id: string;
    };
    contacts?: WhatsAppBusinessContact[];
    messages?: WhatsAppBusinessMessage[];
    statuses?: WhatsAppBusinessStatus[];
  };
  field: string;
}

export interface WhatsAppBusinessContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

export interface WhatsAppBusinessMessage {
  from: string;
  id: string;
  timestamp: number;
  text?: {
    body: string;
  };
  type: string;
  audio?: {
    mime_type: string;
    sha256: string;
    id: string;
    voice: boolean;
  };
  image?: {
    mime_type: string;
    sha256: string;
    id: string;
  };
  context?: {
    from: string;
    id: string;
  };
  button?: {
    payload: string;
    text: string;
  };
  interactive?: {
    type: string;
    button_reply?: {
      id: string;
      title: string;
    };
    // Adicione outras propriedades interativas conforme necessário
  };
}

export interface WhatsAppBusinessStatus {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
  conversation?: {
    id: string;
    origin: {
      type: string;
    };
  };
  pricing?: {
    billable: boolean;
    pricing_model: string;
    category: string;
  };
  errors?: WhatsAppBusinessError[];
}

export interface WhatsAppBusinessError {
  code: number;
  title: string;
  message: string;
  error_data: {
    details: string;
  };
  href: string;
}
