#ifdef GL_ES
precision mediump float;
#endif

// atari st desktop??

#extension GL_OES_standard_derivatives : enable
#define OCTAVES  8.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand2(vec2 co){
   return fract(cos(dot(co.xy ,vec2(12.9898,78.233))) * 4.5453);
}

float valueNoiseSimple(vec2 vl) {
   float minStep = 1.0 ;

   vec2 grid = floor(vl);
   vec2 gridPnt1 = grid;
   vec2 gridPnt2 = vec2(grid.x, grid.y + minStep);
   vec2 gridPnt3 = vec2(grid.x + minStep, grid.y);
   vec2 gridPnt4 = vec2(gridPnt3.x, gridPnt2.y);

    float s = rand2(gridPnt1);
    float t = rand2(gridPnt3);
    float u = rand2(gridPnt2);
    float v = rand2(gridPnt4);

    float x1 = smoothstep(0., 1., fract(vl.x));
    float interpX1 = mix(s, t, x1);
    float interpX2 = mix(u, v, x1);

    float y = smoothstep(0., 1., fract(vl.y));
    float interpY = mix(interpX1, interpX2, y);

    return interpY;
}

float fractalNoise(vec2 vl) {
    float persistance = 2.0;
    float amplitude = 0.5;
    float rez = 0.0;
    vec2 p = vl;

    for (float i = 0.0; i < OCTAVES; i++) {
        rez += amplitude * valueNoiseSimple(p);
        amplitude /= persistance;
        p *= persistance;
    }
    return rez;
}

float complexFBM(vec2 p) {
    const float NUM_FREQS = 32.0;
    float slow = time / 5.;
    float fast = time / 1.;
    vec2 offset1 = vec2(slow  , 0.);
    vec2 offset2 = vec2(sin(fast)* 0.1, 0.);

    return
        (1. + 0.35) *
        fractalNoise( p + offset1 + fractalNoise(
            p + fractalNoise(
                p + 2. * fractalNoise(p - offset2)
            )
        )
        );
}

vec3 atarist(vec2 p, vec3 col){
	
	
	if (abs(p.x) < 0.8 && abs(p.y) < 0.8) col = vec3(0,1,0);
	if (abs(p.x-0.005*1.5) < 0.5 && abs(p.y+0.01*1.5) < 0.4) col = vec3(0,0,0); 
	if ((abs(p.x)-0.5) < 0.0025 && (abs(p.y)- 0.4) < 0.005) col = vec3(0,0,0); 
	if (abs(p.x) < 0.5 && abs(p.y) < 0.4) col = vec3(1,1,1); 
		
	return col;
}

void main( void ) {
	vec2 fragCoord = gl_FragCoord.xy - mod(gl_FragCoord.xy, vec2(12,24));
	vec2 p =2.0* ( fragCoord.xy / resolution.xy ) -1.0;
	vec3 col = vec3(1.0);
	
	 col = atarist(p,col);
	
	 
	
	vec3 rez = mix(col.xyz, col.xyz * 0.5, complexFBM(p) * 2.0 + p.y * 0.8 - sin((time * 1.0) * 0.9) * 0.1 - 0.95);

	gl_FragColor = vec4(rez,1.0);
}  