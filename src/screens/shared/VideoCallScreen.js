import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/designSystem';
import { useThemeSettings } from '../../styles/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen({ navigation, route }) {
  const { palette } = useThemeSettings();
  const { sessionData } = route.params || {};
  
  // Debug logging
  console.log('VideoCallScreen - Received params:', route.params);
  console.log('VideoCallScreen - SessionData:', sessionData);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 70);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setShowEndCallModal(true);
  };

  const confirmEndCall = () => {
    Alert.alert(
      'Session Ended',
      'Thank you for your session. You can provide feedback and view session notes.',
      [
        {
          text: 'Provide Feedback',
          onPress: () => navigation.navigate('FeedbackScreen', { sessionData }),
        },
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: chatMessage,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setChatMessage('');
    }
  };

  const renderVideoView = () => (
    <View style={styles.videoContainer}>
      {/* Remote video (therapist) */}
      <View style={styles.remoteVideo}>
        <View style={styles.videoPlaceholder}>
          <Ionicons name="person" size={80} color="#fff" />
          <Text style={styles.videoPlaceholderText}>
            {sessionData?.therapistName || 'Dr. Sarah Johnson'}
          </Text>
          <Text style={styles.integrationNote}>
            {/* TODO: Integrate Agora or Twilio video SDK here */}
            Video call placeholder
          </Text>
        </View>
      </View>

      {/* Local video (patient) */}
      <View style={styles.localVideo}>
        <View style={styles.localVideoPlaceholder}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        {!isVideoOn && (
          <View style={styles.videoOffOverlay}>
            <Ionicons name="videocam-off" size={24} color="#fff" />
          </View>
        )}
      </View>
    </View>
  );

  const renderAudioView = () => (
    <View style={styles.audioContainer}>
      {/* Therapist info */}
      <View style={styles.therapistInfo}>
        <View style={styles.therapistAvatar}>
          <Ionicons name="person" size={80} color="#fff" />
        </View>
        <Text style={styles.therapistName}>
          {sessionData?.therapistName || 'Dr. Sarah Johnson'}
        </Text>
        <Text style={styles.sessionStatus}>Audio Session in Progress</Text>
      </View>

      {/* Audio visualization placeholder */}
      <View style={styles.audioVisualization}>
        <View style={styles.audioWave}>
          <View style={[styles.waveBar, { height: 20 }]} />
          <View style={[styles.waveBar, { height: 35 }]} />
          <View style={[styles.waveBar, { height: 25 }]} />
          <View style={[styles.waveBar, { height: 40 }]} />
          <View style={[styles.waveBar, { height: 30 }]} />
          <View style={[styles.waveBar, { height: 45 }]} />
          <View style={[styles.waveBar, { height: 20 }]} />
          <View style={[styles.waveBar, { height: 35 }]} />
        </View>
      </View>
    </View>
  );

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      <View style={styles.topControls}>
        <View style={styles.callInfo}>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
          <Text style={styles.callStatus}>Connected</Text>
        </View>
        
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setShowChat(!showChat)}
        >
          <Ionicons name="chatbubble" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isMuted ? '#ff4444' : 'rgba(255,255,255,0.2)' }]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isVideoOn ? 'rgba(255,255,255,0.2)' : '#ff4444' }]}
          onPress={() => setIsVideoOn(!isVideoOn)}
        >
          <Ionicons name={isVideoOn ? 'videocam' : 'videocam-off'} size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: isSpeakerOn ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' }]}
          onPress={() => setIsSpeakerOn(!isSpeakerOn)}
        >
          <Ionicons name={isSpeakerOn ? 'volume-high' : 'volume-low'} size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChat = () => (
    <Modal
      visible={showChat}
      transparent
      animationType="slide"
      onRequestClose={() => setShowChat(false)}
    >
      <View style={styles.chatModal}>
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Session Chat</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Ionicons name="close" size={24} color={palette.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.chatMessages}>
            {chatMessages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.chatMessage,
                  message.sender === 'me' ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={styles.chatMessageText}>{message.text}</Text>
                <Text style={styles.chatMessageTime}>{message.timestamp}</Text>
              </View>
            ))}
          </View>

          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatInputField}
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholder="Type a message..."
              placeholderTextColor={Colors.textTertiary}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendChatMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEndCallModal = () => (
    <Modal
      visible={showEndCallModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEndCallModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalIcon}>
            <Ionicons name="call" size={40} color="#ff4444" />
          </View>
          <Text style={styles.modalTitle}>End Session?</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to end this session? This action cannot be undone.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowEndCallModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={confirmEndCall}
            >
              <Text style={styles.confirmButtonText}>End Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Determine session type - default to video if not specified
  const isVideoSession = sessionData?.type === 'video' || sessionData?.sessionType === 'video' || !sessionData;
  
  console.log('VideoCallScreen - isVideoSession:', isVideoSession);
  console.log('VideoCallScreen - sessionData type:', sessionData?.type);
  console.log('VideoCallScreen - sessionData sessionType:', sessionData?.sessionType);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {isVideoSession ? renderVideoView() : renderAudioView()}
      {renderControls()}
      {renderChat()}
      {renderEndCallModal()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#fff',
    fontSize: 18,
    marginTop: Spacing.md,
  },
  integrationNote: {
    color: '#fff',
    fontSize: 12,
    marginTop: Spacing.xs,
    opacity: 0.7,
    textAlign: 'center',
  },
  localVideo: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 120,
    height: 160,
    backgroundColor: '#2a2a2a',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  localVideoPlaceholder: {
    alignItems: 'center',
  },
  videoOffOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  therapistInfo: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  therapistAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  therapistName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  sessionStatus: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  audioVisualization: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  audioWave: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  waveBar: {
    width: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    opacity: 0.8,
  },
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  callInfo: {
    alignItems: 'center',
  },
  callDuration: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  callStatus: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  chatButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    backgroundColor: '#ff4444',
  },
  chatModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    backgroundColor: '#fff',
    height: height * 0.6,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chatMessages: {
    flex: 1,
    padding: Spacing.lg,
  },
  chatMessage: {
    marginBottom: Spacing.md,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderBottomLeftRadius: 4,
  },
  chatMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  chatMessageTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chatInputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: width * 0.8,
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff444420',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmButton: {
    backgroundColor: '#ff4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
