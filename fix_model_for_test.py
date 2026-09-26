import onnx

model_path = 'android/app/src/main/assets/pcos_app_model_v3.onnx'
output_path = 'pcos_model_fixed.onnx'

try:
    print(f"Opening model: {model_path}")
    model = onnx.load(model_path)

    # Change the opset version from 22 to 21 for local compatibility
    for opset in model.opset_import:
        if opset.domain == '' or opset.domain == 'ai.onnx':
            print(f"Current Opset: {opset.version} -> Changing to 21")
            opset.version = 21

    onnx.save(model, output_path)
    print(f"Success! Use '{output_path}' for local testing.")
except Exception as e:
    print(f"Error: {e}")
