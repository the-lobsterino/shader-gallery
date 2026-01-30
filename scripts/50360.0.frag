// dohshit edits 4 u
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			 dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
	const float K1 = 0.366025404; // (sqrt(3)-1)/2;
	const float K2 = 0.211324865; // (3-sqrt(3))/6;
	
	vec2 i = floor( p + (p.x+p.y)*K1 );
	
	vec2 a = p - i + (i.x+i.y)*K2;
	vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
	
	vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	
	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
	
	return dot( n, vec3(70.0) );
}

float fbm(vec2 uv)
{
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
	
	float f;
	for (float i = 0.0; i < 6.0; ++i) {
		f += (i/10.0)*noise(uv *= m);
	}
	return f*.5+.6;
}

mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}


vec3 DOGSHIT(vec2 pos, float rot)
{
	pos *= rotate(rot);
	
	float val = (0.5+sin(time*2.0)*6.5)*5.5;
	
 	float x=pow(abs(pos.x), 1.45-val);
	
	float col=fbm(pos*2.0+vec2(time*0.25+val,-time*0.35))/x;
	
	return vec3(0.95*col*col, 0.4*col*col, 0.3*col*col)*(pos.x*pos.x)*1.1;
}


	

void main( void )
{
	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;

	
	pos *= 8.0+cos(time)*10.5;
	
	float d = length(pos) * 2.0;
	
	float m1 = abs(pos.y);
	

	pos *= (2.25+(5.0+sin(time*0.25)*0.5)*.01)*3.0*rotate(sin(time)*2.0);
	
	
	vec3 color1 = DOGSHIT(pos, 0.0);
	vec3 color2 = DOGSHIT(pos, radians(90.0));
	vec3 color3 = DOGSHIT(pos, radians(45.0));
	vec3 color4 = DOGSHIT(pos, radians(135.0));

	vec3 colorx = max(color1,color2) * max(color3, color4) * 20.0;
	vec3 color = color1*color2*color3*color4;
	
	color = mix(color,colorx,0.5+sin(d*d+time*1.5)*0.5);
	
	gl_FragColor=vec4(color, 0.3);

}