#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MX_DIST 0.00225

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 draw_circle(vec2 pos)
{
	float mx = min(resolution.x, resolution.y);
	
	vec2 uv = ( (gl_FragCoord.xy - (pos*resolution.xy)) / mx );
	
	float dist = dot(uv, uv);

	vec4 bk = vec4(vec3(0.1, 0.3, 0.5), 0);
	
	if ( dist < MX_DIST ){
		float ang = atan(uv.y,uv.x)+(time+uv.x-uv.y);
		float a = smoothstep(0.0,1.0,(MX_DIST-dist)/MX_DIST);
		float tooth = clamp(sin(ang*8.0)*cos(ang*23.0)*a+0.25, 0.25, 1.0)+0.6;
		bk = mix(vec4(0.65, 0.68, 1.0, 1.0) + tooth, bk, a);
		bk.a = a;
	}
	
	return bk;
}

#define PI 3.1415926535897932384626433832795
#define PI2 PI*2.0
#define N 1

vec4 dd(float d)
{
	vec4 bk = vec4(vec3(0.1, 0.3, 0.5), 0.0);
	
	for (float r = 0.0; r < 10.0; r += 0.21){
		for (int i = 0; i < 8; i += 1){
			float x = cos(PI2/float(N) * (float(i)) + d * (r + time*0.47)) / 1.0 * float(r)/resolution.x/0.015;
			float y = sin(PI2/float(N) * (float(i)) + d * (r + time*0.47)) / 1.0 * float(r)/resolution.y/0.015;
			
			float xx,yy,aa=time*1.5;
			
			xx = cos(aa) * x - sin(aa) * y;
			yy = sin(aa) * x + cos(aa) * y;
			
			vec4 col = draw_circle(vec2(0.5 + xx, 0.5 + yy));
			bk = mix(bk, col, col.a);
		}
	}
	
	return bk;
}
void main( void ) {
	
	vec4 bk = vec4(vec3(0.1, 0.3, 0.5), 0.0);
	
	bk = dd(-1.0);
	
	bk = mix(dd(1.0), bk, 0.5);
	
	//bk = mix(bk, draw_circle(vec2(0.5, 0.5)), 1.0);
	
	gl_FragColor = vec4(bk);
}