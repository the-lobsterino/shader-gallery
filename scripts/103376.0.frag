#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

vec3 C = vec3(0.2, 0.0, 1.0);
float GWM = 1.05;
float TM = 0.0025;

float getAmp(float frequency) {
    return frequency / 512.0;
}

float getWeight(float f) {
    return (getAmp(f - 2.0) + getAmp(f - 1.0) + \
            getAmp(f + 2.0) + getAmp(f + 1.0) + \
            getAmp(f)) / 4.0;
}

void main()
{    
    vec3 backdrop = mix(C, C, C);
    vec2 uvTrue = fragCoord.xy / vec2(1980, 1080);
    vec2 uv = 2.8 * uvTrue - 1.0;
    
	float li;
    float gw;
    float ts;
    vec3 color = vec3(0.1);
    
	for(float i = 0.0; i < 3.0; i++) {
		uv.y += (0.2 * sin(uv.x + i / 7.0 - iTime * 0.6));
        float Y = uv.y + getWeight(pow(i, 2.0) * 20.0) * (uvTrue.x - 0.5);
        li = 0.4 + pow(1.6 * abs(mod(uvTrue.x + i / 1.1 + (iTime/2.), 2.0) - 1.0), 2.0);
		gw = abs(li / (150.0 * Y));
        
        ts = gw * (GWM + sin(iTime * TM));
		color += vec3(ts, ts, ts);
	}	

	fragColor = vec4(color + backdrop, 0.8);
}