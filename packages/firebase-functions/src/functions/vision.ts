import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import vision from '@google-cloud/vision';

// Initialize Vision AI client
const visionClient = new vision.ImageAnnotatorClient();

/**
 * Analyze an invoice image using Google Cloud Vision AI
 */
export const analyzeInvoice = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { imageUrl, imageBase64 } = request.data;

  if (!imageUrl && !imageBase64) {
    throw new HttpsError('invalid-argument', 'Image URL or base64 request.data is required');
  }

  try {
    let request;
    if (imageBase64) {
      request = { image: { content: imageBase64 } };
    } else {
      request = { image: { source: { imageUri: imageUrl } } };
    }

    // Perform text detection
    const [textResult] = await visionClient.textDetection(request);
    const textAnnotations = textResult.textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
      throw new HttpsError('not-found', 'No text found in image');
    }

    const fullText = textAnnotations[0].description || '';

    // Extract invoice information using pattern matching
    const extractedData = extractInvoiceData(fullText);

    return {
      success: true,
      extractedData,
      fullText,
    };
  } catch (error) {
    console.error('Error analyzing invoice:', error);
    throw new HttpsError('internal', 'Failed to analyze invoice');
  }
});

/**
 * Analyze a receipt image using Google Cloud Vision AI
 */
export const analyzeReceipt = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { imageUrl, imageBase64 } = request.data;

  if (!imageUrl && !imageBase64) {
    throw new HttpsError('invalid-argument', 'Image URL or base64 request.data is required');
  }

  try {
    let request;
    if (imageBase64) {
      request = { image: { content: imageBase64 } };
    } else {
      request = { image: { source: { imageUri: imageUrl } } };
    }

    // Perform text detection
    const [textResult] = await visionClient.textDetection(request);
    const textAnnotations = textResult.textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
      throw new HttpsError('not-found', 'No text found in image');
    }

    const fullText = textAnnotations[0].description || '';

    // Extract receipt information
    const extractedData = extractReceiptData(fullText);

    return {
      success: true,
      extractedData,
      fullText,
    };
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    throw new HttpsError('internal', 'Failed to analyze receipt');
  }
});

/**
 * Process an uploaded image and extract text
 */
export const processUploadedImage = onObjectFinalized(async (event) => {
  const filePath = event.data.name;
  const bucket = event.data.bucket;

  if (!filePath) {
    console.log('No file path found');
    return;
  }

  // Check if the file is an image
  if (!event.data.contentType?.startsWith('image/')) {
    console.log('File is not an image');
    return;
  }

  // Check if file is in receipts or invoices folder
  if (!filePath.includes('receipts/') && !filePath.includes('invoices/')) {
    console.log('File is not in receipts or invoices folder');
    return;
  }

  try {
    const imageUri = `gs://${bucket}/${filePath}`;

    // Perform text detection
    const [textResult] = await visionClient.textDetection({ image: { source: { imageUri } } });
    const textAnnotations = textResult.textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
      console.log('No text found in image');
      return;
    }

    const fullText = textAnnotations[0].description || '';

    // Extract request.data based on folder
    const extractedData = filePath.includes('receipts/') 
      ? extractReceiptData(fullText)
      : extractInvoiceData(fullText);

    console.log('Extracted request.data:', extractedData);

    // TODO: Store extracted request.data in Firestore
    // This can be enhanced to automatically create expense/invoice records

    return extractedData;
  } catch (error) {
    console.error('Error processing uploaded image:', error);
    return null;
  }
});

/**
 * Extract invoice data from text using pattern matching
 */
function extractInvoiceData(text: string): any {
  const data: any = {
    clientName: null,
    amount: null,
    invoiceNumber: null,
    date: null,
    items: [],
  };

  // Extract invoice number
  const invoiceNumberMatch = text.match(/invoice\s*#?\s*:?\s*(\w+-?\d+)/i);
  if (invoiceNumberMatch) {
    data.invoiceNumber = invoiceNumberMatch[1];
  }

  // Extract amounts (look for currency symbols and numbers)
  const amountMatches = text.match(/\$\s*(\d+[,.]?\d*)/g) || 
                       text.match(/(\d+[,.]\d{2})/g);
  if (amountMatches && amountMatches.length > 0) {
    // Get the last/largest amount as the total
    const amounts = amountMatches.map(m => parseFloat(m.replace(/[$,]/g, '')));
    data.amount = Math.max(...amounts);
  }

  // Extract date
  const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    data.date = dateMatch[0];
  }

  return data;
}

/**
 * Extract receipt data from text using pattern matching
 */
function extractReceiptData(text: string): any {
  const data: any = {
    merchant: null,
    amount: null,
    date: null,
    category: null,
    items: [],
  };

  // Extract merchant name (usually first few lines)
  const lines = text.split('\n');
  if (lines.length > 0) {
    data.merchant = lines[0].trim();
  }

  // Extract amounts
  const amountMatches = text.match(/\$\s*(\d+[,.]?\d*)/g) || 
                       text.match(/(\d+[,.]\d{2})/g);
  if (amountMatches && amountMatches.length > 0) {
    const amounts = amountMatches.map(m => parseFloat(m.replace(/[$,]/g, '')));
    data.amount = Math.max(...amounts);
  }

  // Extract date
  const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    data.date = dateMatch[0];
  }

  // Try to categorize based on merchant name
  if (data.merchant) {
    data.category = categorizeReceipt(data.merchant.toLowerCase());
  }

  return data;
}

/**
 * Categorize receipt based on merchant name
 */
function categorizeReceipt(merchantName: string): string {
  if (merchantName.includes('food') || merchantName.includes('restaurant') || 
      merchantName.includes('cafe') || merchantName.includes('pizza')) {
    return 'Meals';
  }
  if (merchantName.includes('gas') || merchantName.includes('fuel') || 
      merchantName.includes('shell') || merchantName.includes('exxon')) {
    return 'Fuel';
  }
  if (merchantName.includes('hotel') || merchantName.includes('airbnb')) {
    return 'Lodging';
  }
  if (merchantName.includes('office') || merchantName.includes('staples') || 
      merchantName.includes('depot')) {
    return 'Office Supplies';
  }
  
  return 'Other';
}

export const visionFunctions = {
  analyzeInvoice,
  analyzeReceipt,
  processUploadedImage,
};
