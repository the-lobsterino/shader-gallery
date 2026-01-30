#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.141592653589793;

float sinNoise(in vec2 pos) {
  return 0.5 * (sin(pos.x) + sin(pos.y));
}

const mat2 m2 = mat2(0.8, -0.6, 0.8, 0.6);
const vec2 v2 = vec2(-3.7, 11.4);

float mapH(in vec3 pos) {
    float h = 0.0;
    vec2 q = pos.xz * 0.5;
    float s = 0.5;
    for (int i = 0; i < 5; i++){
        h += s * sinNoise(q);
        s *= 0.49;
        q = m2 * q * 1.7;
        q += v2;
    }
    
    return pos.y + h * 3.0;
}

float map(in vec3 pos) {
    return min(mapH(pos), 1.);   
}

vec3 calcNormal(in vec3 pos) {
    vec3 nor;
    vec2 e = vec2(0.1, 0.0);
    
    nor.x = map(pos + e.xyy) - map(pos - e.xyy);
    nor.y = map(pos + e.yxy) - map(pos - e.yxy);
    nor.z = map(pos + e.yyx) - map(pos - e.yyx);
    
    return normalize(nor);
}

mat3 axis_x_rotation_matrix(float angle) {
	return mat3(1.0, 0.0, 0.0,
		    0.0, cos(angle), -sin(angle),
		    0.0, sin(angle), cos(angle));
}
 
mat3 axis_y_rotation_matrix(float angle) {
	return mat3(cos(angle), 0.0, sin(angle),
		    0.0, 1.0, 0.0,
		    -sin(angle), 0.0, cos(angle));
}

void main( void ) 
{
	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 ro = vec3(0.0, 2.0, -2.0 * time);
	vec3 rd = normalize( vec3( (uv * 1.0 - 0.5) * vec2(resolution.x / resolution.y, 1.0), -1.0) );
	vec3 p = vec3(0.0);
	
	mat3 rotation = axis_x_rotation_matrix((mouse.y * 1.0 - 0.5) * PI);
	rotation *= axis_y_rotation_matrix((0.5 - mouse.x * 1.0) * PI);
	
	rd *= rotation;

	float tmax = 80.0;
    float t = 0.0;
    
    for (int i = 0; i < 86; i++) {
      vec3 pos = ro + rd * t;
        float h = map(pos);
        if (h < 0.001 || t > tmax) break;
        t += h * 0.5;
    }
    
    vec3 color;
    vec3 light = normalize(vec3(1.0,1.0,0.15));
    
    if (t < tmax) {
        vec3 pos = ro + rd * t;
        vec3 nor = calcNormal(pos);
        vec3 mat = vec3(0.3, 0.5, 0.1);
	
	if (fract(pos.x * .35) > .02)
		if (fract(pos.z * .35) > .02)
			mat = vec3(0, 1, 0.5);
				
        vec3 diff = max(0.0, dot(light, nor))*vec3(1.5);
        color = mat * (diff);
        
        color = mix(vec3(0.6, 0.7, 0.8), color, 11./t);
    }
    
    gl_FragColor = vec4(color, 1.0);
}