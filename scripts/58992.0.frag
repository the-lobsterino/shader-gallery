#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const vec3 atmosphereColor = vec3(0.3, 0.6, 1.0) * 1.6;

vec3 shadowedAtmosphereColor(vec2 fragCoord, vec2 iResolution, float minVal) {
    vec2 rel = 0.65 * (fragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    const float maxVal = 1.0;
    
    float a = min(1.0,
                  pow(max(0.0, 1.0 - dot(rel, rel) * 6.5), 2.4) + 
                  max(abs(rel.x - rel.y) - 0.35, 0.0) * 12.0 +                   
                  max(0.0, 0.2 + dot(rel, vec2(2.75))) + 
                  0.0
                 );
    
    float planetShadow = mix(minVal, maxVal, a);
    
    return atmosphereColor * planetShadow;
}


void main( void ) {

	vec2 delta = (gl_FragCoord.xy - vec2(1920, 1080) * 0.5) / resolution.y * 1.1;
	float atmosphereRadialAttenuation = min(1.0, 0.06 * pow(max(0.0, 1.0 - (length(delta) - 0.9) / 0.9), 8.0));
	vec3 c = shadowedAtmosphereColor(vec2(0.5)/*gl_FragCoord.xy*/, vec2(0.5)/*resolution.xy*/, 0.5);
	//vec3 c = xf(gl_FragCoord.xy, resolution.xy, 0.5);
	c *= atmosphereRadialAttenuation;
	gl_FragColor = vec4( c, 1.0 );
}