package com.aura.health;

import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.InputStream;
import java.nio.FloatBuffer;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OnnxValue;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtSession;

@CapacitorPlugin(name = "OnnxPredictor")
public class OnnxPredictorPlugin extends Plugin {

    private static final String TAG = "OnnxPredictorPlugin";
    private OrtEnvironment env;
    private OrtSession session;

    @Override
    public void load() {
        super.load();
        try {
            env = OrtEnvironment.getEnvironment();
            // Load the v3 model with internal scaling
            InputStream inputStream = getContext().getAssets().open("pcos_app_model_v3.onnx");
            int size = inputStream.available();
            byte[] buffer = new byte[size];
            int read = inputStream.read(buffer);
            inputStream.close();

            if (read != size) {
                throw new Exception("Failed to read the complete model file");
            }

            session = env.createSession(buffer);
            Log.i(TAG, "ONNX Runtime v3: Model loaded successfully from assets.");
            Log.i(TAG, "Input names: " + session.getInputNames());
            Log.i(TAG, "Output names: " + session.getOutputNames());
            Log.i(TAG, "Input info: " + session.getInputInfo());
            Log.i(TAG, "Output info: " + session.getOutputInfo());
        } catch (Exception e) {
            Log.e(TAG, "ONNX Runtime: Failed to load model - " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void runInference(PluginCall call) {
        if (session == null) {
            Log.e(TAG, "Inference rejected: Model not initialized.");
            call.reject("Model not initialized.");
            return;
        }

        try {
            JSArray data = call.getArray("data");
            if (data == null || data.length() < 16) {
                Log.e(TAG, "Invalid input vector length: " + (data == null ? "null" : data.length()));
                call.reject("Invalid input vector. Expected 16 features for v3 model.");
                return;
            }

            // Extract 16 features
            float[] processedInput = new float[16];
            StringBuilder inputLog = new StringBuilder("Input Vector [16]: ");
            for (int i = 0; i < 16; i++) {
                processedInput[i] = (float) data.getDouble(i);
                inputLog.append(String.format(Locale.US, "%.2f", processedInput[i])).append(i < 15 ? ", " : "");
            }
            Log.d(TAG, inputLog.toString());

            // Assemble tensor and run session
            String inputName = session.getInputNames().iterator().next();
            long[] shape = new long[]{1, 16};
            OnnxTensor inputTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(processedInput), shape);

            try (OrtSession.Result result = session.run(Collections.singletonMap(inputName, inputTensor))) {
                Log.d(TAG, "Inference completed. Result output count: " + result.size());

                long label = 0;
                float positiveProb = 0.0f;
                float[] probsArray = new float[]{0.0f, 0.0f};

                int index = 0;
                for (Map.Entry<String, OnnxValue> entry : result) {
                    String outputName = entry.getKey();
                    OnnxValue onnxValue = entry.getValue();
                    Object rawValue = onnxValue.getValue();
                    Log.d(TAG, "Output #" + index + " [" + outputName + "] type: " + (rawValue != null ? rawValue.getClass().getName() : "null"));

                    if (index == 0 || "label".equalsIgnoreCase(outputName) || "output_label".equalsIgnoreCase(outputName)) {
                        label = extractLabel(rawValue);
                    }

                    if (index == 1 || "probabilities".equalsIgnoreCase(outputName) || "output_probability".equalsIgnoreCase(outputName)) {
                        probsArray = extractProbabilities(rawValue);
                        if (probsArray.length > 1) {
                            positiveProb = probsArray[1];
                        } else if (probsArray.length == 1) {
                            positiveProb = probsArray[0];
                        }
                    }
                    index++;
                }

                // Ensure probability is clamped between 0 and 1
                positiveProb = Math.max(0.0f, Math.min(1.0f, positiveProb));
                boolean isDetected = (label == 1) || (positiveProb >= 0.5f);
                String riskLevel = positiveProb >= 0.65f ? "high" : (positiveProb >= 0.35f ? "moderate" : "low");

                Log.i(TAG, String.format(Locale.US, "Inference Output -> Label: %d, Positive Prob: %.4f, Risk: %s, Detected: %b",
                        label, positiveProb, riskLevel, isDetected));

                JSObject response = new JSObject();
                response.put("probability", positiveProb);
                response.put("label", (int) label);
                response.put("isDetected", isDetected);
                response.put("riskLevel", riskLevel);

                JSArray jsProbs = new JSArray();
                for (float p : probsArray) {
                    jsProbs.put((double) p);
                }
                response.put("probabilities", jsProbs);
                response.put("results", jsProbs);

                call.resolve(response);
            } finally {
                inputTensor.close();
            }
        } catch (Exception e) {
            Log.e(TAG, "Inference execution error: " + e.getMessage(), e);
            call.reject("Inference failed: " + e.getMessage());
        }
    }

    private long extractLabel(Object value) {
        if (value == null) return 0;
        if (value instanceof long[] arr) {
            return arr.length > 0 ? arr[0] : 0;
        } else if (value instanceof long[][] arr) {
            return (arr.length > 0 && arr[0].length > 0) ? arr[0][0] : 0;
        } else if (value instanceof int[] arr) {
            return arr.length > 0 ? arr[0] : 0;
        } else if (value instanceof int[][] arr) {
            return (arr.length > 0 && arr[0].length > 0) ? arr[0][0] : 0;
        } else if (value instanceof float[] arr) {
            return arr.length > 0 ? (long) arr[0] : 0;
        } else if (value instanceof float[][] arr) {
            return (arr.length > 0 && arr[0].length > 0) ? (long) arr[0][0] : 0;
        }
        return 0;
    }

    private float[] extractProbabilities(Object value) {
        if (value == null) return new float[]{0.0f, 0.0f};

        if (value instanceof float[][] arr) {
            if (arr.length > 0) return arr[0];
        } else if (value instanceof float[] arr) {
            return arr;
        } else if (value instanceof double[][] arr) {
            if (arr.length > 0) {
                float[] res = new float[arr[0].length];
                for (int i = 0; i < arr[0].length; i++) {
                    res[i] = (float) arr[0][i];
                }
                return res;
            }
        } else if (value instanceof double[] arr) {
            float[] res = new float[arr.length];
            for (int i = 0; i < arr.length; i++) {
                res[i] = (float) arr[i];
            }
            return res;
        } else if (value instanceof List<?> list) {
            if (!list.isEmpty() && list.get(0) instanceof Map<?, ?> map) {
                float p0 = getFloatFromMap(map, 0L, 0, "0");
                float p1 = getFloatFromMap(map, 1L, 1, "1");
                return new float[]{p0, p1};
            }
        }
        return new float[]{0.0f, 0.0f};
    }

    private float getFloatFromMap(Map<?, ?> map, Object... keys) {
        for (Object key : keys) {
            if (map.containsKey(key)) {
                Object val = map.get(key);
                if (val instanceof Number n) {
                    return n.floatValue();
                }
            }
        }
        return 0.0f;
    }
}
