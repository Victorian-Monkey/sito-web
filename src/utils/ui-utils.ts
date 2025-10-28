// Utility functions for the Victorian Monkey website

export const formatPrice = (price: number): string => {
  return `€${price.toFixed(2)}`;
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Italian phone number: +39 XXX XXX XXXX
  if (cleaned.startsWith('39') && cleaned.length === 11) {
    return `+39 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  // Format Italian phone number: XXX XXX XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  // Return original if doesn't match expected format
  return phone;
};

export const formatDate = (dateString: string, format: 'short' | 'long' | 'time' = 'short'): string => {
  const date = new Date(dateString);
  
  switch (format) {
    case 'long':
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return date.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'short':
    default:
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  }
};

export const getCategoryColorClasses = (color: string): string => {
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return colorMap[color] || 'bg-gray-100 text-gray-800 dark:bg-secondary/20 dark:text-gray-200';
};

export const getGradientClasses = (gradient: string): string => {
  const gradientMap: Record<string, string> = {
    'purple-blue': 'bg-gradient-to-r from-purple-600 to-blue-600',
    'blue-purple': 'bg-gradient-to-r from-blue-600 to-purple-600',
    'green-blue': 'bg-gradient-to-r from-green-600 to-blue-600',
    'orange-red': 'bg-gradient-to-r from-orange-600 to-red-600',
    'purple-50-blue-50': 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20',
    'green-50-blue-50': 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20',
    'red-50-orange-50': 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
  };
  return gradientMap[gradient] || 'bg-gradient-to-r from-purple-600 to-blue-600';
};
