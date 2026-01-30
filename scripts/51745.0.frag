#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415926535897932384626433832795;
const float PI_2 = 1.5707963267948966192313216916398;
const float noiseWidth = 8.0;

float rand(vec2 p){
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p){
	p = floor(p) + 10.0;
	return fract(floor(4713292747.0 * p.x * p.x * p.y * p.y / 64.0) / 16777216.0);
}

float smoothNoise(vec2 p){
	vec2 f = fract(p);
	vec2 p1 = mod(floor(p + noiseWidth), noiseWidth);
	vec2 p2 = mod(floor(p + noiseWidth - 1.0), noiseWidth);
	float v = 0.0;
	v += f.x * f.y * noise(p1);
	v += (1.0-f.x) * f.y * noise(vec2(p2.x, p1.y));
	v += f.x * (1.0-f.y) * noise(vec2(p1.x, p2.y));
	v += (1.0-f.x) * (1.0-f.y) * noise(p2);
	return v;
}

float perlinNoise(vec2 p){
	float r = 0.0;
	float s = 64.0;
	for(int n = 0; n < 6; n++){
		r += smoothNoise(p / s) * s;
		s /= 2.0;
	}
	return r / 128.0;
}

float atan2(float y, float x){
	if(x == 0.0){
		return sign(y) * PI_2;
	}else{
		float a = atan(y/x);
		if(x < 0.0) a += PI;
		if(a > PI) a -= 2.0 * PI;
		return a;
	}
}

void main( void ) {
	
	// --- constants ---
	
	const bool STARS=false;
	
	const float r = 1.0;
	const vec3 cam = vec3(0.0, 0.0, 2.0*r);
	const vec3 light = vec3(-10.0, -3.0, 8.0);
	const float light_r = 10.0 * r;
	const vec3 light_n = vec3(0.3, 1.0, 0.0);
	const vec3 k_amb = vec3(0.3, 0.3, 0.4);
	const vec3 k_diff = vec3(0.6, 0.9, 1.0);
	const float k_spec = 0.05;
	const vec3 i_amb = vec3(0.1, 0.1, 0.2);
	const vec3 i_diff = vec3(1.0, 1.0, 1.0);
	const vec3 i_spec = vec3(1.0);
	const float alpha = 2.0;
	
	
	vec2 p = cam.z*mouse.y * (2.0 * gl_FragCoord.xy - resolution) / resolution.y + cam.xy;
	
	float z2 = r*r - p.x*p.x - p.y*p.y;
	
	vec3 color;
	
	if(z2 >= 0.0){
		vec3 light_u = normalize(cross(light_n, light_n+1.0));
		vec3 light_v = normalize(cross(light_u, light_n));
		vec3 light = light_r * (light_u * cos(1.0) + light_v * sin(1.0));
		
		vec3 P = vec3(p, sqrt(z2));
		vec3 N = P/r; // ||P|| = r
		vec3 L = normalize(light - P);
		vec3 V = normalize(cam - P);
		
		vec2 texcoord = vec2(atan2(P.z, P.x) / PI * noiseWidth + time/100.0, acos(P.y / r) / PI * noiseWidth);
		float tex = perlinNoise(texcoord * mouse.y*60.);
		vec3 t_amb = k_amb;
		vec3 t_diff;
		vec3 t_spec;
		float t_alpha;
		
		float lat = abs((2.0 * texcoord.y / noiseWidth) - 1.0);
		
		if(tex <0.44*mouse.x){
			t_diff = k_diff * tex + vec3(0.3, 0.4, 0.8) * (0.8 - tex);
			t_spec = vec3(0.3);
			t_alpha = 4.0;
		}else if(tex < 0.46){
			t_diff = vec3(0.9, 0.8, 0.6) * tex + vec3(0.3, 0.8, 0.4) * (0.6 - tex) / 0.2;
		}else if(tex < 0.56){
			t_diff = vec3(0.3, 0.7, 0.4) * tex + vec3(0.1, 0.7, 0.2) * (0.56 - tex) / 0.14;
			t_spec = vec3(0.1);
			t_alpha = alpha;
		}else if(tex < 0.70){
			t_diff = vec3(0.1, 0.7, 0.2) * tex;
			t_spec = vec3(0.1);
			t_alpha = alpha;
		}else{
			t_diff = vec3(0.9, 0.7, 0.6) * tex;
		}
		t_amb = t_diff * 0.5;
		
		color = i_amb * t_amb;
		
		color.z = tex;
		
		float LN = dot(L, N);
		if(LN >= 0.0){
			color += t_diff * LN * i_diff;
			vec3 R = 2.0 * LN * N - L;
			float RV = dot(R, V);
			if(RV >= 0.0){
				color += t_spec * pow(RV, t_alpha) * i_spec;
			}
		}
	}else{
		if(rand(p) >0.99){
			if (STARS){
			 color = vec3(1.0);
			}
		}else{
			color = vec3(0.0);
		}
	}
	
	gl_FragColor = vec4(color, 1.0);

}