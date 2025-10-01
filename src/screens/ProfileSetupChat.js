import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/designSystem';

function Bubble({ text, isSelf, children }) {
  return (
    <View style={[styles.rowItem, isSelf ? styles.right : styles.left]}>
      <View style={[styles.bubble, isSelf ? styles.selfBubble : styles.otherBubble]}>
        {!!text && <Text style={[styles.bubbleText, isSelf ? styles.selfText : styles.otherText]}>{text}</Text>}
        {children}
      </View>
    </View>
  );
}

export default function ProfileSetupChat({ navigation }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    ok: false,
    age: '',
    gender: '',
    conditions: [],
    otherCondition: '',
    uiPref: '',
    reminders: '',
    moodStyle: '',
    community: '',
  });

  const advance = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const toggleMulti = (key, value) => {
    setAnswers((prev) => {
      const has = prev[key].includes(value);
      return { ...prev, [key]: has ? prev[key].filter((v) => v !== value) : [...prev[key], value] };
    });
  };

  const done = () => navigation.replace('PatientTabs');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.screen}>
        <FlatList
          data={[0,1,2,3,4,5,6,7,8].slice(0, step + 1)}
          keyExtractor={(i) => String(i)}
          renderItem={({ item }) => (
            <View style={{ marginBottom: Spacing.md }}>
              {item === 0 && (
                <>
                  <Bubble text={'👋 Hi! Let’s set up your profile so I can make your experience just right. This will only take a few minutes.'} />
                  {answers.ok ? (
                    <Bubble isSelf text={'Okay 👍'} />
                  ) : (
                    <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                      <TouchableOpacity style={styles.chipBtn} onPress={() => { setAnswers({ ...answers, ok: true }); advance(); }}>
                        <Text style={styles.chipBtnText}>Okay 👍</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.chipBtn} onPress={done}>
                        <Text style={styles.chipBtnText}>Skip for now</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              {item === 1 && (
                <>
                  <Bubble text={'First, how old are you?'} />
                  {answers.age ? (
                    <Bubble isSelf text={answers.age} />
                  ) : (
                    <View style={[styles.inputRow, { alignSelf: 'flex-end' }]}> 
                      <TextInput
                        style={styles.input}
                        placeholder={'Age'}
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType={'number-pad'}
                        onSubmitEditing={advance}
                        onChangeText={(t) => setAnswers({ ...answers, age: t })}
                      />
                    </View>
                  )}
                </>
              )}

              {item === 2 && (
                <>
                  <Bubble text={'Got it. And what’s your gender?'} />
                  {answers.gender ? (
                    <Bubble isSelf text={answers.gender} />
                  ) : (
                    <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                      {['Male','Female','Other','Prefer not to say'].map((g) => (
                        <TouchableOpacity key={g} style={styles.chipBtn} onPress={() => { setAnswers({ ...answers, gender: g }); advance(); }}>
                          <Text style={styles.chipBtnText}>{g}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}

              {item === 3 && (
                <>
                  <Bubble text={'Can you tell me about your condition?'} />
                  <View style={[styles.rowWrap, { alignSelf: 'flex-end' }]}> 
                    {['ADHD','Autism','Anxiety','Depression','Other'].map((c) => (
                      <TouchableOpacity key={c} style={[styles.chipBtn, answers.conditions.includes(c) && styles.chipBtnActive]} onPress={() => toggleMulti('conditions', c)}>
                        <Text style={[styles.chipBtnText, answers.conditions.includes(c) && styles.chipBtnTextActive]}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {answers.conditions.includes('Other') && (
                    <View style={[styles.inputRow, { alignSelf: 'flex-end' }]}> 
                      <TextInput
                        style={styles.input}
                        placeholder={'Please type it in'}
                        placeholderTextColor={Colors.textSecondary}
                        onChangeText={(t) => setAnswers({ ...answers, otherCondition: t })}
                      />
                    </View>
                  )}
                </>
              )}

              {item === 4 && (
                <>
                  <Bubble text={'Some people like apps simple, others like them colorful & fun. Which do you prefer?'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    {['Simple & Calm 🧘','Colorful & Engaging 🎨'].map((p) => (
                      <TouchableOpacity key={p} style={styles.chipBtn} onPress={() => { setAnswers({ ...answers, uiPref: p }); advance(); }}>
                        <Text style={styles.chipBtnText}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {item === 5 && (
                <>
                  <Bubble text={'Do you want me to remind you about activities or exercises?'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    {['Yes, daily reminder','Only when doctor assigns','No reminders'].map((p) => (
                      <TouchableOpacity key={p} style={styles.chipBtn} onPress={() => { setAnswers({ ...answers, reminders: p }); advance(); }}>
                        <Text style={styles.chipBtnText}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {item === 6 && (
                <>
                  <Bubble text={'When I ask about your mood, how would you like to answer?'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    {['Emoji slider 🙂😐☹️','Words','Voice Note 🎤'].map((p) => (
                      <TouchableOpacity key={p} style={styles.chipBtn} onPress={() => { setAnswers({ ...answers, moodStyle: p }); advance(); }}>
                        <Text style={styles.chipBtnText}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {item === 7 && (
                <>
                  <Bubble text={'Would you like to join our community space to chat with others?'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    {['Yes','No, maybe later'].map((p) => (
                      <TouchableOpacity key={p} style={styles.chipBtn} onPress={() => { setAnswers({ ...answers, community: p }); advance(); }}>
                        <Text style={styles.chipBtnText}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {item === 8 && (
                <>
                  <Bubble text={'Awesome 🎉 Your profile is ready! You can change these settings anytime in your profile menu.'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    <TouchableOpacity style={styles.cta} onPress={done}>
                      <Text style={styles.ctaText}>Take me there 🚀</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  rowItem: { marginBottom: Spacing.sm },
  left: { alignSelf: 'flex-start', maxWidth: '86%' },
  right: { alignSelf: 'flex-end', maxWidth: '86%' },
  bubble: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.lg },
  otherBubble: { backgroundColor: '#F1F3F7' },
  selfBubble: { backgroundColor: Colors.primary },
  bubbleText: { fontSize: 16 },
  selfText: { color: '#fff' },
  otherText: { color: Colors.textPrimary },
  rowInline: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  chipBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border },
  chipBtnActive: { borderColor: Colors.primary },
  chipBtnText: { color: Colors.textPrimary },
  chipBtnTextActive: { color: Colors.primary, fontWeight: '600' },
  inputRow: { flexDirection: 'row' },
  input: { minWidth: 120, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, color: Colors.textPrimary },
  cta: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: 12, paddingHorizontal: 16 },
  ctaText: { color: '#fff', fontWeight: '700' },
});


