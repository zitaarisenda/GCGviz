import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Plus, Edit, Save, Loader2 } from 'lucide-react';

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'add' | 'edit' | 'custom';
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const FormDialog: React.FC<FormDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitText,
  cancelText = 'Batal',
  isLoading = false,
  disabled = false,
  variant = 'custom',
  showCloseButton = true,
  size = 'md',
  className = ""
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'add':
        return {
          icon: <Plus className="w-5 h-5" />,
          submitText: submitText || 'Tambah',
          iconColor: 'text-green-600'
        };
      case 'edit':
        return {
          icon: <Edit className="w-5 h-5" />,
          submitText: submitText || 'Simpan',
          iconColor: 'text-blue-600'
        };
      default:
        return {
          icon: null,
          submitText: submitText || 'Simpan',
          iconColor: 'text-gray-600'
        };
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      default:
        return 'max-w-lg';
    }
  };

  const config = getVariantConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${getSizeClass()} ${className}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {config.icon && (
                <div className={config.iconColor}>
                  {config.icon}
                </div>
              )}
              {title}
            </DialogTitle>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4">
          {children}
        </div>

        {onSubmit && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onSubmit}
              disabled={disabled || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {config.submitText}
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog; 