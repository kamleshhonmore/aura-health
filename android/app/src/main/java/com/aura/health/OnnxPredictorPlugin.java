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

    private static final String[] PHENOTYPE_NAMES = {
        "Baseline (Non-PCOS)",
        "Phenotype A (Classic Complete)",
        "Phenotype B (Hyperandrogenic Anovulatory)",
        "Phenotype C (Ovulatory PCOS)",
        "Phenotype D (Non-Hyperandrogenic)"
    };

    private static final String[] PHENOTYPE_DESCRIPTIONS = {
        "Healthy / Low Risk. Criteria for PCOS not met.",
        "Complete PCOS profile. Hyperandrogenism + Anovulation + Polycystic Ovaries. Highest metabolic & insulin resistance risk.",
        "Hyperandrogenism + Anovulation. Irregular cycles with high male hormone signs, normal ovary morphology.",
        "Hyperandrogenism + Polycystic Ovaries. Regular monthly cycles, but high androgen levels and/or cysts present.",
        "Anovulation + Polycystic Ovaries. Irregular cycles and cysts, but completely normal male hormone levels."
    };

    @Override
    public void load() {
        super.load();
        try {
            env = OrtEnvironment.getEnvironment();
            // Load the v4 Rotterdam model (19 input features, 5 Rotterdam phenotype outputs)
            InputStream inputStream = getContext().getAssets().open("pcos_rotterdam_v4.onnx");
            int size = inputStream.available();
            byte[] buffer = new byte[size];
            int read = inputStream.read(buffer);
            inputStream.close();

            if (read != size) {
                throw new Exception("Failed to read the complete model file");
            }

            session = env.createSession(buffer);
            Log.i(TAG, "ONNX Runtime v4: Rotterdam model loaded successfully from assets.");
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
            if (data == null || data.length() < 19) {
                Log.e(TAG, "Invalid input vector length: " + (data == null ? "null" : data.length()));
                call.reject("Invalid input vector. Expected 19 features for Rotterdam v4 model.");
                return;
            }

            // Extract 19 features according to Rotterdam v4 schema
            float[] processedInput = new float[19];
            StringBuilder inputLog = new StringBuilder("Input Vector [19]: ");
            for (int i = 0; i < 19; i++) {
                processedInput[i] = (float) data.getDouble(i);
                inputLog.append(String.format(Locale.US, "%.2f", processedInput[i])).append(i < 18 ? ", " : "");
            }
            Log.d(TAG, inputLog.toString());

            // Assemble tensor and run session
            String inputName = session.getInputNames().iterator().next();
            long[] shape = new long[]{1, 19};
            OnnxTensor inputTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(processedInput), shape);

            try (OrtSession.Result result = session.run(Collections.singletonMap(inputName, inputTensor))) {
                Log.d(TAG, "Inference completed. Result output count: " + result.size());

                long label = -1;
                float[] probsArray = new float[5];

                int index = 0;
                for (Map.Entry<String, OnnxValue> entry : result) {
                    String outputName = entry.getKey();
                    OnnxValue onnxValue = entry.getValue();
                    Object rawValue = onnxValue.getValue();
                    Log.d(TAG, "Output #" + index + " [" + outputName + "] type: " + (rawValue != null ? rawValue.getClass().getName() : "null"));

                    if ("label".equalsIgnoreCase(outputName) || "output_label".equalsIgnoreCase(outputName)) {
                        label = extractLabel(rawValue);
                    } else if ("probabilities".equalsIgnoreCase(outputName) || "output_probability".equalsIgnoreCase(outputName)) {
                        probsArray = extractProbabilities(rawValue);
                    } else {
                        // Fallback parsing based on output index or tensor structure
                        if (index == 0 && label == -1) {
                            label = extractLabel(rawValue);
                        }
                        if (index == 1 || (probsArray[0] == 0 && probsArray[1] == 0 && probsArray[2] == 0)) {
                            float[] parsed = extractProbabilities(rawValue);
                            if (parsed.length >= 5) {
                                probsArray = parsed;
                            }
                        }
                    }
                    index++;
                }

                // If label was not explicitly extracted, determine predicted class from highest probability
                int predictedClassIndex = 0;
                float maxProb = 0.0f;
                if (probsArray.length > 0) {
                    for (int i = 0; i < probsArray.length; i++) {
                        if (probsArray[i] > maxProb) {
                            maxProb = probsArray[i];
                            predictedClassIndex = i;
                        }
                    }
                }

                if (label >= 0 && label < 5) {
                    predictedClassIndex = (int) label;
                }

                // Total PCOS Probability (sum of phenotypes A, B, C, D probabilities or 1 - P_baseline)
                float pcosProbability = 0.0f;
                if (probsArray.length >= 5) {
                    pcosProbability = 1.0f - probsArray[0];
                } else if (probsArray.length > 0) {
                    pcosProbability = predictedClassIndex > 0 ? probsArray[predictedClassIndex] : (1.0f - probsArray[0]);
                }
                pcosProbability = Math.max(0.0f, Math.min(1.0f, pcosProbability));

                boolean isDetected = predictedClassIndex > 0 || pcosProbability >= 0.5f;

                // Risk Level mapping
                String riskLevel;
                if (predictedClassIndex == 0) {
                    riskLevel = "low";
                } else if (predictedClassIndex == 1 || predictedClassIndex == 2) {
                    riskLevel = "high";
                } else {
                    riskLevel = "moderate";
                }

                String phenotypeName = predictedClassIndex < PHENOTYPE_NAMES.length ? PHENOTYPE_NAMES[predictedClassIndex] : "Unknown Phenotype";
                String phenotypeDesc = predictedClassIndex < PHENOTYPE_DESCRIPTIONS.length ? PHENOTYPE_DESCRIPTIONS[predictedClassIndex] : "";
                float confidenceScore = maxProb * 100.0f;

                Log.i(TAG, String.format(Locale.US, "Rotterdam v4 Output -> Predicted Class: %d (%s), PCOS Prob: %.4f, Confidence: %.1f%%, Risk: %s",
                        predictedClassIndex, phenotypeName, pcosProbability, confidenceScore, riskLevel));

                JSObject response = new JSObject();
                response.put("predictedClassIndex", predictedClassIndex);
                response.put("label", predictedClassIndex);
                response.put("probability", (double) pcosProbability);
                response.put("pcosProbability", (double) pcosProbability);
                response.put("confidence", (double) Math.round(confidenceScore * 10.0f) / 10.0f);
                response.put("phenotypeName", phenotypeName);
                response.put("phenotypeDescription", phenotypeDesc);
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
        if (value == null) return new float[]{0.0f, 0.0f, 0.0f, 0.0f, 0.0f};

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
                float[] res = new float[5];
                for (int i = 0; i < 5; i++) {
                    res[i] = getFloatFromMap(map, (long) i, i, String.valueOf(i));
                }
                return res;
            }
        }
        return new float[]{0.0f, 0.0f, 0.0f, 0.0f, 0.0f};
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
