'use client';
import { useState, useEffect } from 'react';
import { UserProfileModal } from '../components/header/UserProfileModal';

export function UserProfileModalGlobal() {
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => {
    function handleOpenModal() {
      setProfileOpen(true);
    }
    window.addEventListener('open-user-profile-modal', handleOpenModal);
    return () => window.removeEventListener('open-user-profile-modal', handleOpenModal);
  }, []);
  return <UserProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />;
}
