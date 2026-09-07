import React from 'react';
import { EditCardModal } from './EditCardModal/EditCardModal';
import {
  EditCardData,
  EditCardModalProps,
  EditBusinessCardData,
  EditBusinessCardModalProps,
} from '../types/card-form.types';

export { EditCardData, EditBusinessCardData, EditCardModalProps, EditBusinessCardModalProps };

/**
 * Backwards-compatibility wrapper for EditCardModal.
 * Maintains full API compatibility with existing consumers.
 */
export const EditBusinessCardModal: React.FC<EditBusinessCardModalProps> = (props) => {
  return <EditCardModal {...props} />;
};

export default EditBusinessCardModal;
