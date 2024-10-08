
export interface LNCheckout {
  id: string;
  verified_pubkey?: string;
  product_template_name?: string;
  invoice?: {
    bolt11: string;
    paid?: boolean;
    label: string;
    connection_params: {
      nodeid: string;
      address: string;
      rune: string;
      ws_proxy_address: string;
    };
  };
  completed: boolean;
}
interface ProductTemplate {
  description: string;
  special_label?: string | null;
  amount_msat: number;
  expiry: number;
}
export type ProductTemplates = Record<string, ProductTemplate>;
