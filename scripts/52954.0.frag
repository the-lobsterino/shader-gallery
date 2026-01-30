#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float x, float y) { return fract(sin(403.321+x) * (y+321.123) * 456.654); }
float perlin(vec2 uv) {
 float col = 0.;
 for (int i=0; i<8; i++) {
	vec2 f1=floor(uv), c1=f1+1.;
	col += mix(	mix(hash(f1.x, f1.y), hash(f1.x, c1.y), fract(uv.y)),
			mix(hash(c1.x, f1.y), hash(c1.x, c1.y), fract(uv.y)), fract(uv.x));
	col*=.5; uv*=.5;
 }
 return col;
}

void main( void ) {
 vec2 p = (( gl_FragCoord.xy / resolution.xy ) )*700.0;
 vec2 uv=p+perlin(p)*600.0* cos(time*.2);
 float color = perlin(p + perlin(uv)*600.0 * mouse);
 gl_FragColor = vec4( vec3( sin(uv.y/4.0)*.8 , color*1.2 - sin(uv.x/40.)*.01, color*9.4) , 1. );
}