#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


float hash( float g ) {
    return fract(sin(g)*43758.5453123);//*sin(time*0.00001));
}


float noise( in vec2 x )
{
	vec2 p = floor(x);
	vec2 f = fract(x);
	f = f*f*(3.0-2.0*f);
	float n = p.x + p.y*57.0;
	//float res = hash(n+  0.0);//+ hash(n+  1.0);
	float res = mix(mix( hash(n+0.0), hash(n+1.0),f.x), mix(hash(n+57.0), hash(n+58.0), f.x), f.y);
	return res;
}


mat2 m  = mat2(0.8, 0.6, -0.6, 0.8);

float fbm(vec2 p) {
	float f = 0.0;
	f += 0.5000*noise( p ); p*=m*2.02;
	f += 0.2500*noise( p ); p*=m*2.02;
	f += 0.1250*noise( p ); p*=m*2.02;
	f += 0.0625*noise( p ); p*=m*2.02;
	f /= 0.9375;
	return f;
}




void main(void) {

	vec2 q = gl_FragCoord.xy/ resolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= resolution.x / resolution.y;
	
	float bkgd = smoothstep(-0.5,0.5,p.x);
	
	p.x -= 0.2;
	float r = sqrt(dot(p,p));
	float a = atan(p.y, p.x);
	
	vec3 col = vec3(1.0);
	
	if (r < 0.8) {
		col = vec3(0.2, 0.3, 0.4);
	
		float f = fbm( 5.0*p );
		col = mix(col,vec3(0.2,0.5,0.4),f);
		
		f = 1.0 - smoothstep(0.2, 0.5, r);
		col = mix(col, vec3(0.9, 0.6, 0.2), f);
		
		f = fbm(vec2(r,20.*a));
		col = mix(col,vec3(1.0),f);
		
		f = smoothstep(0.2,0.25,r);
		col *= f;
		
	}
 
  gl_FragColor = vec4(col*bkgd,1.0);
}