#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float InsideTri (vec2 A, vec2 B, vec2 C, vec2 P);
void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	vec2 arrw[1000];
	vec2 arrb[1000];
	
	arrw[0] = vec2(0.25, 0.2);
	arrw[1] = vec2(0.5, 0.9);
	arrw[2] = vec2(0.75, 0.2);
	
	int offw = 1;
	
	float maxTri;
	for (int x = 0; x < 1; x++){ //for each layer
		maxTri = pow(3.0, float(x));
		for (int y = 0; y < 27; y++){ //for each triangle
			if (float(y) > maxTri) break;
			
		}
		
		offw += int(maxTri);
	}

	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * 0.0;
}

float InsideTri (vec2 A, vec2 B, vec2 C, vec2 P) {
 	
    // Compute vectors        
    vec2 v0 = C - A;
    vec2 v1 = B - A;
    vec2 v2 = P - A;

    // Compute dot products
    float dot00 = dot(v0, v0);
    float dot01 = dot(v0, v1);
    float dot02 = dot(v0, v2);
    float dot11 = dot(v1, v1);
    float dot12 = dot(v1, v2);

    // Compute barycentric coordinates
    float invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
    float u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    float v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is in triangle
    return (clamp(min( 1.0+floor(min(min(u, v), 0.0)), 1.0 - ceil(max(u + v, 1.0) - 1.0) ), 0.0, 1.0));
    //return (u >= 0) && (v >= 0) && (u + v < 1)
    
}