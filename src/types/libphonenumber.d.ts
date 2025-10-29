declare module 'libphonenumber-js' {
  export function parsePhoneNumber(phoneNumber: string, defaultCountry?: string): any;
  export function isValidPhoneNumber(phoneNumber: string, defaultCountry?: string): boolean;
}
