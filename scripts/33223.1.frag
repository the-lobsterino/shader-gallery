#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec2 P0 = vec2(-1.0, 0.0);
vec2 P1 = vec2(-0.5, 0.0);
vec2 P2 = vec2(0.5, 0.0);
vec2 P3 = vec2(1.0, 0.0);



float Hash( vec2 p)
{
    vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*3758.5453123);
}

float noise(in vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
	
    f *= f*(3.0-2.0*f);
	
    return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
               mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
               f.y);
}


vec3 bezier(vec2 uv, float t)
{	
	float c = 0.0;
	
	vec2 B = pow((1.0 - t), 3.0) * P0 + 3.0 * t * pow((1.0 - t), 2.0) * P1 + 3.0 * pow(t, 2.0) * (1.0 - t) * P2 + pow(t, 3.0) * P3;
	
	c = distance(uv, B);
	c = smoothstep(0.0, 0.008, c);
	c = 1.0 - c;
	
	return vec3(B, c);
}


void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	vec3 c = vec3(0.0);
	for (float i = 0.0; i < 64.0; i++)
	{
		P0 = mix(vec2(-1.0, 0.1), vec2(-1.0, -0.1), Hash(vec2(i)));
		P1 = mix(vec2(-0.5, 0.2), vec2(-0.5, -0.5), Hash(vec2(i * 2.0)));
		P2 = mix(vec2(0.5, 0.8), vec2(0.5, 0.5), Hash(vec2(i * 3.0)));
		P3 = mix(vec2(1.0, 0.5), vec2(1.0, -0.5), Hash(vec2(i * 4.0)));
		
		float t = fract(time * 0.1 + sin(i));
		c += bezier(uv, t).b*(.5+.5*vec3(.5,.8+.2*cos(time+i*100.),.9+.1*cos(time+i*33.33)));
	}
	
	gl_FragColor = vec4(c,1);
	
	//back_uv += 0.005 * sin(time * 1.0);
	gl_FragColor = max(gl_FragColor, - .01+(
		texture2D(backbuffer, gl_FragCoord.xy / resolution.xy)
		+ texture2D(backbuffer, (gl_FragCoord.xy+vec2(1,1)) / resolution.xy)
		+ texture2D(backbuffer, (gl_FragCoord.xy+vec2(1,0)) / resolution.xy)
		+ texture2D(backbuffer, (gl_FragCoord.xy+vec2(0,1)) / resolution.xy)
		+ texture2D(backbuffer, (gl_FragCoord.xy+vec2(2)) / resolution.xy)
		+ texture2D(backbuffer, (gl_FragCoord.xy+vec2(4)) / resolution.xy)
	)/(6.75-2.5/(2.+length(mouse-gl_FragCoord.xy/resolution))));
}