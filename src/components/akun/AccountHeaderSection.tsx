import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AccountHeaderSectionProps {
  onAddAccount: () => void;
}

const AccountHeaderSection: React.FC<AccountHeaderSectionProps> = ({
  onAddAccount
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-gray-600 mt-2">
            Manajemen akun admin dan user
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={onAddAccount}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Akun
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountHeaderSection;
