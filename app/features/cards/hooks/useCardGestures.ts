import { useRef, useEffect, useCallback } from 'react';
import { Animated, PanResponder } from 'react-native';

interface UseCardGesturesOptions {
  visible: boolean;
  onClose: () => void;
}

export function useCardGestures({ visible, onClose }: UseCardGesturesOptions) {
  const translateY = useRef(new Animated.Value(700)).current;

  const backdropOpacity = translateY.interpolate({
    inputRange: [0, 500],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleDismiss = useCallback(() => {
    Animated.timing(translateY, {
      toValue: 700,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [onClose, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 4;
      },
      onPanResponderGrant: () => {
        translateY.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          // Upward drag with rubber-band resistance
          translateY.setValue(gestureState.dy * 0.2);
        } else {
          // Downward drag follows finger directly
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        // If dragged down past 100px or with downward velocity, dismiss completely
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          // Snap back up smoothly
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Animate sheet up when modal becomes visible
  useEffect(() => {
    if (visible) {
      translateY.setValue(700);
      Animated.spring(translateY, {
        toValue: 0,
        friction: 9,
        tension: 45,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  return {
    translateY,
    backdropOpacity,
    handleDismiss,
    panHandlers: panResponder.panHandlers,
  };
}
