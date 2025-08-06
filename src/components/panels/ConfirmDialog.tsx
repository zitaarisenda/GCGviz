import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, Info, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'danger',
  confirmText,
  cancelText = 'Batal',
  isLoading = false,
  disabled = false
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-5 h-5" />,
          confirmText: confirmText || 'Hapus',
          confirmVariant: 'destructive' as const,
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          confirmText: confirmText || 'Lanjutkan',
          confirmVariant: 'default' as const,
          iconColor: 'text-yellow-600'
        };
      case 'info':
        return {
          icon: <Info className="w-5 h-5" />,
          confirmText: confirmText || 'OK',
          confirmVariant: 'default' as const,
          iconColor: 'text-blue-600'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          confirmText: confirmText || 'Ya',
          confirmVariant: 'default' as const,
          iconColor: 'text-green-600'
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          confirmText: confirmText || 'Konfirmasi',
          confirmVariant: 'default' as const,
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getVariantConfig();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className={config.iconColor}>
              {config.icon}
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={disabled || isLoading}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </div>
            ) : (
              config.confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog; 