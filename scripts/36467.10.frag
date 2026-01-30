// this is supposed to be a heightfeild water simulation
// but it seems sampler2D is only able to keep values >=0
// making it impossible for the water level to go back down
// if anyone manages to fix this, please leave a comment
// explaining how you did it.
//
// i mean, i'm pretty dumb so it might just be me making
// a beginner's mistake.
//
// ok love you bye.

// don't let it linger - especially near corners!!

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D back;

#define rmouse mouse*resolution

vec2 position(vec2 v) {
  return vec2(v.x/resolution.x,v.y/resolution.y);
}

void main( void ) {

	vec2 pos = position(gl_FragCoord.xy);
	vec2 dx  = position(vec2(1.,0.));
	vec2 dy  = position(vec2(0.,1.));
	
	float dist = length(rmouse.xy-gl_FragCoord.xy);
	float i = 1.-smoothstep(-100.,35.,dist);
	
	vec4 me = texture2D(back,pos);
	float a = texture2D(back,pos+dx).r+texture2D(back,pos+dx+dy).r;
	float b = texture2D(back,pos-dx).r+texture2D(back,pos-dx+dy).r;
	float c = texture2D(back,pos+dy).r+texture2D(back,pos+dx-dy).r;
	float d = texture2D(back,pos-dy).r+texture2D(back,pos-dx-dy).r;
	float av = (a+b+c+d)*.125133;
	
	me.g+=av-me.r;
	me.g*=.999995;
	me.g = clamp(0.,0.9,me.g-0.0005);
	me.r+=me.g-sqrt(av*0.001);
	me.b = log(me.r+me.g+1.);


	gl_FragColor = vec4(me.r,me.g,me.b,1.)+vec4(i,0.,0.,1.);
}

