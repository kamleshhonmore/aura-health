# Debug and Fix PCOS Prediction Engine

The user reports that the PCOS prediction engine always returns "PCOS DETECTED" regardless of the input. Investigation reveals that the confidence score is hardcoded in the UI, and the native plugin only returns the first output of the ONNX model without logging results for debugging.

## Proposed Changes

### Native Plugin (Android)

#### [MODIFY] [OnnxPredictorPlugin.java](file:///C:/Users/kamle/AndroidStudioProjects/aura-health/android/app/src/main/java/com/aura/health/OnnxPredictorPlugin.java)
- Add logging for model inputs and all outputs.
- Improve output handling to return all model outputs to the frontend.
- Check for multiple outputs (labels vs. probabilities).

### Frontend (React)

#### [MODIFY] [ClinicalDiagnosticsHub.tsx](file:///C:/Users/kamle/AndroidStudioProjects/aura-health/src/components/ClinicalDiagnosticsHub.tsx)
- Use the actual confidence/probability returned by the model instead of the hardcoded 94%.
- Refine the `isDetected` logic based on the improved output from the native plugin.

## Verification Plan

### Manual Verification
- Deploy the app to the device.
- Use the "Diagnostic Screening" section.
- Input various values (e.g., all 0s for symptoms, high values for symptoms).
- Check logcat for model output logs.
- Verify that the UI reflects different risk levels and confidence scores based on the input.
