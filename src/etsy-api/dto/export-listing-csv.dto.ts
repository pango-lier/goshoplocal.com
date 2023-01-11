export class ExportListingCsv {
  sku: string;
  productName: string;
  description: string;
  upc: string;
  images: string[];
  price: string;
  msrp: string;
  quantity: string;
  mpn: string;
  noOfPieces: string;
  category: string;
}

export const EXPORT_GOSHOPLOCAL_CSV_FIELDS = [
  {
    label: 'Sku',
    value: 'sku',
  },
  {
    label: 'Product Name',
    value: 'productName',
  },
  {
    label: 'Description',
    value: 'description',
  },
  {
    label: 'UPC',
    value: 'upc',
  },
  {
    label: 'image1',
    value: 'image1',
  },
  {
    label: 'image2',
    value: 'image2',
  },
  {
    label: 'image3',
    value: 'image3',
  },
  {
    label: 'Price',
    value: 'price',
  },
  {
    label: 'MSRP',
    value: 'msrp',
  },
  {
    label: 'Quantity',
    value: 'quantity',
  },
  {
    label: 'MPN',
    value: 'mnp',
  },
  {
    label: 'No of Pieces',
    value: 'noOfPieces',
  },
  {
    label: 'Category',
    value: 'category',
  },
];
