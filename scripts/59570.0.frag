/*
 * Original shader from: https://www.shadertoy.com/view/ttcGzS
 * gigatron for glslsandbox
 */

#ifdef GL_ES
precision mediump float;
#endif
 
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
 
#define OCTAVES 6
 

float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	
	float a = random(i + vec2(0.0, 0.0));
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	
	vec2 u = f * f * (3.0 - 2.0 * f);
	
	float result = mix(a, b, u.x) + (c-a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
	
	return result;
	
}

float fbm(vec2 st) {
	float value = 0.0;
	float amplitude = .5;
	float frequency = 0.0;
	
	for (int i = 0; i < OCTAVES; i++) {
		value += amplitude * noise(st);
		st *= 4.0;
		amplitude *= 0.5;
	}
	return value;
}
 

#define rot(ang) mat2(cos(ang), sin(ang), -sin(ang), cos(ang))

float bump(vec3 p)
{
 	float a = fbm(p.xy);
   
    return a / length(p);
}

float sdBox(vec3 p, vec3 b)
{
 	vec3 q = abs(p) - b;
    return max(q.x, max(q.y, q.z)) + bump(p) * 0.05;
}

float map(vec3 p)
{

 // p.xz *= rot(time);
  const float itr = 8.;
  
  for(float i = 0.; i < itr; ++i)
  {
    float ang = 3.1415 * 0.9 + time * 0.1;
   	p = abs(p) - 0.4;

    p.xy *= rot(ang);
    p.yz *= rot(ang);
  	p.xz *= rot(ang);
  }
    
  float d = sdBox(p, vec3(0.3, 1.0, 0.3));
  return d;
}

vec3 norm(vec3 p)
{
    vec2 e = vec2(0.01, 0.0);
 	return normalize(vec3(
    	map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
    	map(p + e.yyx) - map(p - e.yyx)
    ));   
}

bool raymarch(vec3 r0, vec3 rd, float t_min, float t_max, out float d)
{
    d = t_min;
    for(int i = 0; i < 100; ++i)
    {
     	vec3 p = r0 + d * rd;   
        float t = map(p);
        
        d += t;
        if(t < 0.001) return true;
        if(d > t_max) break;
    }
    
    return false;
}


float occ(vec3 r0, vec3 rd)
{
    float occ = 0.0;
    float denom = 0.15;
    for(float i = 0.0; i < 10.0; ++i)
    {
        float stepSize = (i + 1.0) / 20.0;
        denom *= 2.0;
        float t = map(r0 + stepSize * rd);
        occ += (stepSize - t) / denom;
    }
 	return clamp((1.0 - occ), 0.0, 1.0);   
}

vec3 getSkyColor(vec2 uv)
{
    return  mix(vec3(0.1, 0.1, 0.1), vec3(0.2, 0.2, 0.1), length(uv) - 0.25);
}

vec3 shade(vec3 p, vec3 n, vec3 rd)
{
    
    vec3 ld = normalize(vec3(-0.5, 0.5, -0.5));
    vec3 col = (max(dot(n, ld), 0.0)) * vec3(1.28, 1.2, 0.99);
    col += clamp((0.5 * n.y + 0.5), 0.0, 1.0) * vec3(0.16, 0.2, 0.28);
	col += clamp(dot(n, ld * vec3(-1.0, 0.0, -1.0)), 0.0, 1.0) * vec3(0.4, 0.28, 0.2);
    col += smoothstep(0.0, 1.0, occ(p, ld));
    return col * vec3(0.7, 0.8, 0.5) * 0.7;
}


vec2 rand(vec2 val)
{
    return fract(sin(dot(val, vec2(43943.8, 95438.4))) * vec2(29430.6, 92929.3));
}


void main(void)
{
    
    vec2 uv = vec2(gl_FragCoord.xy / resolution.xy);
    vec3 col = vec3(0.0);
    vec2 mouse = mouse.xy / resolution.xy * 500.0;
    
    const int numItr = 1;
    
    for(int i = 0; i < numItr; ++i){
        
        vec2 off = rand(uv + float(i) * 100.);
        uv = (gl_FragCoord.xy + off - 0.5 * resolution.xy) / resolution.y;

		
        vec3 r0 = vec3(12.0 * cos(mouse.x*10.), 2.0, -12.0 * sin(mouse.x*10.));
        vec3 tgt = vec3(0.0);

        vec3 ww = normalize(tgt - r0);
        vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
        vec3 vv = normalize(cross(ww, uu));
        vec3 rd = normalize(uv.x * uu + uv.y * vv + ww);

	
    	float d = 0.0;
        if(raymarch(r0, rd, 0.0, 100.0, d)){

            vec3 p = r0 + d * rd;
            vec3 n = norm(p);

            col += shade(p, n, rd); 
        }
        else
           col += getSkyColor(uv);

    }
    col /= float(numItr);
    col = pow(col, vec3(0.4545));
    gl_FragColor = vec4(col,1.0);
}
 