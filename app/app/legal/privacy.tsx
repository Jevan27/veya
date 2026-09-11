import React from 'react';
import { LegalScreenView } from '../../features/legal/LegalScreenView';
import { privacyData } from '../../features/legal/content';

export default function PrivacyScreen() {
  return (
    <LegalScreenView
      data={privacyData}
      alternateRoute="/legal/terms"
      alternateLabel="Terms of Service"
    />
  );
}
