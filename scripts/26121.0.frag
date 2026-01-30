#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 q = gl_FragCoord.xy/resolution.xy;
	vec2 p = q*2.-1.;
	p.x *=resolution.x/resolution.y;
	vec2 pb = p;
	float sss = 112.*sin(time*0.01)+100.;
	float f = length(p)*sss;
	float ss = sin(f);
	float cs = cos(f);
        mat2 m= mat2(ss,cs,-cs,ss);
	p *=m;
	float st = sin(time);
	float ct = cos(time);
	mat2 m2 = mat2(st,ct,-ct,st);
	p *=m2;
	float s = p.x*20.;

	float c = smoothstep(0.5,0.6,length(p));
	vec3 col = mix(vec3(.5,.3,.2),vec3(s),(1.-c));
	
	gl_FragColor = vec4( col, 1.0 );
}