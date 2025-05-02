export const generateReferenceNumber = (): string => {
    const timestamp = Date.now().toString(); 
    
    // Take the last 5 digits of the timestamp
    const timePart = timestamp.slice(-5); 
    
    
    const randomPart = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0'); // e.g., "0456"
    
    //Concatenate to form a 9-digit number
    const referenceNumber = timePart + randomPart; // e.g., "890120456"
    
    // Ensure it’s exactly 9 digits (in case timestamp part varies)
    if (referenceNumber.length < 9) {
      return referenceNumber.padStart(9, '0'); // Pad with leading zeros if needed
    } else if (referenceNumber.length > 9) {
      return referenceNumber.slice(-9); // Trim to last 9 digits
    }
    
    return referenceNumber;
}