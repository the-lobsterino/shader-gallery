
// chatgpt - set me up with sound clouds and shit
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;


float noisernd(vec2 uv)
{
    return fract(sin(uv.x * 113. + uv.y * 412.) * 6339.);
}

float noiseSmooth(vec2 uv)
{
    vec2 index = floor(uv);
    
    vec2 pq = fract(uv);
    pq = smoothstep(0., 1., pq);
     
    float topLeft = noisernd(index);
    float topRight = noisernd(index + vec2(1, 0.));
    float top = mix(topLeft, topRight, pq.x);
    
    float bottomLeft = noisernd(index + vec2(0, 1));
    float bottomRight = noisernd(index + vec2(1, 1));
    float bottom = mix(bottomLeft, bottomRight, pq.x);
    
    return (mix(top, bottom, pq.y));
}

float cloud(vec2 uv)
{
	float t = time*0.6;
    uv.x += t / 40.;
    
    vec2 uv2 = uv;
    uv2.x += t / 10.;
    
    vec2 uv3 = uv;
    uv3.x += t / 30.;
        
    float c = noiseSmooth(uv * 4.);
    
    c += noiseSmooth(uv * 8.) * 0.5;
    c += noiseSmooth(uv2 * 16.) * 0.25;
    c += noiseSmooth(uv3 * 32.) * 0.125;
    c += noiseSmooth(uv3 * 64.) * 0.0625;
    return c;	
}

mat2 rotate2D(float r) {
    //return mat2(0.415, 0.415, -sin(r), cos(r));
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float doit(vec2 uv)
{
	uv.y*=5.25;
	uv.x *= 0.215;
    
	
    float t = time*0.46;
	    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
    float d = 0.0;//dot(p,p);
    float S = 17.;
    float a = 0.0;
    mat2 m = rotate2D(12.1);

    for (float j = 0.; j < 6.; j++) {
        p *= m;
        n *= m*0.525;
        q = p * S + t * 4. + sin(t * 1. - d * 8.) * .0018 + 3.*j - .95*n; // wtf???
        a += dot(cos(q)/S, vec2(.256));
        n -= sin(q);
        S *= 1.34;
    }	
	return abs(a);
}



void main() {
    vec2 st = gl_FragCoord.xy/resolution.y;
    float a = doit(st*.55)*10.25;
    st.x *= 0.375;

	float c = cloud(st)*0.565;
	c = clamp(0.1+c*c,0.3,1.0);
	
	vec3 col = vec3(0.15,0.366,0.535);
		
	vec3 color = mix(col,vec3(c,c,c),c);
	
	a = pow(a,3.3);
	a = smoothstep(0.0,1.66,clamp(a,0.0,1.0));
	color += a;
	

    gl_FragColor = vec4(color,1.);
}