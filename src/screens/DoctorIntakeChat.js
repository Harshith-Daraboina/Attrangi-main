import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../styles/designSystem';

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

export default function DoctorIntakeChat({ navigation }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    // Section 1
    name: '', age: '', gender: '', contact: '',
    // Section 2
    conditions: [], diagnosedBy: '', firstDiagnosis: '', otherHealth: '',
    // Section 3
    symptoms: [], severity: '', medications: '', sideEffects: '',
    // Section 4
    sleep: '', diet: '', exercise: '', routine: '',
    // Section 5
    support: '', social: '', triggers: [], strengths: '',
    // Section 6
    selfHarm: '', safetyHistory: '', substances: '',
    // Section 7
    therapies: [], medHistory: '', hospitalizations: '',
    // Section 8
    goalsShort: [], goalsLong: [], priorities: [],
  });

  const toggleMulti = (key, value) => {
    setData((prev) => {
      const has = prev[key].includes(value);
      return { ...prev, [key]: has ? prev[key].filter((v) => v !== value) : [...prev[key], value] };
    });
  };

  const next = () => setStep((s) => s + 1);
  const done = () => navigation.navigate('MainDoctor');

  const renderSummary = () => (
    <ScrollView style={{ maxHeight: 320 }}>
      {Object.entries(data).map(([k, v]) => (
        <Text key={k} style={styles.summaryRow}>{k}: {Array.isArray(v) ? v.join(', ') : v}</Text>
      ))}
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.screen}>
        <FlatList
          data={[...Array(10).keys()].slice(0, step + 1)}
          keyExtractor={(i) => String(i)}
          renderItem={({ item }) => (
            <View style={{ marginBottom: Spacing.md }}>
              {item === 0 && (
                <>
                  <Bubble text={'Let’s start the intake for your patient. What’s their name and age?'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    <TextInput style={[styles.input, { minWidth: 160 }]} placeholder={'Name'} placeholderTextColor={Colors.textSecondary} value={data.name} onChangeText={(t) => setData({ ...data, name: t })} />
                    <TextInput style={[styles.input, { minWidth: 100 }]} placeholder={'Age'} placeholderTextColor={Colors.textSecondary} keyboardType={'number-pad'} value={data.age} onChangeText={(t) => setData({ ...data, age: t })} />
                    <TouchableOpacity style={styles.cta} onPress={next}><Text style={styles.ctaText}>Next</Text></TouchableOpacity>
                  </View>
                </>
              )}

              {item === 1 && (
                <>
                  <Bubble text={'Gender and contact info?'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    {['Male','Female','Other'].map((g) => (
                      <TouchableOpacity key={g} style={styles.chipBtn} onPress={() => setData({ ...data, gender: g })}><Text style={styles.chipBtnText}>{g}</Text></TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    <TextInput style={[styles.input, { minWidth: 220 }]} placeholder={'Contact (phone/email)'} placeholderTextColor={Colors.textSecondary} value={data.contact} onChangeText={(t) => setData({ ...data, contact: t })} />
                    <TouchableOpacity style={styles.cta} onPress={next}><Text style={styles.ctaText}>Next</Text></TouchableOpacity>
                  </View>
                </>
              )}

              {item === 2 && (
                <>
                  <Bubble text={'What condition(s) have they been diagnosed with?'} />
                  <View style={[styles.rowWrap, { alignSelf: 'flex-end' }]}> 
                    {['ADHD','Autism','Anxiety','Depression','Other'].map((c) => (
                      <TouchableOpacity key={c} style={[styles.chipBtn, data.conditions.includes(c) && styles.chipBtnActive]} onPress={() => toggleMulti('conditions', c)}>
                        <Text style={[styles.chipBtnText, data.conditions.includes(c) && styles.chipBtnTextActive]}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    {['Psychiatrist','Clinical Psychologist','GP','Not yet diagnosed'].map((d) => (
                      <TouchableOpacity key={d} style={styles.chipBtn} onPress={() => setData({ ...data, diagnosedBy: d })}><Text style={styles.chipBtnText}>{d}</Text></TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    <TextInput style={[styles.input, { minWidth: 160 }]} placeholder={'First diagnosis date'} placeholderTextColor={Colors.textSecondary} value={data.firstDiagnosis} onChangeText={(t) => setData({ ...data, firstDiagnosis: t })} />
                    <TextInput style={[styles.input, { minWidth: 160 }]} placeholder={'Other health conditions'} placeholderTextColor={Colors.textSecondary} value={data.otherHealth} onChangeText={(t) => setData({ ...data, otherHealth: t })} />
                    <TouchableOpacity style={styles.cta} onPress={next}><Text style={styles.ctaText}>Next</Text></TouchableOpacity>
                  </View>
                </>
              )}

              {item === 3 && (
                <>
                  <Bubble text={'Current symptoms and severity?'} />
                  <View style={[styles.rowWrap, { alignSelf: 'flex-end' }]}> 
                    {['Inattentiveness','Hyperactivity','Anxiety','Mood swings','Sleep issues'].map((s) => (
                      <TouchableOpacity key={s} style={[styles.chipBtn, data.symptoms.includes(s) && styles.chipBtnActive]} onPress={() => toggleMulti('symptoms', s)}>
                        <Text style={[styles.chipBtnText, data.symptoms.includes(s) && styles.chipBtnTextActive]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    {['Mild','Moderate','Severe'].map((s) => (
                      <TouchableOpacity key={s} style={styles.chipBtn} onPress={() => setData({ ...data, severity: s })}><Text style={styles.chipBtnText}>{s}</Text></TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    <TextInput style={[styles.input, { minWidth: 260 }]} placeholder={'Current medications (dose + frequency)'} placeholderTextColor={Colors.textSecondary} value={data.medications} onChangeText={(t) => setData({ ...data, medications: t })} />
                    <TextInput style={[styles.input, { minWidth: 200 }]} placeholder={'Side effects observed'} placeholderTextColor={Colors.textSecondary} value={data.sideEffects} onChangeText={(t) => setData({ ...data, sideEffects: t })} />
                    <TouchableOpacity style={styles.cta} onPress={next}><Text style={styles.ctaText}>Next</Text></TouchableOpacity>
                  </View>
                </>
              )}

              {item === 4 && (
                <>
                  <Bubble text={'Lifestyle & routine'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    <TextInput style={[styles.input, { minWidth: 120 }]} placeholder={'Sleep (hrs)'} placeholderTextColor={Colors.textSecondary} keyboardType={'number-pad'} value={data.sleep} onChangeText={(t) => setData({ ...data, sleep: t })} />
                    {['Balanced','Irregular','Restricted'].map((d) => (
                      <TouchableOpacity key={d} style={styles.chipBtn} onPress={() => setData({ ...data, diet: d })}><Text style={styles.chipBtnText}>{d}</Text></TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    {['Low','Moderate','High'].map((e) => (
                      <TouchableOpacity key={e} style={styles.chipBtn} onPress={() => setData({ ...data, exercise: e })}><Text style={styles.chipBtnText}>{e}</Text></TouchableOpacity>
                    ))}
                    {['School','Work','Unemployed','Other'].map((r) => (
                      <TouchableOpacity key={r} style={styles.chipBtn} onPress={() => setData({ ...data, routine: r })}><Text style={styles.chipBtnText}>{r}</Text></TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {item === 5 && (
                <>
                  <Bubble text={'Psychosocial factors'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    {['Family','Caregiver','Independent'].map((s) => (
                      <TouchableOpacity key={s} style={styles.chipBtn} onPress={() => setData({ ...data, support: s })}><Text style={styles.chipBtnText}>{s}</Text></TouchableOpacity>
                    ))}
                    {['Isolated','Some friends','Active'].map((s) => (
                      <TouchableOpacity key={s} style={styles.chipBtn} onPress={() => setData({ ...data, social: s })}><Text style={styles.chipBtnText}>{s}</Text></TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowWrap, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    {['Work','Studies','Relationships','Sensory overload'].map((t) => (
                      <TouchableOpacity key={t} style={[styles.chipBtn, data.triggers.includes(t) && styles.chipBtnActive]} onPress={() => toggleMulti('triggers', t)}>
                        <Text style={[styles.chipBtnText, data.triggers.includes(t) && styles.chipBtnTextActive]}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    <TextInput style={[styles.input, { minWidth: 240 }]} placeholder={'Strengths & interests'} placeholderTextColor={Colors.textSecondary} value={data.strengths} onChangeText={(t) => setData({ ...data, strengths: t })} />
                  </View>
                </>
              )}

              {item === 6 && (
                <>
                  <Bubble text={'Risk & safety'} />
                  <View style={[styles.rowInline, { alignSelf: 'flex-end' }]}> 
                    {['Yes','No'].map((s) => (
                      <TouchableOpacity key={s} style={styles.chipBtn} onPress={() => setData({ ...data, selfHarm: s })}><Text style={styles.chipBtnText}>Self-harm: {s}</Text></TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    <TextInput style={[styles.input, { minWidth: 240 }]} placeholder={'Severity & history'} placeholderTextColor={Colors.textSecondary} value={data.safetyHistory} onChangeText={(t) => setData({ ...data, safetyHistory: t })} />
                    <TextInput style={[styles.input, { minWidth: 240 }]} placeholder={'Substance use (if any)'} placeholderTextColor={Colors.textSecondary} value={data.substances} onChangeText={(t) => setData({ ...data, substances: t })} />
                  </View>
                </>
              )}

              {item === 7 && (
                <>
                  <Bubble text={'Therapy history'} />
                  <View style={[styles.rowWrap, { alignSelf: 'flex-end' }]}> 
                    {['CBT','Speech','Occupational','Group therapy','Other'].map((t) => (
                      <TouchableOpacity key={t} style={[styles.chipBtn, data.therapies.includes(t) && styles.chipBtnActive]} onPress={() => toggleMulti('therapies', t)}>
                        <Text style={[styles.chipBtnText, data.therapies.includes(t) && styles.chipBtnTextActive]}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    <TextInput style={[styles.input, { minWidth: 220 }]} placeholder={'Medication history'} placeholderTextColor={Colors.textSecondary} value={data.medHistory} onChangeText={(t) => setData({ ...data, medHistory: t })} />
                    <TextInput style={[styles.input, { minWidth: 220 }]} placeholder={'Hospitalizations'} placeholderTextColor={Colors.textSecondary} value={data.hospitalizations} onChangeText={(t) => setData({ ...data, hospitalizations: t })} />
                  </View>
                </>
              )}

              {item === 8 && (
                <>
                  <Bubble text={'Goals & expectations'} />
                  <View style={[styles.rowWrap, { alignSelf: 'flex-end' }]}> 
                    {['Better sleep','Reduce anxiety','Improve focus','Routine','Social skills'].map((g) => (
                      <TouchableOpacity key={g} style={[styles.chipBtn, data.goalsShort.includes(g) && styles.chipBtnActive]} onPress={() => toggleMulti('goalsShort', g)}>
                        <Text style={[styles.chipBtnText, data.goalsShort.includes(g) && styles.chipBtnTextActive]}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowWrap, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    {['Independence','Job stability','Social interaction'].map((g) => (
                      <TouchableOpacity key={g} style={[styles.chipBtn, data.goalsLong.includes(g) && styles.chipBtnActive]} onPress={() => toggleMulti('goalsLong', g)}>
                        <Text style={[styles.chipBtnText, data.goalsLong.includes(g) && styles.chipBtnTextActive]}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.rowWrap, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    {['Sleep','Anxiety','Focus','Routine','Social'].map((g) => (
                      <TouchableOpacity key={g} style={[styles.chipBtn, data.priorities.includes(g) && styles.chipBtnActive]} onPress={() => toggleMulti('priorities', g)}>
                        <Text style={[styles.chipBtnText, data.priorities.includes(g) && styles.chipBtnTextActive]}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {item === 9 && (
                <>
                  <Bubble text={'Here is the summary. Confirm & save?'} />
                  <View style={[styles.summaryBox]}> 
                    {renderSummary()}
                  </View>
                  <View style={[styles.rowInline, { alignSelf: 'flex-end', marginTop: Spacing.sm }]}> 
                    <TouchableOpacity style={styles.cta} onPress={done}><Text style={styles.ctaText}>Confirm & Save</Text></TouchableOpacity>
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
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chipBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border },
  chipBtnActive: { borderColor: Colors.primary },
  chipBtnText: { color: Colors.textPrimary },
  chipBtnTextActive: { color: Colors.primary, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, color: Colors.textPrimary },
  cta: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: 12, paddingHorizontal: 16 },
  ctaText: { color: '#fff', fontWeight: '700' },
  summaryBox: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  summaryRow: { ...Typography.caption, marginBottom: 4 },
});


