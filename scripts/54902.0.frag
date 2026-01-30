#ifdef GL_ES
precision highp float;
#endif

    const int sizeI = 4;
    const float sizeF = 4.0;

    varying vec2 vUv;
    uniform sampler2D inputDensityField;
    uniform vec2 inputResolution;

float random (vec2 co) {
	return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

    void main() {

	    vec2 co = gl_FragCoord.xy/inputResolution.xy;
	    float rnd = random(co);
	    gl_FragColor = vec4(vec3(rnd),1.0); 
	    return;
	    
	    
	    
	    
      // get the current box position
      vec2 outputResolution = vec2(ceil(inputResolution.x / sizeF), ceil(inputResolution.y / sizeF));
      vec2 box = vec2(floor(gl_FragCoord.x), floor(gl_FragCoord.y));
      vec2 uv = vec2(gl_FragCoord.x / outputResolution.x, gl_FragCoord.y / outputResolution.y);
      vec2 boxOrigin = (box * sizeF) + 0.5;

      // get all colors from the box and select the largest one
      gl_FragColor = vec4(0.0);
      for (int x = 0; x < sizeI; x++)
      {
        for (int y = 0; y < sizeI; y++)
        {
          vec2 inputCoords = vec2(boxOrigin.x + float(x), boxOrigin.y + float(y));
		  inputCoords.x = clamp(inputCoords.x / inputResolution.x, 0.0, 1.0);
		  inputCoords.y = clamp(inputCoords.y / inputResolution.y, 0.0, 1.0);
		  
          vec4 currentDensity = texture2D(inputDensityField, inputCoords);
		  
          gl_FragColor.r = max(gl_FragColor.r, currentDensity.r);
          gl_FragColor.g = max(gl_FragColor.g, currentDensity.g);
          gl_FragColor.b = max(gl_FragColor.b, currentDensity.b);
          gl_FragColor.a = max(gl_FragColor.a, currentDensity.a);
        }
      }
    }