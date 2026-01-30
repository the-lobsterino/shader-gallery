#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

// wip again, radial propagation alt approach & tweaks
// avoids badly distorted zooming by moving the edges around
// in polar coords instead of using oversampled video feedback
// first version:    http://glslsandbox.com/e#23511.3
// another version:  http://glslsandbox.com/e#24146.0

void main(void)
{
	vec2 pos = (gl_FragCoord.xy/resolution-0.5)*vec2(resolution.x/resolution.y,1.0);
	float hist = 
		texture2D(buf,vec2(length(pos),fract(atan(pos.y,pos.x)/6.2831853))).a;
		//texture2D(buf,gl_FragCoord.xy/resolution).a;
	float new = gl_FragCoord.x < 5.0 ? step(0.5,fract(mouse.x*4.0-pos.y)) :
		texture2D(buf,(gl_FragCoord.xy-vec2(1.0,0.0))/resolution).a;
	vec3 color1 = vec3(1.0,0.0,0.0);
	vec3 color2 = vec3(0.0,0.0,1.0);
	gl_FragColor = vec4(mix(color1,color2,hist), new);
}