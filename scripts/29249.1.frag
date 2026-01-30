#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535
#define RADIUS 0.01
#define SPEED 0.00155

const vec3 TOP = vec3(.004, .016, .046);
const vec3 BOTTOM = vec3(.005, .102, .334);


mat2 rot( in float a ) {
    float c = cos(a);
    float s = sin(a);
	return mat2(c,s,-s,c);	
}

// noise function
float noise( in vec2 p ) {	
    return sin(p.x) * .25 + sin(p.y) * .25 + .50;
}

// get the space color
vec3 getSpaceColor( in vec3 dir ) {

    vec2 uv = vec2(atan(dir.y, dir.x) / (2.0 * PI) + 0.5, mod(dir.z, 1.0));
    uv.x = mod(uv.x+2.0*PI, 1.0);
    uv.x *= 100.0;
    uv.y *= 15.00;
    uv *= rot(1.941611+time*SPEED);
    vec2 center = floor(uv) + 0.5;
    center.x += noise(center*48.6613) * 0.8 - 0.4;
    center.y += noise(center*-31.1577) * 0.8 - 0.4;
    float radius = smoothstep(0.6, 1.0, noise(center*42.487+
                                              vec2(0.1514, 0.1355)*time)); 
    radius *= RADIUS;
    vec2 delta = uv-center;
    float dist = dot(delta, delta);
    float frac = 1.0-smoothstep(0.0, radius, dist);
    frac *= frac; frac *= frac; frac *= frac;
    
    return vec3(1)*frac;
}


void main( void ) {


    	vec2 position = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
	position.y *= resolution.y / resolution.x;
	
	vec3 grad = mix(BOTTOM, TOP, position.y);
	
	vec3 dir = normalize(vec3(position.x*1.0, 1.0, position.y*-1.0));    
	dir.xy *= rot(PI*.5);
    	
	grad += getSpaceColor(dir);
    
    	gl_FragColor = vec4(grad, 1.0);
    
}