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
            InputStream inputStream = getContext().getAssets().open("pcos_app_model.onnx");
            byte[] modelBytes = new byte[inputStream.available()];
            inputStream.read(modelBytes);
            inputStream.close();
            session = env.createSession(modelBytes);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void runInference(PluginCall call) {
        if (session == null) {
            call.reject("Model not loaded");
            return;
        }

        try {
            JSArray inputData = call.getArray("data");
            if (inputData == null) {
                call.reject("Input data is missing");
                return;
            }

            float[] floatInput = new float[inputData.length()];
            for (int i = 0; i < inputData.length(); i++) {
                floatInput[i] = (float) inputData.getDouble(i);
            }

            // Create input tensor (assuming [1, N] shape for small models)
            long[] shape = new long[]{1, floatInput.length};
            OnnxTensor inputTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(floatInput), shape);
            
            // Get the first input name from the model
            String inputName = session.getInputNames().iterator().next();
            
            // Run inference
            OrtSession.Result result = session.run(Collections.singletonMap(inputName, inputTensor));
            
            // Assume the first output is what we want
            float[][] output = (float[][]) result.get(0).getValue();
            
            JSObject ret = new JSObject();
            JSArray outArray = new JSArray();
            for (float f : output[0]) {
                outArray.put(f);
            }
            ret.put("results", outArray);
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("Inference failed: " + e.getMessage());
        }
    }
}
