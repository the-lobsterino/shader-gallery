#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float fade(float t) { return t * t * t * (t * (t * 6. - 15.) + 10.); }

float getTable3(vec3 i, vec3 f) {
	//patterns are caused by garbage hashing function
	float yaw = dot(i, vec3(6332, 5949, 4950));
	float pitch = dot(i, vec3(2965, 9268, 2398));
	
    return dot(f - i, normalize(vec3(cos(yaw)*cos(pitch), sin(yaw)*cos(pitch), sin(pitch))));
}

float perlinNoise(vec3 vec) {
    vec3 i  = floor(vec);
    vec3 f  = fract(vec);
    vec3 mmpt = vec3(fade(f.x), fade(f.y), fade(f.z));
    
	float n0 = getTable3(i + vec3(0, 0, 0), vec);
	float n1 = getTable3(i + vec3(1, 0, 0), vec);
	float n2 = getTable3(i + vec3(0, 1, 0), vec);
	float n3 = getTable3(i + vec3(1, 1, 0), vec);
	
	float n4 = getTable3(i + vec3(0, 0, 1), vec);
	float n5 = getTable3(i + vec3(1, 0, 1), vec);
	float n6 = getTable3(i + vec3(0, 1, 1), vec);
	float n7 = getTable3(i + vec3(1, 1, 1), vec);
	
	float n8 = mix(mix(n0, n1, mmpt.x), mix(n2, n3, mmpt.x), mmpt.y);
	float n9 = mix(mix(n4, n5, mmpt.x), mix(n6, n7, mmpt.x), mmpt.y);
	
	return mix(n8, n9, mmpt.z);
}

float fbm(vec3 uv) {
    float finalNoise = 0.;
    finalNoise += .50000*perlinNoise(vec3(2.,2., 1.)*uv);
	finalNoise += .25000*perlinNoise(vec3(4.,4., 1.)*uv);
	finalNoise += .12500*perlinNoise(vec3(8.,8., 1.)*uv);
	finalNoise += .06250*perlinNoise(vec3(16.,16., 1.)*uv);
	finalNoise += .03125*perlinNoise(vec3(32.,32., 1.)*uv);
    
    return finalNoise;
}

void main() {
	gl_FragColor = vec4( vec3( fbm(vec3(gl_FragCoord.xy / resolution.y * 100., time)) + .5 ), 1.0 );
}