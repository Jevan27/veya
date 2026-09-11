import React from 'react';
import { LegalScreenView } from '../../features/legal/LegalScreenView';
import { termsData } from '../../features/legal/content';

export default function TermsScreen() {
  return (
    <LegalScreenView
      data={termsData}
      alternateRoute="/legal/privacy"
      alternateLabel="Privacy Policy"
    />
  );
}
