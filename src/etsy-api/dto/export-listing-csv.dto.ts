export const PREFIX_UNIQUE_ETSY = 'et_';
export class ExportListingCsv {
  sku: string;
  category: string;
  title: string;
  description: string;
  vendor: string;
  tags: string;
  prefixEtsyListingId: string;
  quantity: number;
  offerPrice: string;
  actualPrice: string;
  variantShipping?: string;
  variantImage?: string;
  images?: string;
  varianTaxable?: string;
  status?: string;
  [key: string]: any;
}

export class ExportVendorOptions {
  isFullProduct: boolean;
}

export const EXPORT_GOSHOPLOCAL_CSV_FIELDS = [
  {
    label: 'Product Code',
    value: 'sku',
  },
  {
    label: 'Etsy Category',
    value: 'category',
  },
  {
    label: 'Title (Product Name)',
    value: 'title',
  },
  {
    label: 'Body (HTML)',
    value: 'description',
  },
  {
    label: 'Vendor Name',
    value: 'vendor',
  },
  {
    label: 'Tags',
    value: 'tags',
  },
  // {
  //   label: 'Variation Name',
  //   value: 'variation1',
  // },
  // {
  //   label: 'Variation Name',
  //   value: 'variation2',
  // },
  // {
  //   label: 'Variation Name',
  //   value: 'variation3',
  // },
  {
    label: 'Variation Group Code',
    value: 'prefixEtsyListingId', //prefix et
  },
  {
    label: 'Variant Inventory Qty',
    value: 'quantity',
  },
  {
    label: 'Variant Price (Offer Price) ',
    value: 'offerPrice',
  },
  {
    label: 'Variant Compare At Price (Actual Variant Price)',
    value: 'actualPrice',
  },
  {
    label: 'Variant Requires Shipping',
    value: 'variantShipping',
  },
  {
    label: 'Variant Image',
    value: 'variantImage',
  },
  {
    label: 'Images',
    value: 'images',
  },
  {
    label: 'Variant Taxable',
    value: 'varianTaxable',
  },
];
