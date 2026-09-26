package com.aura.health;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.InputStream;
import java.nio.FloatBuffer;
import java.util.Collections;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtSession;

@CapacitorPlugin(name = "OnnxPredictor")
public class OnnxPredictorPlugin extends Plugin {

    private OrtEnvironment env;
    private OrtSession session;

    @Override
    public void load() {
        super.load();
        try {
            env = OrtEnvironment.getEnvironment();
            // Load the new v3 model with internal scaling
            InputStream inputStream = getContext().getAssets().open("pcos_app_model_v3.onnx");
            int size = inputStream.available();
            byte[] buffer = new byte[size];
            int read = inputStream.read(buffer);
            inputStream.close();
            
            if (read != size) {
                throw new Exception("Failed to read the complete model file");
            }
            
            session = env.createSession(buffer);
            System.out.println("ONNX Runtime v3: Model loaded successfully from assets.");
        } catch (Exception e) {
            System.err.println("ONNX Runtime: Failed to load model - " + e.getMessage());
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void runInference(PluginCall call) {
        if (session == null) {
            call.reject("Model not initialized.");
            return;
        }

        try {
            JSArray data = call.getArray("data");
            if (data == null || data.length() < 16) {
                call.reject("Invalid input vector. Expected 16 features for v3 model.");
                return;
            }

            // --- V3 DIRECT PASS: No Manual Scaling, 16 Features ---
            float[] processedInput = new float[16];
            for (int i = 0; i < 16; i++) {
                processedInput[i] = (float) data.getDouble(i);
            }

            // Assemble tensor and run
            String inputName = session.getInputNames().iterator().next();
            long[] shape = new long[]{1, 16};
            OnnxTensor inputTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(processedInput), shape);

            try (OrtSession.Result result = session.run(Collections.singletonMap(inputName, inputTensor))) {
                JSObject response = new JSObject();
                
                // Extract label and probabilities
                long label = ((long[]) result.get(0).getValue())[0];
                float[][] probs = (float[][]) result.get(1).getValue();
                
                // Pass raw probabilities directly (v3 model handles bias internally)
                response.put("probability", probs[0][1]);
                response.put("label", (int) label);
                call.resolve(response);
            }
        } catch (Exception e) {
            call.reject("Inference failed: " + e.getMessage());
        }
    }
}
