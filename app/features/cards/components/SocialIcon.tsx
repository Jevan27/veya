import React from 'react';
import { FontAwesome6, Feather } from '@expo/vector-icons';
import { SocialPlatformId } from '@veya/shared';

interface SocialIconProps {
  platform: SocialPlatformId;
  size?: number;
  color?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  size = 18,
  color = '#0F172A',
}) => {
  switch (platform) {
    case 'facebook':
      return <FontAwesome6 name="facebook-f" size={size} color={color} />;
    case 'linkedin':
      return <FontAwesome6 name="linkedin-in" size={size} color={color} />;
    case 'instagram':
      return <FontAwesome6 name="instagram" size={size} color={color} />;
    case 'x':
      return <FontAwesome6 name="x-twitter" size={size} color={color} />;
    case 'tiktok':
      return <FontAwesome6 name="tiktok" size={size} color={color} />;
    case 'youtube':
      return <FontAwesome6 name="youtube" size={size} color={color} />;
    case 'github':
      return <FontAwesome6 name="github" size={size} color={color} />;
    case 'telegram':
      return <FontAwesome6 name="telegram" size={size} color={color} />;
    case 'whatsapp':
      return <FontAwesome6 name="whatsapp" size={size} color={color} />;
    case 'threads':
      return <FontAwesome6 name="threads" size={size} color={color} />;
    case 'pinterest':
      return <FontAwesome6 name="pinterest" size={size} color={color} />;
    case 'reddit':
      return <FontAwesome6 name="reddit-alien" size={size} color={color} />;
    case 'discord':
      return <FontAwesome6 name="discord" size={size} color={color} />;
    case 'snapchat':
      return <FontAwesome6 name="snapchat" size={size} color={color} />;
    case 'website':
    default:
      return <Feather name="globe" size={size} color={color} />;
  }
};
