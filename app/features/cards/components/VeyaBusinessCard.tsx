import React from 'react';
import { VeyaCard, VeyaCardProps } from './VeyaCard/VeyaCard';

export type VeyaBusinessCardProps = VeyaCardProps;

/**
 * Backwards-compatibility wrapper for VeyaCard.
 * Maintains full API compatibility with existing consumers.
 */
export const VeyaBusinessCard: React.FC<VeyaBusinessCardProps> = (props) => {
  return <VeyaCard {...props} />;
};

export default VeyaBusinessCard;
