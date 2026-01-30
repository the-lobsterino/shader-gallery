#ifdef GL_ES
precision mediump float;
#endif

// willy wanker willy
uniform float time;
uniform vec2 mouse; 
uniform vec2 resolution;

float clamps(float val) {
	return clamp(val,0.,1.);	
}

float distanceToSegment( in vec2 p, in vec2 a, in vec2 b )
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	
	return length( pa - ba*h );
}
//Suck my dick faggot
void main( void ) {
	vec2 uv = ((( gl_FragCoord.xy / resolution.xy )-0.5)*vec2(2.,1.))+0.5;;
	float balpos = 2.0*sin(time*80.)/60.;
        float a = 1.-clamps((length(uv-vec2(0.4,0.32+balpos))-0.1)*900.);
	a += 1.-clamps((length(uv-vec2(0.6,0.32+balpos))-0.1)*500.);
	float b = (sin(time*60.))/30.;
	a += 1.-clamps((distanceToSegment(uv,vec2(0.5,0.4),vec2(0.5,0.75+b))-0.1)*500.);
	a -= 1.-clamps((distanceToSegment(uv,vec2(0.5,0.8+b),vec2(0.5,0.9+b))-0.01)*500.);
	a = clamps(a);
	float c = clamps((uv.y-0.74-b)*600.);
	vec3 colors = vec3(a/4.0,a/1.4-c,(a/2.));
	gl_FragColor = vec4(vec3(colors),1.);
	
}